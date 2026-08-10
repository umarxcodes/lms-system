import Task from "./task.model.js";
import Project from "../projects/project.model.js";
import User, { ROLES } from "../auth/auth.model.js";
import mongoose from "mongoose";
import { appError } from "../../utils/appError.js";

function assertObjectId(id, label = "Id") {
  if (!mongoose.isValidObjectId(id)) throw appError(`${label} is invalid`, 400);
}

async function assertStudentUser(userId) {
  if (!userId) return;
  assertObjectId(userId, "Student user id");
  if (!await User.exists({ _id: userId, role: ROLES.STUDENT })) throw appError("Student not found", 404);
}

export const createTask = async ({ projectId, assignedTo, ...data }) => {
  assertObjectId(projectId, "Project id");
  if (!await Project.exists({ _id: projectId })) throw appError("Project not found", 404);
  await assertStudentUser(assignedTo);
  return Task.create({ ...data, project: projectId, assignedTo });
};

export const getAllTasks = async () => {
  return await Task.find().populate("project", "title").populate("assignedTo", "name email");
};

export const getTaskById = async (id) => {
  assertObjectId(id, "Task id");
  return await Task.findById(id).populate("project", "title").populate("assignedTo", "name email");
};

export const updateTaskStatus = async (id, status) => {
  assertObjectId(id, "Task id");
  return Task.findByIdAndUpdate(id, { status }, { new: true, runValidators: true }).populate("project", "title").populate("assignedTo", "name email");
};

export const assignTask = async (id, userId) => {
  assertObjectId(id, "Task id");
  await assertStudentUser(userId);
  return Task.findByIdAndUpdate(id, { assignedTo: userId }, { new: true, runValidators: true }).populate("assignedTo", "name email");
};

export const updateTask = async (id, data) => {
  assertObjectId(id, "Task id");
  return Task.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate("project", "title").populate("assignedTo", "name email");
};

export const deleteTask = async (id) => {
  assertObjectId(id, "Task id");
  return Task.findByIdAndDelete(id);
};
