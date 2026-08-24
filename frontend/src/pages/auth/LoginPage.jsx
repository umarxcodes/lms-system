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
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
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

  const { login, isAuthenticated, user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    if (isAuthenticated && user) {
      const role = (user?.role || "").toUpperCase();
      if (role === "ADMIN") navigate("/admin/dashboard", { replace: true });
      else if (role === "STUDENT") navigate("/student/dashboard", { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await login(email, password);
      showToast("Welcome back! Signed in successfully.", "success");

      const loggedUser = res?.data?.user || res?.user;
      const role = (loggedUser?.role || "").toUpperCase();
      const from = location.state?.from?.pathname;

      if (from && from !== "/403" && from !== "/login") navigate(from, { replace: true });
      else if (role === "ADMIN") navigate("/admin/dashboard", { replace: true });
      else if (role === "STUDENT") navigate("/student/dashboard", { replace: true });
      else navigate("/login", { replace: true });
    } catch (err) {
      setError(err?.message || "Invalid credentials. Please check your email and password.");
    } finally {
      setLoading(false);
    }
  };

  // ─── Shared TextField styles ───
  const inputSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
      bgcolor: "#FAFAFA",
      fontSize: "0.875rem",
      transition: "all 0.18s ease",
      "& fieldset": { borderColor: "#E2E8F0" },
      "&:hover fieldset": { borderColor: "#CBD5E1" },
      "&:hover": { bgcolor: "#F8FAFC" },
      "&.Mui-focused": {
        bgcolor: "#FFFFFF",
        "& fieldset": { borderColor: "#2563EB", borderWidth: "1.5px" },
        boxShadow: "0 0 0 3px rgba(37,99,235,0.08)",
      },
    },
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#F8FAFC",
        backgroundImage: [
          "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(37,99,235,0.07) 0%, transparent 70%)",
          "radial-gradient(ellipse 50% 40% at 0% 100%, rgba(124,58,237,0.04) 0%, transparent 60%)",
        ].join(","),
        px: 2,
        py: 8,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 420,
          animation: "fadeUp 300ms cubic-bezier(0.16, 1, 0.3, 1) both",
          "@keyframes fadeUp": {
            "0%": { opacity: 0, transform: "translateY(16px)" },
            "100%": { opacity: 1, transform: "translateY(0)" },
          },
        }}
      >
        {/* ─── Brand header ─── */}
        <Stack alignItems="center" spacing={1} sx={{ mb: 5 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 3,
              bgcolor: "#FFFFFF",
              border: "1px solid #E2E8F0",
              boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
              display: "grid",
              placeItems: "center",
              mb: 0.5,
            }}
          >
            <Box
              component="img"
              src="https://res.cloudinary.com/dlul8f6xz/image/upload/v1786599373/logo.6lrMPvRL_phqqyj.png"
              alt="SMIT Logo"
              sx={{ height: 36, width: "auto", objectFit: "contain" }}
            />
          </Box>
          <Typography
            variant="h5"
            sx={{ fontWeight: 800, color: "#0F172A", letterSpacing: "-0.025em", fontSize: "1.4rem" }}
          >
            SMIT LMS
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748B", textAlign: "center" }}>
            Saylani Mass I.T. Training Program
          </Typography>
        </Stack>

        {/* ─── Login Card ─── */}
        <Card
          elevation={0}
          sx={{
            borderRadius: "20px",
            border: "1px solid #E2E8F0",
            boxShadow: "0 4px 6px -1px rgba(0,0,0,0.04), 0 24px 48px -12px rgba(15,23,42,0.06)",
            bgcolor: "#FFFFFF",
            overflow: "visible",
          }}
        >
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            {/* Card title */}
            <Box sx={{ mb: 3.5 }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 800, color: "#0F172A", fontSize: "1.05rem", letterSpacing: "-0.01em", mb: 0.4 }}
              >
                Sign in to your account
              </Typography>
              <Typography variant="body2" sx={{ color: "#64748B", fontSize: "0.825rem" }}>
                Enter your credentials to access the portal
              </Typography>
            </Box>

            {/* Error alert */}
            {error && (
              <Alert
                severity="error"
                onClose={() => setError("")}
                sx={{ mb: 3, borderRadius: "10px", fontSize: "0.825rem", fontWeight: 600 }}
              >
                {error}
              </Alert>
            )}

            {/* Form */}
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Stack spacing={2.5}>
                {/* Email */}
                <Box>
                  <Typography
                    component="label"
                    htmlFor="login-email"
                    sx={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#374151", mb: 0.75, letterSpacing: "0.01em" }}
                  >
                    Email address
                  </Typography>
                  <TextField
                    id="login-email"
                    fullWidth
                    type="email"
                    placeholder="you@saylani.org"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    variant="outlined"
                    autoComplete="email"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailOutlinedIcon sx={{ fontSize: 17, color: "#94A3B8" }} />
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={inputSx}
                  />
                </Box>

                {/* Password */}
                <Box>
                  <Typography
                    component="label"
                    htmlFor="login-password"
                    sx={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#374151", mb: 0.75, letterSpacing: "0.01em" }}
                  >
                    Password
                  </Typography>
                  <TextField
                    id="login-password"
                    fullWidth
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    variant="outlined"
                    autoComplete="current-password"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockOutlinedIcon sx={{ fontSize: 17, color: "#94A3B8" }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              size="small"
                              tabIndex={-1}
                              sx={{ color: "#94A3B8", "&:hover": { color: "#475569" } }}
                            >
                              {showPassword
                                ? <VisibilityOff sx={{ fontSize: 17 }} />
                                : <Visibility sx={{ fontSize: 17 }} />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={inputSx}
                  />
                </Box>

                {/* Submit */}
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  sx={{
                    mt: 0.5,
                    py: 1.25,
                    borderRadius: "10px",
                    bgcolor: "#2563EB",
                    fontWeight: 700,
                    fontSize: "0.875rem",
                    letterSpacing: "0.01em",
                    textTransform: "none",
                    boxShadow: "0 2px 8px rgba(37,99,235,0.25), 0 1px 2px rgba(37,99,235,0.12)",
                    transition: "all 0.18s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      bgcolor: "#1D4ED8",
                      boxShadow: "0 4px 16px rgba(37,99,235,0.35)",
                      transform: "translateY(-1px)",
                    },
                    "&:active": { transform: "translateY(0)", boxShadow: "0 1px 4px rgba(37,99,235,0.2)" },
                    "&:disabled": { bgcolor: "#93C5FD", boxShadow: "none" },
                  }}
                >
                  {loading ? (
                    <Stack direction="row" spacing={1.25} alignItems="center">
                      <CircularProgress size={16} sx={{ color: "rgba(255,255,255,0.8)" }} />
                      <span>Signing in…</span>
                    </Stack>
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </Stack>
            </Box>
          </CardContent>
        </Card>

        {/* ─── Footer ─── */}
        <Typography
          variant="caption"
          sx={{ display: "block", textAlign: "center", mt: 4, color: "#94A3B8", fontWeight: 500, fontSize: "0.72rem" }}
        >
          © {new Date().getFullYear()} Saylani Mass I.T. Training · Enterprise LMS
        </Typography>
      </Box>
    </Box>
  );
}
