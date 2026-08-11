import Attendance from "./attendance.model.js";
import Student from "../students/student.model.js";
import mongoose from "mongoose";
import { appError } from "../../utils/appError.js";
import { getDayRange } from "../../utils/dateRange.js";

function assertObjectId(id, label = "Id") {
  if (!mongoose.isValidObjectId(id)) throw appError(`${label} is invalid`, 400);
}

function getAttendanceDateRange(value) {
  const date = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T12:00:00.000Z`)
    : new Date(value);
  if (Number.isNaN(date.getTime())) throw appError("Date is invalid", 400);
  return getDayRange(date);
}

const studentPopulation = {
  path: "student",
  populate: { path: "user", select: "name email" }
};

export const markAttendance = async ({ studentId, ...data }) => {
  assertObjectId(studentId, "Student id");
  const student = await Student.exists({ _id: studentId });
  if (!student) throw appError("Student not found", 404);
  const day = getAttendanceDateRange(data.date);
  if (await Attendance.exists({ student: studentId, date: { $gte: day.start, $lte: day.end } })) {
    throw appError("Attendance is already marked for this Student on this date", 409);
  }
  try {
    const attendance = await Attendance.create({ ...data, date: day.start, student: studentId });
    return attendance.populate(studentPopulation);
  } catch (err) {
    if (err?.code === 11000) throw appError("Attendance is already marked for this Student on this date", 409);
    throw err;
  }
};

export const getAttendanceByStudent = async (studentId) => {
  assertObjectId(studentId, "Student id");
  return Attendance.find({ student: studentId }).sort({ date: -1 }).populate(studentPopulation);
};

export const getAttendanceByDate = async (date) => {
  return getAttendance({ date });
};

export const getAttendance = async ({ studentId, status, date, startDate, endDate } = {}) => {
  const query = {};
  if (studentId) {
    assertObjectId(studentId, "Student id");
    query.student = studentId;
  }
  if (status) query.status = status;

  if (date) {
    const range = getAttendanceDateRange(date);
    query.date = { $gte: range.start, $lte: range.end };
  } else if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = getAttendanceDateRange(startDate).start;
    if (endDate) query.date.$lte = getAttendanceDateRange(endDate).end;
    if (query.date.$gte && query.date.$lte && query.date.$gte > query.date.$lte) {
      throw appError("startDate must be before endDate", 400);
    }
  }

  return Attendance.find(query).sort({ date: -1 }).populate(studentPopulation);
};

export const getAttendanceById = async (id) => {
  assertObjectId(id, "Attendance id");
  return Attendance.findById(id).populate(studentPopulation);
};

export const getMyAttendance = async (userId) => {
  assertObjectId(userId, "Authenticated user id");
  const student = await Student.findOne({ user: userId }).select("_id");
  if (!student) throw appError("Student profile not found", 404);
  return getAttendanceByStudent(student._id);
};

export const updateAttendance = async (id, data) => {
  assertObjectId(id, "Attendance id");
  const update = { ...data };
  if (update.date) {
    const current = await Attendance.findById(id).select("student");
    if (!current) return null;
    const day = getAttendanceDateRange(update.date);
    if (await Attendance.exists({ _id: { $ne: id }, student: current.student, date: { $gte: day.start, $lte: day.end } })) {
      throw appError("Attendance is already marked for this Student on this date", 409);
    }
    update.date = day.start;
  }
  try {
    return await Attendance.findByIdAndUpdate(id, update, { returnDocument: "after", runValidators: true }).populate(studentPopulation);
  } catch (err) {
    if (err?.code === 11000) throw appError("Attendance is already marked for this Student on this date", 409);
    throw err;
  }
};
