import mongoose, { Schema } from 'mongoose';

const customerSchema = new Schema(
    {
        custId: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        contactDetails: {
            type: String,
            required: true,
        },
        dateOfBirth: {
            type: Date,
            required: true,
        },
        relationshipManagerId: {
            type: Schema.Types.ObjectId,
            ref: 'RelationshipManager',
            required: true,
        },
        agentId: {
            type: Schema.Types.ObjectId,
            ref: 'Agent',
        },
        token: {
            type: String,
        },
        tokenExpire: {
            type: Date,
        },
    },
    { timestamps: true }
);

export const Customer = mongoose.model('Customer', customerSchema);
