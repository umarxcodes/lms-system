import Project from "./project.model.js";

export const createProject = async (data) => {
  return await Project.create(data);
};

export const getAllProjects = async () => {
  return await Project.find().populate("team", "name");
};

export const getProjectById = async (id) => {
  return await Project.findById(id).populate("team", "name");
};

export const updateProjectStatus = async (id, status) => {
  return await Project.findByIdAndUpdate(id, { status }, { new: true }).populate("team", "name");
};
