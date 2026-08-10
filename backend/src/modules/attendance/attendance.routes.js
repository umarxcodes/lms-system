import express from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { markAttendanceController, getAttendanceByStudentController, getAttendanceByDateController } from "./attendance.controller.js";
import { markAttendanceSchema } from "./attendance.validation.js";

const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json(result.error.issues);
  }
  req.body = result.data;
  next();
};

const router = express.Router();

router.post("/mark", authenticate, validate(markAttendanceSchema), markAttendanceController);
router.get("/student/:studentId", authenticate, getAttendanceByStudentController);
router.get("/date/:date", authenticate, getAttendanceByDateController);

export default router;
