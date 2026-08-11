import dotenv from "dotenv";
import connectDB from "./config/database.js";
import { seedInitialAdmin } from "./services/adminSeed.service.js";
import { env } from "./config/env.js";

dotenv.config();

import app from "./app.js";

const PORT = env.PORT;

async function startServer() {
  await connectDB();
  await seedInitialAdmin();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} `);
  });
}

startServer().catch(() => {
  console.error("Server failed to start");
  process.exit(1);
});
