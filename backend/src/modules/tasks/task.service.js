import Task from "./task.model.js";

export const createTask = async (data) => {
  return await Task.create(data);
};

export const getAllTasks = async () => {
  return await Task.find().populate("project", "title").populate("assignedTo", "name email");
};

export const getTaskById = async (id) => {
  return await Task.findById(id).populate("project", "title").populate("assignedTo", "name email");
};

export const updateTaskStatus = async (id, status) => {
  return await Task.findByIdAndUpdate(id, { status }, { new: true }).populate("project", "title").populate("assignedTo", "name email");
};

export const assignTask = async (id, userId) => {
  return await Task.findByIdAndUpdate(id, { assignedTo: userId }, { new: true }).populate("assignedTo", "name email");
};
