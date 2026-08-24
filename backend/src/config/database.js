import mongoose from "mongoose";
import { env } from "./env.js";

let isConnected = false;

export default async function connectDB() {
  if (!env.MONGO_URI) throw new Error("MONGO_URI is not configured");
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }
  await mongoose.connect(env.MONGO_URI);
  isConnected = true;
  console.log("MongoDB connected successfully");
}
