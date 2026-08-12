import Student from "./student.model.js";
import User, { ROLES } from "../auth/auth.model.js";
import Attendance from "../attendance/attendance.model.js";
import Task from "../tasks/task.model.js";
import Team from "../teams/team.model.js";
import mongoose from "mongoose";
import { appError } from "../../utils/appError.js";

function assertObjectId(id, label = "Student id") {
  if (!mongoose.isValidObjectId(id)) throw appError(`${label} is invalid`, 400);
}

export const createStudent = async (data) => {
  const { name, email, password, ...studentData } = data;
  const normalizedEmail = email.toLowerCase();
  const existingUser = await User.exists({ email: normalizedEmail });
  if (existingUser) {
    throw appError("A user already exists with this email", 409);
  }

  const session = await mongoose.startSession();
  try {
    let createdStudent;
    await session.withTransaction(async () => {
      const [user] = await User.create([{ name, email: normalizedEmail, password, role: ROLES.STUDENT }], { session });
      [createdStudent] = await Student.create([{ ...studentData, user: user._id }], { session });
      user.student = createdStudent._id;
      await user.save({ session });
    });
    return Student.findById(createdStudent._id).populate("user", "name email role profileImage");
  } catch (err) {
    if (err?.code === 11000) throw appError("A student with this email or roll number already exists", 409);
    throw err;
  } finally {
    await session.endSession();
  }
};

export const getAllStudents = async () => {
  return await Student.find().populate("user", "name email profileImage");
};

export const getStudentById = async (id) => {
  assertObjectId(id);
  return await Student.findById(id).populate("user", "name email profileImage");
};

export const getAuthenticatedStudent = async (userId) => {
  return Student.findOne({ user: userId }).populate("user", "name email role profileImage");
};

export const updateStudent = async (id, data) => {
  assertObjectId(id);
  return await Student.findByIdAndUpdate(id, data, { returnDocument: "after", runValidators: true }).populate("user", "name email profileImage");
};

export const deleteStudent = async (id) => {
  assertObjectId(id);
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const student = await Student.findById(id).session(session);
      if (!student) throw appError("Student not found", 404);

      const [attendanceCount, taskCount, teamCount] = await Promise.all([
        Attendance.countDocuments({ student: student._id }).session(session),
        Task.countDocuments({ assignedTo: student.user }).session(session),
        Team.countDocuments({ members: student.user }).session(session)
      ]);
      if (attendanceCount || taskCount || teamCount) {
        throw appError("Student cannot be deleted while related attendance, tasks, or team membership exists", 409);
      }

      await User.findByIdAndDelete(student.user, { session });
      await Student.findByIdAndDelete(id, { session });
    });
  } finally {
    await session.endSession();
  }
};
