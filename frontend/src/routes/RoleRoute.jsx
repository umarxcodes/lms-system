import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RoleRoute({ allowedRole }) {
  const { role } = useAuth();

  if (role !== allowedRole) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
}
