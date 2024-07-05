import mongoose, { Schema } from "mongoose";

const headSchema = new Schema(
  {
    headId:{
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

headSchema.methods.isPasswordCorrect = async function(password){
  return await bcrypt.compare(password, this.password)
}

headSchema.methods.generateAccessToken = function(){
  return jwt.sign(
      {
          _id: this._id,
          email: this.email,
          username: this.username,
          fullName: this.fullName
      },
      process.env.HEAD_ACCESS_TOKEN_SECRET,
      {
          expiresIn: process.env.ACCESS_TOKEN_EXPIRY
      }
  )
}
headSchema.methods.generateRefreshToken = function(){
  return jwt.sign(
      {
          _id: this._id,
          
      },
      process.env.HEAD_REFRESH_TOKEN_SECRET,
      {
          expiresIn: process.env.REFRESH_TOKEN_EXPIRY
      }
  )
}

export const Head = mongoose.model("Head", headSchema);
