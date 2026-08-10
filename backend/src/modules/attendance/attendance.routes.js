import express from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";
import { ROLES } from "../auth/auth.model.js";
import { markAttendanceController, getAttendanceController, getAttendanceByIdController, getAttendanceByStudentController, getAttendanceByDateController, getMyAttendanceController, updateAttendanceController } from "./attendance.controller.js";
import { attendanceQuerySchema, markAttendanceSchema, updateAttendanceSchema } from "./attendance.validation.js";

const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ success: false, message: result.error.issues[0].message });
  }
  req.body = result.data;
  return next();
};

const validateQuery = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.query);
  if (!result.success) {
    return res.status(400).json({ success: false, message: result.error.issues[0].message });
  }
  req.validatedQuery = result.data;
  return next();
};

const router = express.Router();

router.post("/", authenticate, requireRole(ROLES.ADMIN), validate(markAttendanceSchema), markAttendanceController);
router.post("/mark", authenticate, requireRole(ROLES.ADMIN), validate(markAttendanceSchema), markAttendanceController);
router.get("/", authenticate, requireRole(ROLES.ADMIN), validateQuery(attendanceQuerySchema), getAttendanceController);
router.get("/me", authenticate, requireRole(ROLES.STUDENT), getMyAttendanceController);
router.get("/student/:studentId", authenticate, requireRole(ROLES.ADMIN), getAttendanceByStudentController);
router.get("/date/:date", authenticate, requireRole(ROLES.ADMIN), getAttendanceByDateController);
router.get("/:id", authenticate, requireRole(ROLES.ADMIN, ROLES.STUDENT), getAttendanceByIdController);
router.patch("/:id", authenticate, requireRole(ROLES.ADMIN), validate(updateAttendanceSchema), updateAttendanceController);

export default router;
