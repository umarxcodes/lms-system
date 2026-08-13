import { apiClient } from "./api.client";

export const settingsApi = {
  getAdminProfile: () => apiClient.get("/settings/profile"),
  updateAdminProfile: (data) => apiClient.patch("/settings/profile", data),
  uploadAdminAvatar: (formData) =>
    apiClient.post("/settings/profile/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteAdminAvatar: () => apiClient.delete("/settings/profile/avatar"),
  changePassword: (currentPassword, newPassword) =>
    apiClient.patch("/settings/password", { currentPassword, newPassword }),
  getApplicationSettings: () => apiClient.get("/settings/application"),
  updateApplicationSettings: (data) => apiClient.patch("/settings/application", data),
  getNotificationPreferences: () => apiClient.get("/settings/notifications"),
  updateNotificationPreferences: (data) => apiClient.patch("/settings/notifications", data),
  getSecurityInfo: () => apiClient.get("/settings/security"),
};
