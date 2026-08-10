import { markAttendance, getAttendanceByStudent, getAttendanceByDate, updateAttendance } from "./attendance.service.js";
import { success, error } from "../../utils/response.js";

export const markAttendanceController = async (req, res, next) => {
  try {
    const attendance = await markAttendance(req.body);
    success(res, attendance, "Attendance marked", 201);
  } catch (err) {
    next(err);
  }
};

export const updateAttendanceController = async (req, res, next) => {
  try {
    const attendance = await updateAttendance(req.params.id, req.body);
    if (!attendance) return error(res, "Attendance record not found", 404);
    return success(res, attendance, "Attendance updated");
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
