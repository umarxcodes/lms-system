import express from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";
import { ROLES } from "../auth/auth.model.js";
import { createProjectController, getAllProjectsController, getMyProjectsController, getProjectByIdController, updateProjectStatusController, updateProjectController, deleteProjectController } from "./project.controller.js";
import { createProjectSchema, updateProjectSchema, updateProjectStatusSchema } from "./project.validation.js";

const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ success: false, message: result.error.issues[0].message });
  }
  req.body = result.data;
  return next();
};

const router = express.Router();

router.post("/", authenticate, requireRole(ROLES.ADMIN), validate(createProjectSchema), createProjectController);
router.get("/", authenticate, requireRole(ROLES.ADMIN), getAllProjectsController);
router.get("/me", authenticate, requireRole(ROLES.STUDENT), getMyProjectsController);
router.get("/:id", authenticate, requireRole(ROLES.ADMIN, ROLES.STUDENT), getProjectByIdController);
router.patch("/:id/status", authenticate, requireRole(ROLES.ADMIN), validate(updateProjectStatusSchema), updateProjectStatusController);
router.patch("/:id", authenticate, requireRole(ROLES.ADMIN), validate(updateProjectSchema), updateProjectController);
router.delete("/:id", authenticate, requireRole(ROLES.ADMIN), deleteProjectController);

export default router;
