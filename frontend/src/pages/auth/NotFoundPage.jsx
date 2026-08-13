import React from "react";
import { Box, Typography, Button, Container, Paper } from "@mui/material";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function NotFoundPage() {
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuth();

  const handleHome = () => {
    if (!isAuthenticated) {
      navigate("/login");
    } else if (role === "ADMIN") {
      navigate("/admin/dashboard");
    } else {
      navigate("/student/dashboard");
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
            bgcolor: "#eff6ff",
            color: "primary.main",
            display: "grid",
            placeItems: "center",
            mx: "auto",
            mb: 2.5,
          }}
        >
          <MapOutlinedIcon sx={{ fontSize: 34 }} />
        </Box>

        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, color: "#1e293b", fontSize: "1.5rem" }}>
          404 — Page Not Found
        </Typography>

        <Typography variant="body2" sx={{ color: "text.secondary", mb: 4, lineHeight: 1.6 }}>
          The page you are looking for does not exist or has been moved.
        </Typography>

        <Button variant="contained" color="primary" onClick={handleHome} size="medium" sx={{ px: 4 }}>
          Go Back Home
        </Button>
      </Paper>
    </Container>
  );
}
