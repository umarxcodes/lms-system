import { apiClient } from "./api.client";

export const taskApi = {
  createTask: (data) => apiClient.post("/tasks", data),
  getTasks: (params) => apiClient.get("/tasks", { params }),
  getMyTeamTasks: () => apiClient.get("/tasks/me"),
  getMyAssignedTasks: () => apiClient.get("/tasks/my-assigned"),
  getTaskById: (id) => apiClient.get(`/tasks/${id}`),
  updateTaskStatus: (id, status) => apiClient.patch(`/tasks/${id}/status`, { status }),
  assignTask: (id, assignedTo) => apiClient.patch(`/tasks/${id}/assign`, { assignedTo }),
  updateTask: (id, data) => apiClient.patch(`/tasks/${id}`, data),
  deleteTask: (id) => apiClient.delete(`/tasks/${id}`),
};
