import mongoose, { Schema } from 'mongoose';

const lifeInsuranceSchema = new Schema(
    {
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        lifeInsId: {
            type: String,
            required: true,
            unique: true,
        },
    },
    { timestamps: true }
);

export const LifeInsurance = mongoose.model(
    'LifeInsurance',
    lifeInsuranceSchema
);
