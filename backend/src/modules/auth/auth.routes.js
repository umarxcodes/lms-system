import express from "express";
import { loginController, getMeController } from "./auth.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/login", loginController);
router.get("/me", authenticate, getMeController);

export default router;
