import React from "react";
import { Box, Typography, Button, Container, Paper } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ForbiddenPage() {
  const navigate = useNavigate();
  const { role } = useAuth();

  const handleBack = () => {
    if (role === "ADMIN") {
      navigate("/admin/dashboard");
    } else if (role === "STUDENT") {
      navigate("/student/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 10 }}>
      <Paper
        elevation={0}
        sx={{
          p: 5,
          textAlign: "center",
          borderRadius: 4,
          border: "1px solid #e2e8f0",
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.04)",
          bgcolor: "background.paper",
        }}
      >
        <Box
          component="img"
          src="https://res.cloudinary.com/dlul8f6xz/image/upload/v1786599373/logo.6lrMPvRL_phqqyj.png"
          alt="SMIT Logo"
          sx={{
            height: 52,
            width: "auto",
            objectFit: "contain",
            mx: "auto",
            display: "block",
            mb: 3,
          }}
        />

        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            bgcolor: "#fef2f2",
            color: "error.main",
            display: "grid",
            placeItems: "center",
            mx: "auto",
            mb: 2.5,
          }}
        >
          <LockOutlinedIcon sx={{ fontSize: 34 }} />
        </Box>

        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, color: "#1e293b", fontSize: "1.5rem" }}>
          403 — Access Denied
        </Typography>

        <Typography variant="body2" sx={{ color: "text.secondary", mb: 4, lineHeight: 1.6 }}>
          You do not have permission to access this module. If you believe this is an error, please contact the administrator.
        </Typography>

        <Button variant="contained" color="primary" onClick={handleBack} size="medium" sx={{ px: 4 }}>
          Return to Dashboard
        </Button>
      </Paper>
    </Container>
  );
}
