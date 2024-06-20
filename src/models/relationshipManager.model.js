import mongoose, { Schema } from "mongoose";

const relationshipManagerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    contactDetails: {
      type: String,
      required: true,
    },
    hireDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export const RelationshipManager = mongoose.model(
  "RelationshipManager",
  relationshipManagerSchema
);
