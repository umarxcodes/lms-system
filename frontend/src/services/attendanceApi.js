import { apiClient } from "./api.client";

export const attendanceApi = {
  markAttendance: (data) => apiClient.post("/attendance", data),
  getAttendanceList: (params) => apiClient.get("/attendance", { params }),
  getMyAttendance: () => apiClient.get("/attendance/me"),
  getAttendanceByStudent: (studentId) => apiClient.get(`/attendance/student/${studentId}`),
  getAttendanceByDate: (date) => apiClient.get(`/attendance/date/${date}`),
  getAttendanceById: (id) => apiClient.get(`/attendance/${id}`),
  updateAttendance: (id, data) => apiClient.patch(`/attendance/${id}`, data),
};
