import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
  {
    policyID: {
      type: String,
      required: true,
    },
    insCompanyID: {
      type: Schema.Types.ObjectId,
      ref: "InsCompany",
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    planName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
