import { markAttendance, getAttendanceByStudent, getAttendanceByDate } from "./attendance.service.js";
import { success, error } from "../../utils/response.js";

export const markAttendanceController = async (req, res, next) => {
  try {
    const attendance = await markAttendance(req.body);
    success(res, attendance, "Attendance marked", 201);
  } catch (err) {
    next(err);
  }
};

export const getAttendanceByStudentController = async (req, res, next) => {
  try {
    const records = await getAttendanceByStudent(req.params.studentId);
    success(res, records);
  } catch (err) {
    next(err);
  }
};

export const getAttendanceByDateController = async (req, res, next) => {
  try {
    const records = await getAttendanceByDate(req.params.date);
    success(res, records);
  } catch (err) {
    next(err);
  }
};
