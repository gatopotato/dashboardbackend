import mongoose, { Schema } from "mongoose";

const policySchema = new Schema(
  {
    policyNo: {
      type: String,
      required: true,
    },
    customerID: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    productID: {
      type: Schema.Types.ObjectId,
      ref: "Product",
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
    agentID: {
      type: Schema.Types.ObjectId,
      ref: "Agent",
      required: true,
    },
    rmid: {
      type: Schema.Types.ObjectId,
      ref: "RelationshipManager",
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
    nomineeName: {
      type: String,
      required: true,
    },
    nomineeAge: {
      type: Number,
      required: true,
    },
    nomineeRelation: {
      type: String,
      required: true,
    },
    nomineeDoc: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Policy = mongoose.model("Policy", policySchema);
