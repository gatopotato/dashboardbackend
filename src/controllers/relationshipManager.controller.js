import { RelationshipManager } from '../models/relationshipManager.model.js';
import { Policy } from '../models/policy.model.js';
import { apiResponse } from '../utils/apiresponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { apiError } from '../utils/apiError.js';
import { Head } from '../models/head.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};

const generateTokens = async (id) => {
    try {
        const relationshipManager = await RelationshipManager.findById(id);
        const accessToken = await relationshipManager.generateAccessToken();
        const refreshToken = await relationshipManager.generateRefreshToken();

        relationshipManager.refreshToken = refreshToken;
        await relationshipManager.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new apiError(500, 'Error generating tokens.');
    }
};

const generateRMId = async () => {
    let rmId = 'AIBRM' + ('' + Math.random()).substring(2, 7);
    let checkRMId = await RelationshipManager.findOne({ rmId });
    while (checkRMId) {
        rmId = 'AIBRM' + ('' + Math.random()).substring(2, 7);
        checkRMId = await RelationshipManager.findOne({ rmId });
    }
    return rmId;
};

const registerRM = asyncHandler(async (req, res) => {
    const {
        name,
        emailId,
        address,
        contactDetails,
        password,
        position,
        hireDate,
        headId,
    } = req.body;
    if (
        !(
            name ||
            emailId ||
            address ||
            contactDetails ||
            password ||
            position ||
            hireDate ||
            headId
        )
    ) {
        throw new apiError(400, 'All fields are required.');
    }

    const head = await Head.findById(headId);
    if (!head) {
        throw new apiError(404, 'Head not found.');
    }

    const rmId = await generateRMId();
    const hashedPassword = await hashPassword(password);
    const relationshipManager = await RelationshipManager.create({
        relationshipManagerId: rmId,
        name,
        emailId,
        address,
        contactDetails,
        password: hashedPassword,
        position,
        hireDate,
        headId: head._id,
    });

    return res
        .status(201)
        .json(
            new apiResponse(
                201,
                relationshipManager,
                'Relationship Manager registered.'
            )
        );
});

const loginRM = asyncHandler(async (req, res) => {
    const { relationshipManagerId, password } = req.body;
    if (!(relationshipManagerId || password)) {
        throw new apiError(400, 'All fields are required.');
    }
    const relationshipManager = await RelationshipManager.findOne({
        relationshipManagerId,
    });
    if (!relationshipManager) {
        throw new apiError(404, 'Relationship Manager not found.');
    }
    const isMatch = await relationshipManager.isPasswordCorrect(password);

    if (!isMatch) {
        throw new apiError(401, 'Invalid credentials.');
    }

    const { accessToken, refreshToken } = await generateTokens(
        relationshipManager._id
    );

    const loggedInRM = await RelationshipManager.findById(
        relationshipManager._id
    ).select('-password -refreshToken');

    const options = {
        // httpOnly: true,
        // secure: true,
    };

    return res
        .status(200)
        .cookie('refreshToken', refreshToken, options)
        .cookie('accessToken', accessToken, options)
        .json(
            new apiResponse(
                200,
                {
                    relationshipManager: loggedInRM,
                    accessToken,
                    refreshToken,
                },
                'Relationship Manager logged in successfully.'
            )
        );
});

const logoutRM = asyncHandler(async (req, res) => {
    const relationshipManager = res.rm;
    await RelationshipManager.findByIdAndUpdate(
        relationshipManager._id,
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
        // httpOnly: true,
        // secure: true,
    };

    return res
        .status(200)
        .clearCookie('accessToken', options)
        .clearCookie('refreshToken', options)
        .json(
            new apiResponse(
                200,
                {},
                'Relationship Manager logged out successfully.'
            )
        );
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
            process.env.RM_REFRESH_TOKEN_SECRET
        );
        const relationshipManager = await RelationshipManager.findById(
            decodedToken._id
        );

        if (!relationshipManager) {
            throw new apiError(404, 'Relationship Manager not found.');
        }

        if (relationshipManager.refreshToken !== incomingRefreshToken) {
            throw new apiError(401, 'Refresh token expired.');
        }

        const { accessToken, refreshToken } = await generateTokens(
            relationshipManager._id
        );

        const options = {
            // httpOnly: true,
            // secure: true,
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

const getCurrentRM = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new apiResponse(200, res.rm, 'Relationship Manager returned.'));
});

