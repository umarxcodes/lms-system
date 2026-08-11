import Project from "./project.model.js";
import Team from "../teams/team.model.js";
import Task from "../tasks/task.model.js";
import mongoose from "mongoose";
import { appError } from "../../utils/appError.js";

function assertObjectId(id, label = "Id") {
  if (!mongoose.isValidObjectId(id)) throw appError(`${label} is invalid`, 400);
}

export const createProject = async ({ teamId, ...data }) => {
  assertObjectId(teamId, "Team id");
  if (!await Team.exists({ _id: teamId })) throw appError("Team not found", 404);
  if (await Project.exists({ team: teamId })) {
    throw appError("This team already has a project", 409);
  }
  return Project.create({ ...data, team: teamId });
};

export const getAllProjects = async () => {
  return await Project.find().populate("team", "name");
};

export const getProjectById = async (id) => {
  assertObjectId(id, "Project id");
  return await Project.findById(id).populate("team", "name");
};

export const getMyProjects = async (userId) => {
  assertObjectId(userId, "User id");
  const team = await Team.findOne({ members: userId }).select("_id");
  if (!team) throw appError("You are not assigned to a team", 404);

  return Project.find({ team: team._id }).populate("team", "name");
};

export const userOwnsProject = async (project, userId) => {
  assertObjectId(userId, "User id");
  const teamId = project.team?._id || project.team;
  return Boolean(teamId && await Team.exists({ _id: teamId, members: userId }));
};

export const updateProjectStatus = async (id, status) => {
  assertObjectId(id, "Project id");
  return Project.findByIdAndUpdate(id, { status }, { new: true, runValidators: true }).populate("team", "name");
};

export const updateProject = async (id, data) => {
  assertObjectId(id, "Project id");
  return Project.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate("team", "name");
};

export const deleteProject = async (id) => {
  assertObjectId(id, "Project id");
  if (await Task.exists({ project: id })) throw appError("Project cannot be deleted while it has tasks", 409);
  return Project.findByIdAndDelete(id);
};
