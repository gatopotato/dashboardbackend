import randomstring from 'randomstring';
import asyncHandler from '../utils/asyncHandler.js';
import { Head } from '../models/head.model.js';
export const forgotPassword = asyncHandler(async (req, res) => {
    const { Id } = req.body();
    if (Id.slice(3, 5) === 'HS') {
        const user = await Head.findOne({ headId: Id });
    } else if (Id.slice(3, 5) === 'AG') {
        const user = await Agent.findOne({ agentId: Id });
    } else if (Id.slice(3, 5) === 'RM') {
        const user = await RelationshipManager.findOne({
            relationshipManagerId: Id,
        });
    } else {
        throw new apiError(400, 'Invalid Id');
    }
    if (!user) {
        throw new apiError(404, 'User not found.');
    }
    const token = randomstring.generate();
    await user.updateOne({
        resetPasswordToken: token,
        resetPasswordExpires: Date.now() + 3600000,
    });
});