const changePassword = asyncHandler(async (req, res) => {
    const { _id } = res.rm;
    const { currentPassword, newPassword } = req.body;
    const relationshipManager = await RelationshipManager.findById(_id);

    if (!(currentPassword || newPassword)) {
        throw new apiError(400, 'All fields are required.');
    }

    console.log(relationshipManager);

    const isMatch = await relationshipManager.isPasswordCorrect(
        currentPassword
    );

    if (!isMatch) {
        throw new apiError(401, 'Invalid credentials.');
    }

    const hashedPassword = await hashPassword(newPassword);

    relationshipManager.password = hashedPassword;
    await relationshipManager.save({ validateBeforeSave: false });

    return res.status(200).json(new apiResponse(200, {}, 'Password changed.'));
});

const updateRMDetails = asyncHandler(async (req, res) => {
    const relationshipManager = res.rm;
    const { name, emailId, address, contactDetails, position } = req.body;

    if (!(name || emailId || address || contactDetails || position)) {
        throw new apiError(400, 'All fields are required.');
    }

    relationshipManager.name = name;
    relationshipManager.emailId = emailId;
    relationshipManager.address = address;
    relationshipManager.contactDetails = contactDetails;
    relationshipManager.position = position;

    const newRM = await relationshipManager.save(
        { validateBeforeSave: false },
        { new: true }
    );

    return res
        .status(200)
        .json(
            new apiResponse(200, newRM, 'Relationship Manager details updated.')
        );
});

const getRMs = asyncHandler(async (req, res) => {
    let data = await RelationshipManager.aggregate([
        {
            $project: {
                _id: 1,
                name: 1,
            },
        },
    ]);

    return res
        .status(200)
        .json(new apiResponse(200, data, 'Relationship Managers returned.'));
});

const getRequiredRMsByHead = asyncHandler(async (req, res) => {
    const { headId } = req.params;
    console.log(headId);
    const head = await Head.findById(headId);

    if (!head) {
        throw new apiError(404, 'Head not found.');
    }
    console.log(head._id);
    let data = await RelationshipManager.find({ headId: head._id });

    return res
        .status(200)
        .json(new apiResponse(200, data, 'Relationship Managers returned.'));
});

const getRMDetails = asyncHandler(async (req, res) => {
    const { relationshipManagerId } = req.params;

    const relationshipManager = await RelationshipManager.findById(
        relationshipManagerId
    );

    if (!relationshipManager) {
        throw new apiError(404, 'Relationship Manager not found.');
    }

    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                relationshipManager,
                'Relationship Manager returned.'
            )
        );
});

const getRMPolicies = asyncHandler(async (req, res) => {
    const { relationshipManagerId } = req.params;
    const relationshipManager = await RelationshipManager.findById(
        relationshipManagerId
    );

    if (!relationshipManager) {
        throw new apiError(404, 'Relationship Manager not found.');
    }

    let data = await Policy.find({
        relationshipManagerId: relationshipManager._id,
    });

    return res
        .status(200)
        .json(new apiResponse(200, data, 'Policies returned.'));
});

const getCurrentRMPolicies = asyncHandler(async (req, res) => {
    const relationshipManager = res.rm;
    console.log(relationshipManager);
    if (!relationshipManager) {
        throw new apiError(404, 'Relationship Manager not found.');
    }

    let data = await Policy.find({ rmId: relationshipManager._id });

    return res
        .status(200)
        .json(new apiResponse(200, data, 'Policies returned.'));
});

export {
    registerRM,
    loginRM,
    logoutRM,
    refreshAccessToken,
    getCurrentRM,
    changePassword,
    updateRMDetails,
    getRMs,
    getRequiredRMsByHead,
    getRMDetails,
    getRMPolicies,
    getCurrentRMPolicies,
};
