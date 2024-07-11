import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const agentSchema = new Schema(
  { 
    agentId:{
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
    },
    refreshToken:{
      type: String
    },
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
    relationshipManagerId: {
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

agentSchema.methods.isPasswordCorrect = async function(password){
  try {
    
    if (!password || !this.password) {
        throw new Error("Missing password or hashed password");
    }

    const isMatch = await bcrypt.compare(password, this.password);
    return isMatch;
} catch (error) {
    console.error("Error comparing passwords:", error);
    throw error;
}
}

agentSchema.methods.generateAccessToken = function(){
  return jwt.sign(
      {
          _id: this._id,
          email: this.email,
          username: this.username,
          fullName: this.fullName
      },
      process.env.AGENT_ACCESS_TOKEN_SECRET,
      {
          expiresIn: process.env.ACCESS_TOKEN_EXPIRY
      }
  )
}
agentSchema.methods.generateRefreshToken = function(){
  return jwt.sign(
      {
          _id: this._id,
          
      },
      process.env.AGENT_REFRESH_TOKEN_SECRET,
      {
          expiresIn: process.env.REFRESH_TOKEN_EXPIRY
      }
  )
}

export const Agent = mongoose.model("Agent", agentSchema);
