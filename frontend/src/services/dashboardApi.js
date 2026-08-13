import { apiClient } from "./api.client";

export const dashboardApi = {
  getAdminDashboard: () => apiClient.get("/admin/dashboard"),
};
