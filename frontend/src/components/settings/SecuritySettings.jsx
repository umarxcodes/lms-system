import React, { useState } from "react";
import {
  Paper,
  Typography,
  Box,
  Stack,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
  Chip,
  Divider,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";

export default function SecuritySettings({ securityInfo, onUpdatePassword, loading }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!currentPassword) {
      setErrorMsg("Please enter your current password.");
      return;
    }
    if (newPassword.length < 8) {
      setErrorMsg("New password must be at least 8 characters long.");
      return;
    }
    if (newPassword === currentPassword) {
      setErrorMsg("New password must be different from current password.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg("New password and confirm password do not match.");
      return;
    }

    onUpdatePassword(currentPassword, newPassword, () => {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    });
  };

  const formattedPasswordDate = securityInfo?.passwordChangedAt
    ? new Date(securityInfo.passwordChangedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Never changed";

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3, sm: 4 },
        bgcolor: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: 2.5,
        width: "100%",
        maxWidth: 680,
      }}
    >
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" fontWeight={800} color="#0f172a">
          Security & Credentials
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage your account authentication credentials and security parameters.
        </Typography>
      </Box>

      {/* Account Security Information Card */}
      <Box sx={{ p: 2.5, bgcolor: "#f8fafc", borderRadius: 2, border: "1px solid #e2e8f0", mb: 3 }}>
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
          <VerifiedUserIcon color="primary" fontSize="small" />
          <Typography variant="subtitle2" fontWeight={700} color="#0f172a">
            Account Status & Integrity
          </Typography>
          <Chip label="ACTIVE" color="success" size="small" sx={{ fontWeight: 800, fontSize: "0.7rem", height: 22 }} />
        </Stack>

        <Stack spacing={0.8}>
          <Typography variant="caption" color="text.secondary">
            Authentication Method: <strong>JWT Bearer Token + Bcrypt Hash</strong>
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Password Last Changed: <strong>{formattedPasswordDate}</strong>
          </Typography>
        </Stack>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {errorMsg && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setErrorMsg("")}>
          {errorMsg}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2.5}>
          <Typography variant="subtitle2" fontWeight={700} color="#0f172a">
            Change Account Password
          </Typography>

          {/* Current Password */}
          <TextField
            label="Current Password"
            type={showCurrent ? "text" : "password"}
            fullWidth
            required
            size="small"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle current password visibility"
                      onClick={() => setShowCurrent(!showCurrent)}
                      edge="end"
                      size="small"
                    >
                      {showCurrent ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          {/* New Password */}
          <TextField
            label="New Password"
            type={showNew ? "text" : "password"}
            fullWidth
            required
            size="small"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            helperText="Minimum 8 characters. Must be different from current password."
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle new password visibility"
                      onClick={() => setShowNew(!showNew)}
                      edge="end"
                      size="small"
                    >
                      {showNew ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          {/* Confirm Password */}
          <TextField
            label="Confirm New Password"
            type={showConfirm ? "text" : "password"}
            fullWidth
            required
            size="small"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={() => setShowConfirm(!showConfirm)}
                      edge="end"
                      size="small"
                    >
                      {showConfirm ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <Stack direction="row" justifyContent="flex-end" sx={{ pt: 1 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <LockIcon />}
              sx={{ fontWeight: 800, borderRadius: 2, px: 3.5 }}
            >
              {loading ? "Updating Password..." : "Update Password"}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Paper>
  );
}
