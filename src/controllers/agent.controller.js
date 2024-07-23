import { Agent } from '../models/agent.model.js';
import { apiResponse } from '../utils/apiresponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { RelationshipManager } from '../models/relationshipManager.model.js';
import { Head } from '../models/head.model.js';
import { apiError } from '../utils/apiError.js';
import { Policy } from '../models/policy.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};

const generateTokens = async (id) => {
    try {
        const agent = await Agent.findById(id);
        const accessToken = await agent.generateAccessToken();
        const refreshToken = await agent.generateRefreshToken();

        agent.refreshToken = refreshToken;
        await agent.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new apiError(500, 'Error generating tokens.');
    }
};

const generateAgentId = async () => {
    let agentId = 'AIBAG' + ('' + Math.random()).substring(2, 7);
    let checkAgentId = await Agent.findOne({ agentId });
    while (checkAgentId) {
        corpIagentIdnsId = 'AIBAG' + ('' + Math.random()).substring(2, 7);
        checkAgentId = await Agent.findOne({ agentId });
    }
    return agentId;
};

const registerAgent = asyncHandler(async (req, res) => {
    const {
        name,
        emailId,
        address,
        contactDetails,
        relationshipManagerId,
        headId,
        commision,
        password,
    } = req.body;
    if (
        !(
            name ||
            emailId ||
            address ||
            contactDetails ||
            relationshipManagerId ||
            commision ||
            password
        )
    ) {
        throw new apiError(400, 'All fields are required.');
    }

    const relationshipManager = await RelationshipManager.findById(
        relationshipManagerId
    );
    if (!relationshipManager) {
        throw new apiError(404, 'Relationship Manager invalid.');
    }

    if (headId) {
        const head = await Head.findById(headId);
        if (!head) {
            throw new apiError(404, 'Head invalid.');
        }
        const agentId = await generateAgentId();
        const hashedPassword = await hashPassword(password);
        const agent = await Agent.create({
            agentId,
            name,
            emailId,
            address,
            contactDetails,
            relationshipManagerId: relationshipManager._id,
            headId,
            commision,
            password: hashedPassword,
            headId: head._id,
        });

        return res
            .status(201)
            .json(new apiResponse(201, agent, 'Agent registered.'));
    }
    const agentId = await generateAgentId();
    const hashedPassword = await hashPassword(password);
    const agent = await Agent.create({
        agentId,
        name,
        emailId,
        address,
        contactDetails,
        relationshipManagerId: relationshipManager._id,
        commision,
        password: hashedPassword,
    });

    return res
        .status(201)
        .json(new apiResponse(201, agent, 'Agent registered.'));
});

const loginAgent = asyncHandler(async (req, res) => {
    const { agentId, password } = req.body;
    if (!(agentId || password)) {
        throw new apiError(400, 'All fields are required.');
    }
    const agent = await Agent.findOne({ agentId });
    if (!agent) {
        throw new apiError(404, 'Agent not found.');
    }
    const isMatch = await agent.isPasswordCorrect(password);

    if (!isMatch) {
        throw new apiError(401, 'Invalid credentials.');
    }

    const { accessToken, refreshToken } = await generateTokens(agent._id);

    const loggedInagent = await Agent.findById(agent._id).select(
        '-password -refreshToken'
    );

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
                    agent: loggedInagent,
                    accessToken,
                    refreshToken,
                },
                'Agent logged in succesfully.'
            )
        );
});

const logoutAgent = asyncHandler(async (req, res) => {
    const agent = res.agent;
    await Agent.findByIdAndUpdate(
        agent._id,
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
        .json(new apiResponse(200, {}, 'Agent logged out succesfully.'));
});

const refreshAccesToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken =
        req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new apiError(401, 'Refresh token missing.');
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.AGENT_REFRESH_TOKEN_SECRET
        );
        const agent = await Agent.findById(decodedToken._id);

        if (!agent) {
            throw new apiError(404, 'Agent not found.');
        }

        if (agent.refreshToken !== incomingRefreshToken) {
            throw new apiError(401, 'Refresh tokenexpired .');
        }

        const { accessToken, refreshToken } = await generateTokens(agent._id);

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

