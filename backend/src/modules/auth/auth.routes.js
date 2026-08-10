import express from "express";
import jwt from "jsonwebtoken";
import { registerController, loginController, getMeController } from "./auth.controller.js";
import { registerSchema, loginSchema } from "./auth.validation.js";

const router = express.Router();

const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json(result.error.issues);
  }
  req.body = result.data;
  next();
};

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

router.post("/register", validate(registerSchema), registerController);
router.post("/login", validate(loginSchema), loginController);
router.get("/me", authenticate, getMeController);

export default router;
