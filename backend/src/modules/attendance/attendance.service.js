import Attendance from "./attendance.model.js";
import User, { ROLES } from "../auth/auth.model.js";
import mongoose from "mongoose";
import { appError } from "../../utils/appError.js";
import { getDayRange } from "../../utils/dateRange.js";

function assertObjectId(id, label = "Id") {
  if (!mongoose.isValidObjectId(id)) throw appError(`${label} is invalid`, 400);
}

export const markAttendance = async ({ studentId, ...data }) => {
  assertObjectId(studentId, "Student id");
  const student = await User.exists({ _id: studentId, role: ROLES.STUDENT });
  if (!student) throw appError("Student not found", 404);
  const attendance = await Attendance.create({ ...data, student: studentId });
  return attendance.populate("student", "name email");
};

export const getAttendanceByStudent = async (studentId) => {
  assertObjectId(studentId, "Student id");
  return await Attendance.find({ student: studentId }).sort({ date: -1 });
};

export const getAttendanceByDate = async (date) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw appError("Date must use YYYY-MM-DD format", 400);
  const { start, end } = getDayRange(new Date(`${date}T12:00:00.000Z`));
  return await Attendance.find({ date: { $gte: start, $lte: end } }).populate("student", "name email");
};

export const updateAttendance = async (id, data) => {
  assertObjectId(id, "Attendance id");
  return Attendance.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate("student", "name email");
};
