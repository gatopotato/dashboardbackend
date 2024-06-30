import mongoose, { Schema } from "mongoose";

const agentSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    emailId: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    contactDetails: {
      type: String,
      required: true,
    },
    relationshipManagerID: {
      type: Schema.Types.ObjectId,
      ref: "RelationshipManager",
      required: true,
    },
    headId:{
      type: Schema.Types.ObjectId,
      ref: "Head"
    },
    commision: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export const Agent = mongoose.model("Agent", agentSchema);
