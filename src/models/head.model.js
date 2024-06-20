import mongoose, { Schema } from "mongoose";

const headSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    title: {
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

export const Head = mongoose.model("Head", headSchema);
