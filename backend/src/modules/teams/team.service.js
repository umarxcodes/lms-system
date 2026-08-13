import Team from "./team.model.js";
import User, { ROLES } from "../auth/auth.model.js";
import Student from "../students/student.model.js";
import Project from "../projects/project.model.js";
import mongoose from "mongoose";
import { appError } from "../../utils/appError.js";

function assertObjectId(id, label = "Id") {
  if (!mongoose.isValidObjectId(id)) throw appError(`${label} is invalid`, 400);
}

// assertStudentMembers validates that every provided member identifier refers
// to an existing STUDENT user and that no Student is included more than once.
async function assertStudentMembers(memberIds = []) {
  for (const memberId of memberIds) assertObjectId(memberId, "Student user id");
  if (new Set(memberIds.map(String)).size !== memberIds.length) throw appError("A Student can only be included once in a Team", 409);
  if (!memberIds.length) return;
  const count = await User.countDocuments({ _id: { $in: memberIds }, role: ROLES.STUDENT });
  if (count !== memberIds.length) throw appError("All team members must be Student users", 400);
}

// assertUsersAreUnassigned ensures that none of the provided Users already
// belong to another Team. A Student can only be a member of one Team at a time.
async function assertUsersAreUnassigned(memberIds) {
  if (!memberIds.length) return;
  const existingTeam = await Team.findOne({ members: { $in: memberIds } }).select("name");
  if (existingTeam) throw appError(`A Student is already assigned to Team ${existingTeam.name}`, 409);
}

// resolveStudentUser accepts either a Student ObjectId or a User ObjectId
// and returns the corresponding User ObjectId. The legacyUserId flag controls
// whether the identifier is treated as a User ID directly or looked up through
// the Student document first.
async function resolveStudentUser(identifier, legacyUserId = false) {
  assertObjectId(identifier, "Student id");
  if (!legacyUserId) {
    const student = await Student.findById(identifier).select("user");
    if (!student) throw appError("Student not found", 404);
    return student.user;
  }

  const user = await User.findOne({ _id: identifier, role: ROLES.STUDENT }).select("_id");
  if (!user) throw appError("Student not found", 404);
  return user._id;
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export const createTeam = async ({ members = [], ...data }, adminId) => {
  assertObjectId(adminId, "Admin user id");
  await assertStudentMembers(members);
  await assertUsersAreUnassigned(members);
  try {
    return await Team.create({ ...data, members, createdBy: adminId });
  } catch (err) {
    if (err?.code === 11000) throw appError("A Team with this name already exists", 409);
    throw err;
  }
};

export const getAllTeams = async ({ search } = {}) => {
  const query = search ? { name: { $regex: escapeRegex(search), $options: "i" } } : {};
  return Team.find(query).populate("createdBy", "name email").populate("members", "name email");
};

export const getTeamById = async (id) => {
  assertObjectId(id, "Team id");
  return await Team.findById(id).populate("createdBy", "name email").populate("members", "name email");
};

export const addMember = async (id, memberId) => {
  assertObjectId(id, "Team id");
  await assertStudentMembers([memberId]);
  const team = await Team.findById(id).select("members");
  if (!team) return null;
  if (team.members.some((member) => member.toString() === memberId.toString())) {
    throw appError("Student is already a member of this Team", 409);
  }
  await assertUsersAreUnassigned([memberId]);
  return Team.findByIdAndUpdate(id, { $addToSet: { members: memberId } }, { returnDocument: "after", runValidators: true }).populate("members", "name email");
};

export const removeMember = async (id, memberId) => {
  assertObjectId(id, "Team id");
  assertObjectId(memberId, "Student user id");
  const team = await Team.findById(id).select("members");
  if (!team) return null;
  if (!team.members.some((member) => member.toString() === memberId.toString())) {
    throw appError("Student is not a member of this Team", 404);
  }
  return Team.findByIdAndUpdate(id, { $pull: { members: memberId } }, { returnDocument: "after", runValidators: true }).populate("members", "name email");
};

export const updateTeam = async (id, data) => {
  assertObjectId(id, "Team id");
  try {
    return await Team.findByIdAndUpdate(id, data, { returnDocument: "after", runValidators: true }).populate("createdBy", "name email").populate("members", "name email");
  } catch (err) {
    if (err?.code === 11000) throw appError("A Team with this name already exists", 409);
    throw err;
  }
};

// deleteTeam enforces cascade protection: a Team cannot be removed while it
// has an associated Project or while it still has members. This prevents
// accidental data loss and dangling foreign keys.
export const deleteTeam = async (id) => {
  assertObjectId(id, "Team id");
  if (await Project.exists({ team: id })) throw appError("Team cannot be deleted while it has a project", 409);
  if (await Team.exists({ _id: id, "members.0": { $exists: true } })) {
    throw appError("Team cannot be deleted while it has members", 409);
  }
  return Team.findByIdAndDelete(id);
};

export const getMyTeam = async (userId) => {
  assertObjectId(userId, "Authenticated user id");
  return Team.findOne({ members: userId }).select("name description members createdAt updatedAt").populate("members", "name email");
};

export const getTeamMembers = async (id) => {
  assertObjectId(id, "Team id");
  return Team.findById(id).select("members").populate("members", "name email");
};

export const resolveTeamMember = async (payload) => {
  if (payload.studentId) return resolveStudentUser(payload.studentId);
  return resolveStudentUser(payload.memberId, true);
};

export const resolveTeamMemberIdentifier = async (identifier) => {
  assertObjectId(identifier, "Student id");
  const student = await Student.findById(identifier).select("user");
  return student ? student.user : resolveStudentUser(identifier, true);
};
