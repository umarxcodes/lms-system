import express from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { createProjectController, getAllProjectsController, getProjectByIdController, updateProjectStatusController } from "./project.controller.js";
import { createProjectSchema } from "./project.validation.js";

const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json(result.error.issues);
  }
  req.body = result.data;
  next();
};

const router = express.Router();

router.post("/", authenticate, validate(createProjectSchema), createProjectController);
router.get("/", authenticate, getAllProjectsController);
router.get("/:id", authenticate, getProjectByIdController);
router.patch("/:id/status", authenticate, updateProjectStatusController);

export default router;
