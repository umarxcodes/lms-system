import express from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";
import { ROLES } from "../auth/auth.model.js";
import { getDashboardStatsController } from "./dashboard.controller.js";

const router = express.Router();

router.get("/dashboard", authenticate, requireRole(ROLES.ADMIN), getDashboardStatsController);

export default router;
