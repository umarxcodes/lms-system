import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Container,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter your CNIC / Email and Password.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await login(email, password);
      showToast("Welcome back! Login successful.", "success");

      const loggedUser = res?.data?.user || res?.user;
      const userRole = loggedUser?.role;
      const from = location.state?.from?.pathname;

      if (from) {
        navigate(from, { replace: true });
      } else if (userRole === "ADMIN") {
        navigate("/admin/dashboard", { replace: true });
      } else if (userRole === "STUDENT") {
        navigate("/student/dashboard", { replace: true });
      } else {
        navigate("/admin/dashboard", { replace: true });
      }
    } catch (err) {
      setError(
        err?.message ||
          "Invalid credentials. Please verify your CNIC / Email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f8fafc",
        backgroundImage: "radial-gradient(circle at 50% 0%, rgba(30, 64, 175, 0.04) 0%, transparent 75%)",
        py: 6,
        px: 2,
      }}
    >
      <Container maxWidth="xs" sx={{ maxWidth: 420 }}>
        <Stack spacing={3.5} alignItems="center">
          {/* Centralized SMIT Branding */}
          <Box sx={{ textAlign: "center", width: "100%" }}>
            <Box
              component="img"
              src="https://res.cloudinary.com/dlul8f6xz/image/upload/v1786599373/logo.6lrMPvRL_phqqyj.png"
              alt="SMIT Logo"
              sx={{
                height: 68,
                width: "auto",
                objectFit: "contain",
                mx: "auto",
                display: "block",
                mb: 1.5,
                filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.05))",
              }}
            />
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                color: "#0f172a",
                fontSize: "1.25rem",
                letterSpacing: "-0.02em",
                fontFamily: '"Plus Jakarta Sans", sans-serif',
              }}
            >
              Saylani LMS Portal
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: "#64748b",
                fontWeight: 600,
                fontSize: "0.78rem",
                letterSpacing: "0.02em",
              }}
            >
              Saylani Mass I.T. Training Program
            </Typography>
          </Box>

          {/* Saylani Portal Card with Soft Shadow */}
          <Card
            elevation={0}
            sx={{
              width: "100%",
              borderRadius: 4,
              bgcolor: "#ffffff",
              border: "1px solid #e2e8f0",
              boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.05), 0 4px 10px -2px rgba(0, 0, 0, 0.02)",
            }}
          >
            <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                    color: "#0f172a",
                    fontSize: "1.15rem",
                    letterSpacing: "-0.01em",
                    mb: 0.5,
                  }}
                >
                  Sign In to Account
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#64748b",
                    fontSize: "0.825rem",
                    lineHeight: 1.5,
                  }}
                >
                  Enter your CNIC number or Email and Password registered with SMIT.
                </Typography>
              </Box>

              {error && (
                <Alert
                  severity="error"
                  sx={{
                    mb: 3,
                    borderRadius: 2.5,
                    fontSize: "0.825rem",
                    fontWeight: 600,
                  }}
                  onClose={() => setError("")}
                >
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit} noValidate>
                <Stack spacing={2.5}>
                  {/* CNIC / Email Input */}
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 700,
                        color: "#334155",
                        fontSize: "0.78rem",
                        mb: 0.8,
                        display: "block",
                        textTransform: "uppercase",
                        letterSpacing: "0.03em",
                      }}
                    >
                      CNIC / Email Address
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="e.g. 42101-1234567-1 or student@saylani.org"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      variant="outlined"
                      size="medium"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <BadgeOutlinedIcon fontSize="small" sx={{ color: "#94a3b8" }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2.5,
                          bgcolor: "#ffffff",
                          fontSize: "0.875rem",
                          "& fieldset": {
                            borderColor: "#cbd5e1",
                          },
                          "&:hover fieldset": {
                            borderColor: "#94a3b8",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#1e40af",
                            borderWidth: "1.5px",
                          },
                        },
                      }}
                    />
                  </Box>

                  {/* Password Input */}
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 700,
                        color: "#334155",
                        fontSize: "0.78rem",
                        mb: 0.8,
                        display: "block",
                        textTransform: "uppercase",
                        letterSpacing: "0.03em",
                      }}
                    >
                      Password
                    </Typography>
                    <TextField
                      fullWidth
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your account password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      variant="outlined"
                      size="medium"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockOutlinedIcon fontSize="small" sx={{ color: "#94a3b8" }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              aria-label="toggle password visibility"
                              size="small"
                            >
                              {showPassword ? (
                                <VisibilityOff fontSize="small" sx={{ color: "#64748b" }} />
                              ) : (
                                <Visibility fontSize="small" sx={{ color: "#64748b" }} />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2.5,
                          bgcolor: "#ffffff",
                          fontSize: "0.875rem",
                          "& fieldset": {
                            borderColor: "#cbd5e1",
                          },
                          "&:hover fieldset": {
                            borderColor: "#94a3b8",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#1e40af",
                            borderWidth: "1.5px",
                          },
                        },
                      }}
                    />
                  </Box>

                  {/* Login Button */}
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading}
                    startIcon={
                      loading ? (
                        <CircularProgress size={18} color="inherit" />
                      ) : null
                    }
                    sx={{
                      background: "linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%)",
                      color: "#ffffff",
                      fontWeight: 800,
                      fontSize: "0.875rem",
                      textTransform: "uppercase",
                      py: 1.4,
                      mt: 1,
                      borderRadius: 2.5,
                      letterSpacing: "0.06em",
                      boxShadow: "0 4px 14px rgba(30, 64, 175, 0.25)",
                      transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                      "&:hover": {
                        background: "linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)",
                        boxShadow: "0 6px 18px rgba(30, 64, 175, 0.35)",
                        transform: "translateY(-1px)",
                      },
                    }}
                  >
                    {loading ? "Signing in..." : "LOG IN"}
                  </Button>
                </Stack>
              </Box>
            </CardContent>
          </Card>

          {/* Footer Branding Note */}
          <Typography
            variant="caption"
            sx={{
              color: "#94a3b8",
              fontWeight: 600,
              fontSize: "0.725rem",
              textAlign: "center",
            }}
          >
            © {new Date().getFullYear()} Saylani Mass I.T Training • Powered by SMIT LMS
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
