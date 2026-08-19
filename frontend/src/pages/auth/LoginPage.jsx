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
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import SecurityIcon from "@mui/icons-material/Security";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import StatusBadge from "../../components/common/StatusBadge";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login, isAuthenticated, user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    if (isAuthenticated && user) {
      const userRole = (user?.role || "").toUpperCase();
      if (userRole === "ADMIN") {
        navigate("/admin/dashboard", { replace: true });
      } else if (userRole === "STUDENT") {
        navigate("/student/dashboard", { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter your Email Address and Password.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await login(email, password);
      showToast("Welcome back! Login successful.", "success");

      const loggedUser = res?.data?.user || res?.user;
      const userRole = (loggedUser?.role || "").toUpperCase();
      const from = location.state?.from?.pathname;

      if (from && from !== "/403" && from !== "/login") {
        navigate(from, { replace: true });
      } else if (userRole === "ADMIN") {
        navigate("/admin/dashboard", { replace: true });
      } else if (userRole === "STUDENT") {
        navigate("/student/dashboard", { replace: true });
      } else {
        navigate("/login", { replace: true });
      }
    } catch (err) {
      setError(
        err?.message ||
          "Invalid credentials. Please verify your Email and password."
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
        bgcolor: "#F8FAFC",
        backgroundImage:
          "radial-gradient(circle at 50% 0%, rgba(37, 99, 235, 0.05) 0%, transparent 60%), radial-gradient(circle at 0% 100%, rgba(124, 58, 237, 0.03) 0%, transparent 50%)",
        py: 6,
        px: 2,
      }}
    >
      <Container
        maxWidth="xs"
        sx={{
          maxWidth: 420,
          animation: "loginFade 280ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
          "@keyframes loginFade": {
            "0%": { opacity: 0, transform: "translateY(10px)" },
            "100%": { opacity: 1, transform: "translateY(0)" },
          },
        }}
      >
        <Stack spacing={3.5} alignItems="center">
          {/* Header Branding */}
          <Box sx={{ textAlign: "center", width: "100%" }}>
            <Box
              component="img"
              src="https://res.cloudinary.com/dlul8f6xz/image/upload/v1786599373/logo.6lrMPvRL_phqqyj.png"
              alt="SMIT Logo"
              sx={{
                height: 64,
                width: "auto",
                objectFit: "contain",
                mx: "auto",
                display: "block",
                mb: 1.5,
                filter: "drop-shadow(0 4px 10px rgba(0, 0, 0, 0.04))",
              }}
            />
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                color: "#0F172A",
                fontSize: "1.35rem",
                letterSpacing: "-0.02em",
                mb: 0.5,
              }}
            >
              SMIT LMS Portal
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: "#64748B",
                fontWeight: 600,
                fontSize: "0.8rem",
              }}
            >
              Saylani Mass I.T. Training Program
            </Typography>
          </Box>

          {/* Login Card */}
          <Card
            elevation={0}
            sx={{
              width: "100%",
              borderRadius: "16px",
              bgcolor: "#FFFFFF",
              border: "1px solid #E2E8F0",
              boxShadow: "0 20px 40px -15px rgba(15, 23, 42, 0.06), 0 0 1px 1px rgba(0,0,0,0.02)",
            }}
          >
            <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: "#0F172A",
                      fontSize: "1.1rem",
                      mb: 0.2,
                    }}
                  >
                    Sign In
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#64748B",
                      fontSize: "0.8rem",
                    }}
                  >
                    Access your account dashboard
                  </Typography>
                </Box>
                <StatusBadge status="brand" label="Secure Auth" icon={SecurityIcon} />
              </Stack>

              {error && (
                <Alert
                  severity="error"
                  sx={{
                    mb: 3,
                    borderRadius: "10px",
                    fontSize: "0.825rem",
                    fontWeight: 600,
                    border: "1px solid #FEE2E2",
                  }}
                  onClose={() => setError("")}
                >
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit} noValidate>
                <Stack spacing={2.5}>
                  {/* Email Input */}
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 700,
                        color: "#475569",
                        fontSize: "0.75rem",
                        mb: 0.8,
                        display: "block",
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                      }}
                    >
                      Email Address *
                    </Typography>
                    <TextField
                      fullWidth
                      type="email"
                      placeholder="e.g. student@saylani.org"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      variant="outlined"
                      size="medium"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailOutlinedIcon fontSize="small" sx={{ color: "#94A3B8" }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "10px",
                          bgcolor: "#FFFFFF",
                          fontSize: "0.875rem",
                          "& fieldset": { borderColor: "#E2E8F0" },
                          "&:hover fieldset": { borderColor: "#CBD5E1" },
                          "&.Mui-focused fieldset": {
                            borderColor: "#2563EB",
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
                        color: "#475569",
                        fontSize: "0.75rem",
                        mb: 0.8,
                        display: "block",
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                      }}
                    >
                      Password *
                    </Typography>
                    <TextField
                      fullWidth
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter account password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      variant="outlined"
                      size="medium"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockOutlinedIcon fontSize="small" sx={{ color: "#94A3B8" }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              size="small"
                              sx={{
                                width: 28,
                                height: 28,
                                borderRadius: "50%",
                                "&:hover": { bgcolor: "#F1F5F9" },
                              }}
                            >
                              {showPassword ? (
                                <VisibilityOff fontSize="small" sx={{ color: "#64748B", fontSize: 18 }} />
                              ) : (
                                <Visibility fontSize="small" sx={{ color: "#64748B", fontSize: 18 }} />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "10px",
                          bgcolor: "#FFFFFF",
                          fontSize: "0.875rem",
                          "& fieldset": { borderColor: "#E2E8F0" },
                          "&:hover fieldset": { borderColor: "#CBD5E1" },
                          "&.Mui-focused fieldset": {
                            borderColor: "#2563EB",
                            borderWidth: "1.5px",
                          },
                        },
                      }}
                    />
                  </Box>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading}
                    startIcon={
                      loading ? <CircularProgress size={18} color="inherit" /> : null
                    }
                    sx={{
                      bgcolor: "#2563EB",
                      color: "#FFFFFF",
                      fontWeight: 700,
                      fontSize: "0.875rem",
                      textTransform: "none",
                      py: 1.3,
                      mt: 1,
                      borderRadius: "10px",
                      boxShadow: "0 2px 8px rgba(37, 99, 235, 0.2)",
                      transition: "all 0.18s ease-in-out",
                      "&:hover": {
                        bgcolor: "#1D4ED8",
                        boxShadow: "0 4px 14px rgba(37, 99, 235, 0.3)",
                        transform: "translateY(-1px)",
                      },
                    }}
                  >
                    {loading ? "Authenticating..." : "Sign In to Portal"}
                  </Button>
                </Stack>
              </Box>
            </CardContent>
          </Card>

          {/* Footer Branding Note */}
          <Typography
            variant="caption"
            sx={{
              color: "#94A3B8",
              fontWeight: 600,
              fontSize: "0.75rem",
              textAlign: "center",
            }}
          >
            © {new Date().getFullYear()} Saylani Mass I.T Training • Enterprise LMS v2.0
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}

