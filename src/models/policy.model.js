import mongoose, { Schema } from 'mongoose';

const policySchema = new Schema(
    {
        policyNo: {
            type: String,
            required: true,
        },
        insuranceCompanyId: {
            type: Schema.Types.ObjectId,
            ref: 'InsCompany',
            required: true,
        },
        bookingNo: {
            type: String,
            required: true,
        },
        customerId: {
            type: Schema.Types.ObjectId,
            ref: 'Customer',
            required: true,
        },
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        issueDate: {
            type: Date,
            required: true,
        },
        expiryDate: {
            type: Date,
            required: true,
        },
        agentId: {
            type: Schema.Types.ObjectId,
            ref: 'Agent',
        },
        relationshipManagerId: {
            type: Schema.Types.ObjectId,
            ref: 'RelationshipManager',
            required: true,
        },
        headId: {
            type: Schema.Types.ObjectId,
            ref: 'Head',
            required: true,
        },
        ncb: {
            type: Number,
            required: true,
        },
        idvValue: {
            type: Number,
            required: true,
        },
        netOdPremium: {
            type: Number,
            required: true,
        },
        netPremium: {
            type: Number,
            required: true,
        },
        commPremium: {
            type: Number,
            required: true,
        },
        // nomineeName: {
        //   type: String,
        //   required: true,
        // },
        // nomineeAge: {
        //   type: Number,
        //   required: true,
        // },
        // nomineeRelation: {
        //   type: String,
        //   required: true,
        // }
    },
    { timestamps: true }
);

export const Policy = mongoose.model('Policy', policySchema);
