import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  TextField,
  Box,
  CircularProgress,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import { useOutletContext } from "react-router-dom";

import PageHeader from "../../components/common/PageHeader";
import { PageContent } from "../../components/layout/AppLayout";
import { settingsApi } from "../../services/settingsApi";
import { useToast } from "../../context/ToastContext";

export default function StudentSettings() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const { onMobileNavOpen } = useOutletContext() || {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;

    setLoading(true);
    try {
      await settingsApi.changePassword(currentPassword, newPassword);
      showToast("Password updated successfully!", "success");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      showToast(err?.message || "Failed to update password", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContent>
      <PageHeader
        title="Student Settings"
        description="Manage your account security and authentication credentials."
      />
        <Card sx={{ maxWidth: 480 }}>
          <CardContent sx={{ p: 4 }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2.5,
                  bgcolor: "primary.50",
                  color: "primary.main",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <LockIcon fontSize="large" />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Change Password
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Update your security password
                </Typography>
              </Box>
            </Stack>

            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={2.5}>
                <TextField
                  label="Current Password"
                  type="password"
                  fullWidth
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />

                <TextField
                  label="New Password"
                  type="password"
                  fullWidth
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />

                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
                >
                  {loading ? "Updating..." : "Update Password"}
                </Button>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </PageContent>
  );
}
