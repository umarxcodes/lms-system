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
    <Container maxWidth="sm" sx={{ py: 12 }}>
      <Paper
        elevation={0}
        sx={{
          p: 6,
          textAlign: "center",
          borderRadius: 4,
          border: "1px solid",
          borderColor: "grey.200",
          bgcolor: "background.paper",
        }}
      >
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            bgcolor: "primary.50",
            color: "primary.main",
            display: "grid",
            placeItems: "center",
            mx: "auto",
            mb: 3,
          }}
        >
          <MapOutlinedIcon sx={{ fontSize: 40 }} />
        </Box>

        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: "text.primary" }}>
          404 — Page Not Found
        </Typography>

        <Typography variant="body1" sx={{ color: "text.secondary", mb: 4 }}>
          The page you are looking for does not exist or has been moved.
        </Typography>

        <Button variant="contained" color="primary" onClick={handleHome} size="large">
          Go Back Home
        </Button>
      </Paper>
    </Container>
  );
}
