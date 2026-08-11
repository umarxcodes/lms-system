import Task from "./task.model.js";
import Project from "../projects/project.model.js";
import Team from "../teams/team.model.js";
import User, { ROLES } from "../auth/auth.model.js";
import mongoose from "mongoose";
import { appError } from "../../utils/appError.js";
import { createNotification } from "../notifications/notification.service.js";

function assertObjectId(id, label = "Id") {
  if (!mongoose.isValidObjectId(id)) throw appError(`${label} is invalid`, 400);
}

async function assertStudentUser(userId) {
  if (!userId) return;
  assertObjectId(userId, "Student user id");
  if (!await User.exists({ _id: userId, role: ROLES.STUDENT })) throw appError("Student not found", 404);
}

async function getProject(projectId) {
  assertObjectId(projectId, "Project id");
  const project = await Project.findById(projectId).select("team");
  if (!project) throw appError("Project not found", 404);
  return project;
}

async function assertStudentBelongsToProjectTeam(userId, project) {
  if (!userId) return;
  await assertStudentUser(userId);
  if (!await Team.exists({ _id: project.team, members: userId })) {
    throw appError("Assigned student must belong to the project's team", 400);
  }
}

async function getStudentProjectIds(userId) {
  assertObjectId(userId, "User id");
  const team = await Team.findOne({ members: userId }).select("_id");
  if (!team) throw appError("You are not assigned to a team", 404);
  const projects = await Project.find({ team: team._id }).select("_id");
  return projects.map((project) => project._id);
}

export const createTask = async ({ projectId, assignedTo, ...data }) => {
  const project = await getProject(projectId);
  await assertStudentBelongsToProjectTeam(assignedTo, project);
  const task = await Task.create({ ...data, project: projectId, assignedTo });
  if (assignedTo) {
    await createNotification({
      recipient: assignedTo,
      type: "ASSIGNMENT",
      title: "New task assigned",
      message: `You have been assigned the task: ${task.title}.`,
      relatedEntity: "Task",
      relatedEntityId: task._id
    });
  }
  return task;
};

export const getAllTasks = async () => {
  return await Task.find().populate("project", "title").populate("assignedTo", "name email");
};

export const getTaskById = async (id) => {
  assertObjectId(id, "Task id");
  return await Task.findById(id).populate("project", "title team").populate("assignedTo", "name email");
};

export const getMyTasks = async (userId) => {
  const projectIds = await getStudentProjectIds(userId);
  return Task.find({ project: { $in: projectIds } }).populate("project", "title").populate("assignedTo", "name email");
};

export const getMyAssignedTasks = async (userId) => {
  const projectIds = await getStudentProjectIds(userId);
  return Task.find({ assignedTo: userId, project: { $in: projectIds } })
    .populate("project", "title")
    .populate("assignedTo", "name email");
};

export const userOwnsTask = async (task, userId) => {
  assertObjectId(userId, "User id");
  const projectTeamId = task.project?.team;
  return Boolean(projectTeamId && await Team.exists({ _id: projectTeamId, members: userId }));
};

export const updateTaskStatus = async (id, status) => {
  assertObjectId(id, "Task id");
  return Task.findByIdAndUpdate(id, { status }, { new: true, runValidators: true }).populate("project", "title").populate("assignedTo", "name email");
};

export const assignTask = async (id, userId) => {
  assertObjectId(id, "Task id");
  const task = await Task.findById(id).select("project");
  if (!task) return null;
  const project = await getProject(task.project);
  await assertStudentBelongsToProjectTeam(userId, project);
  const updatedTask = await Task.findByIdAndUpdate(id, { assignedTo: userId }, { new: true, runValidators: true }).populate("assignedTo", "name email");
  if (updatedTask) {
    await createNotification({
      recipient: userId,
      type: "ASSIGNMENT",
      title: "Task assigned",
      message: `You have been assigned the task: ${updatedTask.title}.`,
      relatedEntity: "Task",
      relatedEntityId: updatedTask._id
    });
  }
  return updatedTask;
};

export const updateTask = async (id, data) => {
  assertObjectId(id, "Task id");
  return Task.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate("project", "title").populate("assignedTo", "name email");
};

export const deleteTask = async (id) => {
  assertObjectId(id, "Task id");
  return Task.findByIdAndDelete(id);
};
