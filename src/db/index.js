import mongoose from "mongoose";
// import { DB_NAME } from "../constants.js";

const connectionDB = async() => {
  try {
		const connectionDatabase = await mongoose.connect(`${process.env.DB_URI}`)
      console.log(`✅ MongoDB connected to ${connectionDatabase.connection.host}`);
  } catch(error){
    console.error("❌ MongoDB connection error:", error);
  }
}

export default connectionDB
