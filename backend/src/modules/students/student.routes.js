import express from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";
import { ROLES } from "../auth/auth.model.js";
import { createStudentController, getAllStudentsController, getStudentByIdController, getMyStudentProfileController, updateStudentController, deleteStudentController } from "./student.controller.js";
import { createStudentSchema, updateStudentSchema } from "./student.validation.js";

const router = express.Router();

const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ success: false, message: result.error.issues[0].message });
  }
  req.body = result.data;
  return next();
};

router.get("/me", authenticate, requireRole(ROLES.STUDENT), getMyStudentProfileController);
router.post("/", authenticate, requireRole(ROLES.ADMIN), validate(createStudentSchema), createStudentController);
router.get("/", authenticate, requireRole(ROLES.ADMIN), getAllStudentsController);
router.get("/:id", authenticate, requireRole(ROLES.ADMIN, ROLES.STUDENT), getStudentByIdController);
router.patch("/:id", authenticate, requireRole(ROLES.ADMIN), validate(updateStudentSchema), updateStudentController);
router.put("/:id", authenticate, requireRole(ROLES.ADMIN), validate(updateStudentSchema), updateStudentController);
router.delete("/:id", authenticate, requireRole(ROLES.ADMIN), deleteStudentController);

export default router;
