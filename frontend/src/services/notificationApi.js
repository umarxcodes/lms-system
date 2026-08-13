import { apiClient } from "./api.client";

export const notificationApi = {
  createAnnouncement: (payload) => apiClient.post("/notifications/announcements", payload),
  getMyNotifications: () => apiClient.get("/notifications/me"),
  getUnreadNotifications: () => apiClient.get("/notifications/unread"),
  getUnreadCount: () => apiClient.get("/notifications/unread/count"),
  markAllAsRead: () => apiClient.patch("/notifications/read-all"),
  markAsRead: (id) => apiClient.patch(`/notifications/${id}/read`),
  deleteNotification: (id) => apiClient.delete(`/notifications/${id}`),
};
