import mongoose, { Schema } from "mongoose";

const medicalInsuranceSchema = new Schema(
  {
    productID: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { timestamps: true }
);

export const MedicalInsurance = mongoose.model(
  "MedicalInsurance",
  medicalInsuranceSchema
);