const getCurrentAgent = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new apiResponse(200, res.agent, 'Agent returned.'));
});

const changePassword = asyncHandler(async (req, res) => {
    const { _id } = res.agent;
    const { currentPassword, newPassword } = req.body;
    const agent = await Agent.findById(_id);

    if (!(currentPassword || newPassword)) {
        throw new apiError(400, 'All fields are required.');
    }

    console.log(agent);

    const isMatch = await agent.isPasswordCorrect(currentPassword);

    if (!isMatch) {
        throw new apiError(401, 'Invalid credentials.');
    }

    const hashedPassword = await hashPassword(newPassword);

    agent.password = hashedPassword;
    await agent.save({ validateBeforeSave: false });

    return res.status(200).json(new apiResponse(200, {}, 'Password changed.'));
});

const updateAgentDetails = asyncHandler(async (req, res) => {
    const agent = res.agent;
    const { name, emailId, address, contactDetails } = req.body;

    if (!(name || emailId || address || contactDetails)) {
        throw new apiError(400, 'All fields are required.');
    }

    agent.name = name;
    agent.emailId = emailId;
    agent.address = address;
    agent.contactDetails = contactDetails;

    const newAgent = await agent.save(
        { validateBeforeSave: false },
        { new: true }
    );

    return res
        .status(200)
        .json(new apiResponse(200, newAgent, 'Agent details updated.'));
});

const getAgents = asyncHandler(async (req, res) => {
    let data = await Agent.aggregate([
        {
            $project: {
                _id: 1,
                name: 1,
            },
        },
    ]);

    return res.status(200).json(new apiResponse(200, data, 'Agents returned.'));
});

const getRequiredAgents = asyncHandler(async (req, res) => {
    const { relationshipManagerId } = req.params;

    const relationshipManager = await RelationshipManager.findById(
        relationshipManagerId
    );

    if (!relationshipManager) {
        throw new apiError(404, 'Relationship Manager not found.');
    }
    let agents = await Agent.find({
        relationshipManagerId: relationshipManagerId,
    });

    return res
        .status(200)
        .json(new apiResponse(200, agents, 'Agents returned.'));
});

const getRequiredAgentsbyhead = asyncHandler(async (req, res) => {
    const { headId } = req.params;

    const head = await Head.findById(headId);

    if (!head) {
        throw new apiError(404, 'Head not found.');
    }

    let data = await Agent.find({ headId });

    return res.status(200).json(new apiResponse(200, data, 'Agents returned.'));
});

const getAgentDetails = asyncHandler(async (req, res) => {
    const { agentId } = req.params;

    const agent = await Agent.findById(agentId);

    if (!agent) {
        throw new apiError(404, 'Agent not found.');
    }

    return res.status(200).json(new apiResponse(200, agent, 'Agent returned.'));
});

const getAgentPolicies = asyncHandler(async (req, res) => {
    const { agentId } = req.params;
    console.log(agentId);
    const agent = await Agent.findById(agentId);

    if (!agent) {
        throw new apiError(404, 'Agent not found.');
    }

    let data = await Policy.find({ agentId: agent._id });

    return res
        .status(200)
        .json(new apiResponse(200, data, 'Policies returned.'));
});

const getCurrentAgentPolicies = asyncHandler(async (req, res) => {
    const agent = res.agent;
    console.log(agent);
    if (!agent) {
        throw new apiError(404, 'Agent not found.');
    }

    let data = await Policy.find({ agentId: agent._id });

    return res
        .status(200)
        .json(new apiResponse(200, data, 'Policies returned.'));
});

export {
    registerAgent,
    loginAgent,
    logoutAgent,
    refreshAccesToken,
    getCurrentAgent,
    changePassword,
    updateAgentDetails,
    getAgents,
    getRequiredAgents,
    getRequiredAgentsbyhead,
    getAgentDetails,
    getAgentPolicies,
    getCurrentAgentPolicies,
};
