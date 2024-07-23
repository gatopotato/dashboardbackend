import mongoose, { Schema } from 'mongoose';

const motorInsuranceSchema = new Schema(
    {
        vehicleNo: {
            type: String,
            required: true,
        },
        model: {
            type: String,
            required: true,
        },
        yearOfManufacture: {
            type: Number,
            required: true,
        },
        fuelType: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        cases: {
            type: String,
            required: true,
        },
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        motorInsuranceId: {
            type: String,
            required: true,
            unique: true,
        },
    },
    { timestamps: true }
);

export const MotorInsurance = mongoose.model(
    'MotorInsurance',
    motorInsuranceSchema
);
