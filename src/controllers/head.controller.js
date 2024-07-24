import { Head } from '../models/head.model.js';
import { Policy } from '../models/policy.model.js';
import { apiResponse } from '../utils/apiresponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { apiError } from '../utils/apiError.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

const generateHeadId = async () => {
    let headId = 'AIBHS' + ('' + Math.random()).substring(2, 7);
    let checkHead = await Head.findOne({ headId });
    while (checkHead) {
        headId = 'AIBHS' + ('' + Math.random()).substring(2, 7);
        checkHead = await Head.findOne({ headId });
    }
    return headId;
};

const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};

const generateTokens = async (id) => {
    try {
        const head = await Head.findById(id);
        const accessToken = await head.generateAccessToken();
        const refreshToken = await head.generateRefreshToken();

        head.refreshToken = refreshToken;
        await head.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new apiError(500, 'Error generating tokens.');
    }
};

const registerHead = asyncHandler(async (req, res) => {
    const { name, password, title, contactDetails, hireDate } = req.body;

    if (!(name || password || title || contactDetails || hireDate)) {
        throw new apiError(400, 'All fields are required.');
    }

    const hashedPassword = await hashPassword(password);
    const headId = await generateHeadId();
    console.log(headId);
    const head = await Head.create({
        headId,
        name,
        password: hashedPassword,
        title,
        contactDetails,
        hireDate,
    });

    return res
        .status(201)
        .json(new apiResponse(201, head, 'Head registered successfully.'));
});

const loginHead = asyncHandler(async (req, res) => {
    const { headId, password } = req.body;
    if (!(headId || password)) {
        throw new apiError(400, 'All fields are required.');
    }
    const head = await Head.findOne({ headId });
    if (!head) {
        throw new apiError(404, 'Head not found.');
    }
    const isMatch = await head.isPasswordCorrect(password);

    if (!isMatch) {
        throw new apiError(401, 'Invalid credentials.');
    }

    const { accessToken, refreshToken } = await generateTokens(head._id);

    const loggedInHead = await Head.findById(head._id).select(
        '-password -refreshToken'
    );

    const options = {
        httpOnly: false,
        secure: true,
        sameSite: 'None',
    };

    return res
        .status(200)
        .cookie('refreshToken', refreshToken, options)
        .cookie('accessToken', accessToken, options)
        .json(
            new apiResponse(
                200,
                {
                    head: loggedInHead,
                    accessToken,
                    refreshToken,
                },
                'Head logged in successfully.'
            )
        );
});

const logoutHead = asyncHandler(async (req, res) => {
    const head = res.head;
    await Head.findByIdAndUpdate(
        head._id,
        {
            $unset: {
                refreshToken: 1,
            },
        },
        {
            new: true,
        }
    );

    const options = {
        httpOnly: false,
        secure: true,
        sameSite: 'None',
    };

    return res
        .status(200)
        .clearCookie('accessToken', options)
        .clearCookie('refreshToken', options)
        .json(new apiResponse(200, {}, 'Head logged out successfully.'));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken =
        req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new apiError(401, 'Refresh token missing.');
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.HEAD_REFRESH_TOKEN_SECRET
        );
        const head = await Head.findById(decodedToken._id);

        if (!head) {
            throw new apiError(404, 'Head not found.');
        }

        if (head.refreshToken !== incomingRefreshToken) {
            throw new apiError(401, 'Refresh token expired.');
        }

        const { accessToken, refreshToken } = await generateTokens(head._id);

        const options = {
            httpOnly: false,
            secure: true,
            sameSite: 'None',
        };

        return res
            .status(200)
            .cookie('accessToken', accessToken, options)
            .cookie('refreshToken', refreshToken, options)
            .json(
                new apiResponse(
                    200,
                    {
                        accessToken,
                        refreshToken,
                    },
                    'Access token refreshed.'
                )
            );
    } catch (error) {
        throw new apiError(401, error?.message || 'Invalid refresh token.');
    }
});

const getCurrentHead = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new apiResponse(200, res.head, 'Head returned.'));
});

const changePassword = asyncHandler(async (req, res) => {
    const { _id } = res.head;
    const { currentPassword, newPassword } = req.body;
    const head = await Head.findById(_id);

    if (!(currentPassword || newPassword)) {
        throw new apiError(400, 'All fields are required.');
    }

    const isMatch = await head.isPasswordCorrect(currentPassword);

    if (!isMatch) {
        throw new apiError(401, 'Invalid credentials.');
    }

    const hashedPassword = await hashPassword(newPassword);

    head.password = hashedPassword;
    await head.save({ validateBeforeSave: false });

    return res.status(200).json(new apiResponse(200, {}, 'Password changed.'));
});

const updateHeadDetails = asyncHandler(async (req, res) => {
    const head = res.head;
    const { name, title, contactDetails } = req.body;

    if (!(name || title || contactDetails)) {
        throw new apiError(400, 'All fields are required.');
    }

    head.name = name;
    head.title = title;
    head.contactDetails = contactDetails;

    const newHead = await head.save(
        { validateBeforeSave: false },
        { new: true }
    );

    return res
        .status(200)
        .json(new apiResponse(200, newHead, 'Head details updated.'));
});

const getHeads = asyncHandler(async (req, res) => {
    let data = await Head.aggregate([
        {
            $project: {
                _id: 1,
                name: 1,
            },
        },
    ]);

    return res.status(200).json(new apiResponse(200, data, 'Heads returned.'));
});

const getHeadDetails = asyncHandler(async (req, res) => {
    const { headId } = req.params;

    const head = await Head.findById(headId);

    if (!head) {
        throw new apiError(404, 'Head not found.');
    }

    return res.status(200).json(new apiResponse(200, head, 'Head returned.'));
});

const getCurrentHeadPolicies = asyncHandler(async (req, res) => {
    const head = res.head;
    if (!head) {
        throw new apiError(404, 'Head not found.');
    }

    let data = await Policy.find({ headId: head._id });

    return res
        .status(200)
        .json(new apiResponse(200, data, 'Policies returned.'));
});

const getHeadPolicies = asyncHandler(async (req, res) => {
    const { headId } = req.params;

    const head = await Head.findById(headId);
    if (!head) {
        throw new apiError(404, 'Head not found.');
    }

    let data = await Policy.find({ headId: head._id });

    return res
        .status(200)
        .json(new apiResponse(200, data, 'Policies returned.'));
});

export {
    registerHead,
    loginHead,
    logoutHead,
    refreshAccessToken,
    getCurrentHead,
    changePassword,
    updateHeadDetails,
    getHeads,
    getHeadDetails,
    getCurrentHeadPolicies,
    getHeadPolicies,
};
