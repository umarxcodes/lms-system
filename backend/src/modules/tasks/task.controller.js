import { ROLES } from "../auth/auth.model.js";
import { createTask, getAllTasks, getTaskById, getMyTasks, getMyAssignedTasks, userOwnsTask, updateTaskStatus, assignTask, updateTask, deleteTask } from "./task.service.js";
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
    if (req.user.role === ROLES.STUDENT && !await userOwnsTask(task, req.user.userId)) {
      return error(res, "You do not have access to this task", 403);
    }
    success(res, task);
  } catch (err) {
    next(err);
  }
};

export const getMyTasksController = async (req, res, next) => {
  try {
    const tasks = await getMyTasks(req.user.userId);
    success(res, tasks);
  } catch (err) {
    next(err);
  }
};

export const getMyAssignedTasksController = async (req, res, next) => {
  try {
    const tasks = await getMyAssignedTasks(req.user.userId);
    success(res, tasks);
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
    const targetUserId = req.body.userId || req.body.assignedTo || req.body.studentId;
    const task = await assignTask(req.params.id, targetUserId);
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
