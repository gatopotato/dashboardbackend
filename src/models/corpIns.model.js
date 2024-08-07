import mongoose, { Schema } from 'mongoose';

const corporateInsuranceSchema = new Schema(
    {
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            // required: true,
        },
        corporateInsuranceId: {
            type: String,
            required: true,
            unique: true,
        },
    },
    { timestamps: true }
);

export const CorporateInsurance = mongoose.model(
    'CorporateInsurance',
    corporateInsuranceSchema
);
