import { markAttendance, getAttendance, getAttendanceById, getAttendanceByStudent, getAttendanceByDate, getMyAttendance, updateAttendance } from "./attendance.service.js";
import { success, error } from "../../utils/response.js";
import { ROLES } from "../auth/auth.model.js";

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

export const getAttendanceController = async (req, res, next) => {
  try {
    const records = await getAttendance(req.validatedQuery);
    return success(res, records);
  } catch (err) {
    next(err);
  }
};

export const getMyAttendanceController = async (req, res, next) => {
  try {
    const records = await getMyAttendance(req.user.userId);
    return success(res, records);
  } catch (err) {
    next(err);
  }
};

export const getAttendanceByIdController = async (req, res, next) => {
  try {
    const attendance = await getAttendanceById(req.params.id);
    if (!attendance) return error(res, "Attendance record not found", 404);
    if (req.user.role === ROLES.STUDENT && (!attendance.student?.user || attendance.student.user._id.toString() !== req.user.userId)) {
      return error(res, "Access denied", 403);
    }
    return success(res, attendance);
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
