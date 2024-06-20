import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import "dotenv/config";

async function connectdb() {
  try {
    const dbInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(
      `Connected to the database... host:${dbInstance.connection.host}`
    );
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

export default connectdb;
