import { ROLES } from "../auth/auth.model.js";
import { createProject, getAllProjects, getProjectById, getMyProjects, userOwnsProject, updateProjectStatus, updateProject, deleteProject } from "./project.service.js";
import { success, error } from "../../utils/response.js";

export const createProjectController = async (req, res, next) => {
  try {
    const project = await createProject(req.body);
    success(res, project, "Project created", 201);
  } catch (err) {
    next(err);
  }
};

export const getAllProjectsController = async (req, res, next) => {
  try {
    const projects = await getAllProjects();
    success(res, projects);
  } catch (err) {
    next(err);
  }
};

export const getProjectByIdController = async (req, res, next) => {
  try {
    const project = await getProjectById(req.params.id);
    if (!project) return error(res, "Project not found", 404);
    if (req.user.role === ROLES.STUDENT && !await userOwnsProject(project, req.user.userId)) {
      return error(res, "You do not have access to this project", 403);
    }
    success(res, project);
  } catch (err) {
    next(err);
  }
};

export const getMyProjectsController = async (req, res, next) => {
  try {
    const projects = await getMyProjects(req.user.userId);
    success(res, projects);
  } catch (err) {
    next(err);
  }
};

export const updateProjectStatusController = async (req, res, next) => {
  try {
    const project = await updateProjectStatus(req.params.id, req.body.status);
    if (!project) return error(res, "Project not found", 404);
    return success(res, project, "Project status updated");
  } catch (err) {
    next(err);
  }
};

export const updateProjectController = async (req, res, next) => {
  try {
    const project = await updateProject(req.params.id, req.body);
    if (!project) return error(res, "Project not found", 404);
    return success(res, project, "Project updated");
  } catch (err) {
    next(err);
  }
};

export const deleteProjectController = async (req, res, next) => {
  try {
    const project = await deleteProject(req.params.id);
    if (!project) return error(res, "Project not found", 404);
    return success(res, null, "Project deleted");
  } catch (err) {
    next(err);
  }
};
