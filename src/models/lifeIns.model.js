import mongoose, { Schema } from "mongoose";

const lifeInsuranceSchema = new Schema(
  {
    productID: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { timestamps: true }
);

export const LifeInsurance = mongoose.model(
  "LifeInsurance",
  lifeInsuranceSchema
);
