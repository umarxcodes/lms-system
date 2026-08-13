import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api/v1";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach JWT Token if present in localStorage
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle global 401 unauthenticated errors cleanly
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear invalid token if session expired or unauthorized
      const currentPath = window.location.pathname;
      if (currentPath !== "/login") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        // Dispatch custom event so AuthContext can handle logout without reload loop
        window.dispatchEvent(new Event("auth:unauthorized"));
      }
    }
    return Promise.reject(error.response ? error.response.data : error);
  }
);
