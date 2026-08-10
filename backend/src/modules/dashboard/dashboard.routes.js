import express from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { getDashboardStatsController } from "./dashboard.controller.js";

const router = express.Router();

router.get("/stats", authenticate, getDashboardStatsController);

export default router;
