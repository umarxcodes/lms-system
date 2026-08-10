import { createTask, getAllTasks, getTaskById, updateTaskStatus, assignTask, updateTask, deleteTask } from "./task.service.js";
import { success, error } from "../../utils/response.js";

export const createTaskController = async (req, res, next) => {
  try {
    const task = await createTask(req.body);
    success(res, task, "Task created", 201);
  } catch (err) {
    next(err);
  }
};

export const getAllTasksController = async (req, res, next) => {
  try {
    const tasks = await getAllTasks();
    success(res, tasks);
  } catch (err) {
    next(err);
  }
};

export const getTaskByIdController = async (req, res, next) => {
  try {
    const task = await getTaskById(req.params.id);
    if (!task) return error(res, "Task not found", 404);
    success(res, task);
  } catch (err) {
    next(err);
  }
};

export const updateTaskStatusController = async (req, res, next) => {
  try {
    const task = await updateTaskStatus(req.params.id, req.body.status);
    if (!task) return error(res, "Task not found", 404);
    return success(res, task, "Task status updated");
  } catch (err) {
    next(err);
  }
};

export const assignTaskController = async (req, res, next) => {
  try {
    const task = await assignTask(req.params.id, req.body.userId);
    if (!task) return error(res, "Task not found", 404);
    return success(res, task, "Task assigned");
  } catch (err) {
    next(err);
  }
};

export const updateTaskController = async (req, res, next) => {
  try {
    const task = await updateTask(req.params.id, req.body);
    if (!task) return error(res, "Task not found", 404);
    return success(res, task, "Task updated");
  } catch (err) {
    next(err);
  }
};

export const deleteTaskController = async (req, res, next) => {
  try {
    const task = await deleteTask(req.params.id);
    if (!task) return error(res, "Task not found", 404);
    return success(res, null, "Task deleted");
  } catch (err) {
    next(err);
  }
};
