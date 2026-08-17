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

// Helper to resolve and attach team info for students based on Team.members
async function attachTeamsToStudents(students) {
  if (!students) return students;

  const isArray = Array.isArray(students);
  const studentList = isArray ? students : [students];
  if (!studentList.length) return students;

  const userIds = studentList
    .map((s) => {
      const u = s.toObject ? s.toObject().user : s.user;
      return u && u._id ? u._id : u;
    })
    .filter(Boolean);

  if (!userIds.length) return students;

  const teams = await Team.find({ members: { $in: userIds } })
    .select("_id name members")
    .lean();

  const userTeamMap = new Map();
  teams.forEach((team) => {
    (team.members || []).forEach((mId) => {
      userTeamMap.set(mId.toString(), { _id: team._id, name: team.name });
    });
  });

  const result = studentList.map((studentDoc) => {
    const obj = studentDoc.toObject ? studentDoc.toObject() : { ...studentDoc };
    const u = obj.user;
    const uId = u && u._id ? u._id.toString() : u ? u.toString() : null;
    obj.team = uId ? (userTeamMap.get(uId) || null) : null;
    return obj;
  });

  return isArray ? result : result[0];
}

// createStudent creates a User and Student profile inside a single MongoDB
// transaction. The transaction guarantees that either both documents are
// persisted or neither is, preventing orphaned User records without a
// corresponding Student profile.
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
    const student = await Student.findById(createdStudent._id).populate("user", "name email role profileImage");
    return await attachTeamsToStudents(student);
  } catch (err) {
    if (err?.code === 11000) throw appError("A student with this email or roll number already exists", 409);
    throw err;
  } finally {
    await session.endSession();
  }
};

export const getAllStudents = async () => {
  const students = await Student.find().populate("user", "name email profileImage");
  return await attachTeamsToStudents(students);
};

export const getStudentById = async (id) => {
  assertObjectId(id);
  const student = await Student.findById(id).populate("user", "name email profileImage");
  if (!student) return null;
  return await attachTeamsToStudents(student);
};

export const getAuthenticatedStudent = async (userId) => {
  const student = await Student.findOne({ user: userId }).populate("user", "name email role profileImage");
  if (!student) return null;
  return await attachTeamsToStudents(student);
};

export const updateStudent = async (id, data) => {
  assertObjectId(id);
  const student = await Student.findByIdAndUpdate(id, data, { returnDocument: "after", runValidators: true }).populate("user", "name email profileImage");
  if (!student) return null;
  return await attachTeamsToStudents(student);
};

// deleteStudent removes a Student and their linked User inside a transaction.
// It first checks for dependent Attendance, Task, and Team membership records
// because those references would become dangling if the Student were removed.
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
