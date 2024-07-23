import mongoose, { Schema } from 'mongoose';

const productSchema = new Schema(
    {
        policyId: {
            type: String,
            required: true,
        },
        insCompanyId: {
            type: Schema.Types.ObjectId,
            ref: 'InsCompany',
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        insId: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        planName: {
            type: String,
            required: true,
        },
        productId: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

export const Product = mongoose.model('Product', productSchema);
