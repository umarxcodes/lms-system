import express from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { createTaskController, getAllTasksController, getTaskByIdController, updateTaskStatusController, assignTaskController } from "./task.controller.js";
import { createTaskSchema } from "./task.validation.js";

const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json(result.error.issues);
  }
  req.body = result.data;
  next();
};

const router = express.Router();

router.post("/", authenticate, validate(createTaskSchema), createTaskController);
router.get("/", authenticate, getAllTasksController);
router.get("/:id", authenticate, getTaskByIdController);
router.patch("/:id/status", authenticate, updateTaskStatusController);
router.patch("/:id/assign", authenticate, assignTaskController);

export default router;
