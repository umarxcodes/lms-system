import connectDB from "../src/config/database.js";
import app from "../src/app.js";

export default async function handler(req, res) {
  try {
    await connectDB();
  } catch (err) {
    console.error("Database connection failed in serverless handler:", err);
  }
  return app(req, res);
}
