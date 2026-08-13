import { apiClient } from "./api.client";

export const reportApi = {
  getMyReport: () => apiClient.get("/reports/me"),
  getAttendanceReport: () => apiClient.get("/reports/attendance"),
  getAssignmentReport: () => apiClient.get("/reports/assignments"),
  getStudentReport: (studentId) => apiClient.get(`/reports/students/${studentId}`),
  exportAttendanceCsvUrl: "/api/v1/reports/attendance/export.csv",
  exportAssignmentCsvUrl: "/api/v1/reports/assignments/export.csv",
};
