import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Box, CircularProgress } from "@mui/material";

export default function RoleRoute({ allowedRole }) {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.default",
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  const currentRole = (role || user?.role || "").toUpperCase();
  const targetRole = (allowedRole || "").toUpperCase();

  if (!currentRole || currentRole !== targetRole) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
}
