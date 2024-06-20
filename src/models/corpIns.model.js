import mongoose, { Schema } from "mongoose";

const corporateInsuranceSchema = new Schema(
  {
    productID: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { timestamps: true }
);

export const CorporateInsurance = mongoose.model(
  "CorporateInsurance",
  corporateInsuranceSchema
);
