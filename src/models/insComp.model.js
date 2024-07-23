import mongoose, { Schema } from 'mongoose';

const insCompSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        managerName: {
            type: String,
            required: true,
        },
        managerPhone: {
            type: Number,
            required: true,
        },
        insCompId: {
            type: String,
            required: true,
            unique: true,
        },
    },
    { timestamps: true }
);

export const InsCompany = mongoose.model('InsCompany', insCompSchema);
