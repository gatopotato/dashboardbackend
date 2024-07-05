import mongoose, { Schema } from "mongoose";

const relationshipManagerSchema = new Schema(
  {
    relationshipManagerId:{
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
    headId: {
      type: Schema.Types.ObjectId,
      ref: "Head",
    },
  },
  { timestamps: true }
);

relationshipManagerSchema.methods.isPasswordCorrect = async function(password){
  return await bcrypt.compare(password, this.password)
}

relationshipManagerSchema.methods.generateAccessToken = function(){
  return jwt.sign(
      {
          _id: this._id,
          email: this.email,
          username: this.username,
          fullName: this.fullName
      },
      process.env.RM_ACCESS_TOKEN_SECRET,
      {
          expiresIn: process.env.ACCESS_TOKEN_EXPIRY
      }
  )
}
relationshipManagerSchema.methods.generateRefreshToken = function(){
  return jwt.sign(
      {
          _id: this._id,
          
      },
      process.env.RM_REFRESH_TOKEN_SECRET,
      {
          expiresIn: process.env.REFRESH_TOKEN_EXPIRY
      }
  )
}

export const RelationshipManager = mongoose.model(
  "RelationshipManager",
  relationshipManagerSchema
);
