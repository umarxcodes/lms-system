import { apiClient } from "./api.client";

export const authApi = {
  login: (email, password) => apiClient.post("/auth/login", { email, password }),
  getMe: () => apiClient.get("/auth/me"),
};
