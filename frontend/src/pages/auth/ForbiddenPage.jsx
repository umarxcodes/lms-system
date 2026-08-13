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
            bgcolor: "error.50",
            color: "error.main",
            display: "grid",
            placeItems: "center",
            mx: "auto",
            mb: 3,
          }}
        >
          <LockOutlinedIcon sx={{ fontSize: 40 }} />
        </Box>

        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: "text.primary" }}>
          403 — Access Denied
        </Typography>

        <Typography variant="body1" sx={{ color: "text.secondary", mb: 4 }}>
          You do not have permission to access this module. If you believe this is an error, please contact the administrator.
        </Typography>

        <Button variant="contained" color="primary" onClick={handleBack} size="large">
          Return to Dashboard
        </Button>
      </Paper>
    </Container>
  );
}
