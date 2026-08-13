import { apiClient } from "./api.client";

export const studentApi = {
  getStudents: (params) => apiClient.get("/students", { params }),
  getStudentById: (id) => apiClient.get(`/students/${id}`),
  createStudent: (data) => apiClient.post("/students", data),
  updateStudent: (id, data) => apiClient.patch(`/students/${id}`, data),
  deleteStudent: (id) => apiClient.delete(`/students/${id}`),
  getMyProfile: () => apiClient.get("/students/me"),
  getStudentDashboard: () => apiClient.get("/students/dashboard"),
  uploadAvatar: (formData) =>
    apiClient.post("/students/me/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteAvatar: () => apiClient.delete("/students/me/avatar"),
};
