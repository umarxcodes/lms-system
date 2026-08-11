import mongoose from "mongoose";
import { env } from "./env.js";

export default async function connectDB() {
  if (!env.MONGO_URI) throw new Error("MONGO_URI is not configured");
  await mongoose.connect(env.MONGO_URI);
  console.log("MongoDB connected successfully");
}
