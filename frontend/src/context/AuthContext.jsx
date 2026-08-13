import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authApi } from "../services/authApi";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  }, []);

  // Hydrate user profile on application startup if token exists
  useEffect(() => {
    let isMounted = true;
    const fetchMe = async () => {
      if (!token) {
        if (isMounted) setLoading(false);
        return;
      }
      try {
        const res = await authApi.getMe();
        if (isMounted && res.success && res.data) {
          setUser(res.data);
          localStorage.setItem("user", JSON.stringify(res.data));
        }
      } catch (err) {
        console.error("Failed to restore session", err);
        if (isMounted) logout();
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchMe();

    // Listen to unauthorized event dispatched by API client interceptor
    const handleUnauthorized = () => logout();
    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => {
      isMounted = false;
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, [token, logout]);

  const login = async (email, password) => {
    const res = await authApi.login(email, password);
    if (res.success && res.data) {
      const { user: userData, token: userToken } = res.data;
      setToken(userToken);
      setUser(userData);
      localStorage.setItem("token", userToken);
      localStorage.setItem("user", JSON.stringify(userData));
    }
    return res;
  };

  const updateUser = (updatedUser) => {
    setUser((prev) => {
      const newObj = { ...prev, ...updatedUser };
      localStorage.setItem("user", JSON.stringify(newObj));
      return newObj;
    });
  };

  const value = {
    isAuthenticated: Boolean(token && user),
    user,
    role: user?.role || null,
    token,
    loading,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
