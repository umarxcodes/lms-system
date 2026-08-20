import React from "react";
import { Box, Typography, Button, Container, Paper, Stack } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ForbiddenPage() {
  const navigate = useNavigate();
  const { role } = useAuth();

  const handleHome = () => {
    if (role === "ADMIN") {
      navigate("/admin/dashboard");
    } else if (role === "STUDENT") {
      navigate("/student/dashboard");
    } else {
      navigate("/login");
    }
  };

  const homeLabel =
    role === "ADMIN"
      ? "Back to Admin Dashboard"
      : role === "STUDENT"
      ? "Back to Student Portal"
      : "Back to Sign In";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f8fafc",
        backgroundImage:
          "radial-gradient(circle at 50% 0%, rgba(220, 38, 38, 0.04) 0%, transparent 60%), radial-gradient(circle at 0% 100%, rgba(37, 99, 235, 0.02) 0%, transparent 50%)",
        py: 6,
        px: 2,
      }}
    >
      <Container
        maxWidth="xs"
        sx={{
          maxWidth: 440,
          animation: "forbiddenFade 300ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
          willChange: "opacity, transform",
          "@keyframes forbiddenFade": {
            "0%": { opacity: 0, transform: "translateY(8px)" },
            "100%": { opacity: 1, transform: "translateY(0)" },
          },
          "@media (prefers-reduced-motion: reduce)": {
            animation: "none",
          },
        }}
      >
        <Stack spacing={3} alignItems="center">
          {/* Branding Header */}
          <Box sx={{ textAlign: "center", width: "100%" }}>
            <Box
              component="img"
              src="https://res.cloudinary.com/dlul8f6xz/image/upload/v1786599373/logo.6lrMPvRL_phqqyj.png"
              alt="SMIT Logo"
              sx={{
                height: 56,
                width: "auto",
                objectFit: "contain",
                mx: "auto",
                display: "block",
                mb: 1.5,
                filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.05))",
              }}
            />
            <Typography
              variant="caption"
              sx={{
                color: "#64748b",
                fontWeight: 700,
                fontSize: "0.75rem",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              Saylani Mass I.T. Training Program
            </Typography>
          </Box>

          {/* 403 Card */}
          <Paper
            elevation={0}
            sx={{
              width: "100%",
              p: { xs: 3.5, sm: 4.5 },
              textAlign: "center",
              borderRadius: 4,
              bgcolor: "#ffffff",
              border: "1px solid #e2e8f0",
              boxShadow:
                "0 10px 30px -5px rgba(0, 0, 0, 0.05), 0 4px 10px -2px rgba(0, 0, 0, 0.02)",
            }}
          >
            {/* Icon */}
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
              <LockOutlinedIcon sx={{ fontSize: 32 }} />
            </Box>

            <Typography
              variant="caption"
              sx={{
                display: "inline-block",
                px: 1.5,
                py: 0.4,
                borderRadius: 2,
                bgcolor: "#fef2f2",
                color: "#dc2626",
                fontWeight: 800,
                fontSize: "0.75rem",
                letterSpacing: "0.05em",
                mb: 1.5,
              }}
            >
              ERROR 403
            </Typography>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                color: "#0f172a",
                fontSize: "1.35rem",
                letterSpacing: "-0.02em",
                mb: 1,
              }}
            >
              Access Denied
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "#64748b",
                fontSize: "0.875rem",
                lineHeight: 1.6,
                mb: 3.5,
              }}
            >
              You don't have permission to access this page. If you believe
              this is an error, please contact your administrator.
            </Typography>

            <Stack spacing={1.5} width="100%">
              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                onClick={handleHome}
                startIcon={<HomeOutlinedIcon />}
                sx={{ py: 1.2, fontWeight: 700, fontSize: "0.9rem" }}
              >
                {homeLabel}
              </Button>

              <Button
                variant="outlined"
                color="inherit"
                fullWidth
                size="large"
                onClick={() => navigate(-1)}
                startIcon={<ArrowBackIcon />}
                sx={{
                  py: 1.2,
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  borderColor: "#cbd5e1",
                  color: "#475569",
                  "&:hover": {
                    borderColor: "#94a3b8",
                    bgcolor: "grey.50",
                  },
                }}
              >
                Go Back Previous Page
              </Button>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
}
