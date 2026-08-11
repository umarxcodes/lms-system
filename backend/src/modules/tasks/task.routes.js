import express from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";
import { ROLES } from "../auth/auth.model.js";
import { createTaskController, getAllTasksController, getMyTasksController, getMyAssignedTasksController, getTaskByIdController, updateTaskStatusController, assignTaskController, updateTaskController, deleteTaskController } from "./task.controller.js";
import { createTaskSchema, updateTaskSchema, updateTaskStatusSchema, assignTaskSchema } from "./task.validation.js";

const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ success: false, message: result.error.issues[0].message });
  }
  req.body = result.data;
  return next();
};

const router = express.Router();

router.post("/", authenticate, requireRole(ROLES.ADMIN), validate(createTaskSchema), createTaskController);
router.get("/", authenticate, requireRole(ROLES.ADMIN), getAllTasksController);
router.get("/me", authenticate, requireRole(ROLES.STUDENT), getMyTasksController);
router.get("/my-assigned", authenticate, requireRole(ROLES.STUDENT), getMyAssignedTasksController);
router.get("/:id", authenticate, requireRole(ROLES.ADMIN, ROLES.STUDENT), getTaskByIdController);
router.patch("/:id/status", authenticate, requireRole(ROLES.ADMIN), validate(updateTaskStatusSchema), updateTaskStatusController);
router.patch("/:id/assign", authenticate, requireRole(ROLES.ADMIN), validate(assignTaskSchema), assignTaskController);
router.patch("/:id", authenticate, requireRole(ROLES.ADMIN), validate(updateTaskSchema), updateTaskController);
router.delete("/:id", authenticate, requireRole(ROLES.ADMIN), deleteTaskController);

export default router;
