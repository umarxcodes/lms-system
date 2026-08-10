import Attendance from "./attendance.model.js";

export const markAttendance = async (data) => {
  const attendance = await Attendance.create(data);
  return attendance.populate("student", "name email");
};

export const getAttendanceByStudent = async (studentId) => {
  return await Attendance.find({ student: studentId }).sort({ date: -1 });
};

export const getAttendanceByDate = async (date) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return await Attendance.find({ date: { $gte: start, $lte: end } }).populate("student", "name email");
};
