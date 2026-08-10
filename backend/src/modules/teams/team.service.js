import Team from "./team.model.js";
import User, { ROLES } from "../auth/auth.model.js";
import Project from "../projects/project.model.js";
import mongoose from "mongoose";
import { appError } from "../../utils/appError.js";

function assertObjectId(id, label = "Id") {
  if (!mongoose.isValidObjectId(id)) throw appError(`${label} is invalid`, 400);
}

async function assertStudentMembers(memberIds = []) {
  for (const memberId of memberIds) assertObjectId(memberId, "Student user id");
  if (!memberIds.length) return;
  const count = await User.countDocuments({ _id: { $in: memberIds }, role: ROLES.STUDENT });
  if (count !== memberIds.length) throw appError("All team members must be Student users", 400);
}

export const createTeam = async ({ members = [], ...data }, adminId) => {
  assertObjectId(adminId, "Admin user id");
  await assertStudentMembers(members);
  return Team.create({ ...data, members, createdBy: adminId });
};

export const getAllTeams = async () => {
  return await Team.find().populate("createdBy", "name email").populate("members", "name email");
};

export const getTeamById = async (id) => {
  assertObjectId(id, "Team id");
  return await Team.findById(id).populate("createdBy", "name email").populate("members", "name email");
};

export const addMember = async (id, memberId) => {
  assertObjectId(id, "Team id");
  await assertStudentMembers([memberId]);
  return Team.findByIdAndUpdate(id, { $addToSet: { members: memberId } }, { new: true, runValidators: true }).populate("members", "name email");
};

export const removeMember = async (id, memberId) => {
  assertObjectId(id, "Team id");
  assertObjectId(memberId, "Student user id");
  return Team.findByIdAndUpdate(id, { $pull: { members: memberId } }, { new: true, runValidators: true }).populate("members", "name email");
};

export const updateTeam = async (id, data) => {
  assertObjectId(id, "Team id");
  return Team.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate("createdBy", "name email").populate("members", "name email");
};

export const deleteTeam = async (id) => {
  assertObjectId(id, "Team id");
  if (await Project.exists({ team: id })) throw appError("Team cannot be deleted while it has a project", 409);
  return Team.findByIdAndDelete(id);
};
