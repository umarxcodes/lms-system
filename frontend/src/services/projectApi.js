import { apiClient } from "./api.client";

export const projectApi = {
  createProject: (data) => apiClient.post("/projects", data),
  getProjects: (params) => apiClient.get("/projects", { params }),
  getMyProject: () => apiClient.get("/projects/me"),
  getProjectById: (id) => apiClient.get(`/projects/${id}`),
  updateProjectStatus: (id, status) => apiClient.patch(`/projects/${id}/status`, { status }),
  updateProject: (id, data) => apiClient.patch(`/projects/${id}`, data),
  deleteProject: (id) => apiClient.delete(`/projects/${id}`),
};
