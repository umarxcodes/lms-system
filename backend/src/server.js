import dotenv from "dotenv";
dotenv.config();

import connectDB from "./config/database.js";
import { seedInitialAdmin } from "./services/adminSeed.service.js";
import { env } from "./config/env.js";
import app from "./app.js";

const PORT = env.PORT;

async function startServer() {
  await connectDB();
  await seedInitialAdmin();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} `);
  });
}

startServer().catch((err) => {
  console.error("Server failed to start:", err);
  process.exit(1);
});
