import express from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";
import { ROLES } from "../auth/auth.model.js";
import { attendanceReportQuerySchema, assignmentReportQuerySchema } from "./report.validation.js";
import { getAttendanceReportController, exportAttendanceCsvController, getAssignmentReportController, exportAssignmentCsvController, getStudentReportController, getMyProgressReportController } from "./report.controller.js";

const validateQuery = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.query);
  if (!result.success) return res.status(400).json({ success: false, message: result.error.issues[0].message });
  req.validatedQuery = result.data;
  return next();
};

const router = express.Router();

router.get("/me", authenticate, requireRole(ROLES.STUDENT), getMyProgressReportController);
router.get("/attendance/export.csv", authenticate, requireRole(ROLES.ADMIN), validateQuery(attendanceReportQuerySchema), exportAttendanceCsvController);
router.get("/attendance", authenticate, requireRole(ROLES.ADMIN), validateQuery(attendanceReportQuerySchema), getAttendanceReportController);
router.get("/assignments/export.csv", authenticate, requireRole(ROLES.ADMIN), validateQuery(assignmentReportQuerySchema), exportAssignmentCsvController);
router.get("/assignments", authenticate, requireRole(ROLES.ADMIN), validateQuery(assignmentReportQuerySchema), getAssignmentReportController);
router.get("/students/:studentId", authenticate, requireRole(ROLES.ADMIN), getStudentReportController);

export default router;
