import { createProject, getAllProjects, getProjectById, updateProjectStatus } from "./project.service.js";
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
    success(res, project);
  } catch (err) {
    next(err);
  }
};

export const updateProjectStatusController = async (req, res, next) => {
  try {
    const project = await updateProjectStatus(req.params.id, req.body.status);
    success(res, project, "Project status updated");
  } catch (err) {
    next(err);
  }
};
