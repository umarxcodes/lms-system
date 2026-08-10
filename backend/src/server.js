import dotenv from "dotenv";
import connectDB from "./config/database.js";
import { seedInitialAdmin } from "./services/adminSeed.service.js";

dotenv.config();

import app from "./app.js";

const PORT = process.env.PORT || 3000;

async function startServer() {
  await connectDB();
  await seedInitialAdmin();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} `);
  });
}

startServer();
