import React, { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  Box,
  Stack,
  Switch,
  Divider,
  Button,
  CircularProgress,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

export default function NotificationSettings({ preferences, onSavePreferences, loading }) {
  const [prefs, setPrefs] = useState({
    emailNotifications: true,
    taskNotifications: true,
    attendanceNotifications: true,
    projectNotifications: true,
    systemNotifications: true,
  });

  useEffect(() => {
    if (preferences) {
      setPrefs({
        emailNotifications: preferences.emailNotifications ?? true,
        taskNotifications: preferences.taskNotifications ?? true,
        attendanceNotifications: preferences.attendanceNotifications ?? true,
        projectNotifications: preferences.projectNotifications ?? true,
        systemNotifications: preferences.systemNotifications ?? true,
      });
    }
  }, [preferences]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSavePreferences(prefs);
  };

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
          Notification Preferences
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Customize your communication preferences and automated alert channels.
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2} divider={<Divider />}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", py: 1 }}>
            <Box>
              <Typography variant="subtitle2" fontWeight={700} color="#0f172a">
                Email Notifications
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Receive important account and assignment updates directly in your email inbox.
              </Typography>
            </Box>
            <Switch
              checked={prefs.emailNotifications}
              onChange={(e) => setPrefs({ ...prefs, emailNotifications: e.target.checked })}
              color="primary"
            />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", py: 1 }}>
            <Box>
              <Typography variant="subtitle2" fontWeight={700} color="#0f172a">
                Task & Milestone Alerts
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Get notified when tasks are assigned, updated, or nearing due dates.
              </Typography>
            </Box>
            <Switch
              checked={prefs.taskNotifications}
              onChange={(e) => setPrefs({ ...prefs, taskNotifications: e.target.checked })}
              color="primary"
            />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", py: 1 }}>
            <Box>
              <Typography variant="subtitle2" fontWeight={700} color="#0f172a">
                Attendance Notifications
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Receive alerts when attendance records are published or updated.
              </Typography>
            </Box>
            <Switch
              checked={prefs.attendanceNotifications}
              onChange={(e) => setPrefs({ ...prefs, attendanceNotifications: e.target.checked })}
              color="primary"
            />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", py: 1 }}>
            <Box>
              <Typography variant="subtitle2" fontWeight={700} color="#0f172a">
                Project & Team Notifications
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Stay updated on team project assignments, milestone progress, and roster changes.
              </Typography>
            </Box>
            <Switch
              checked={prefs.projectNotifications}
              onChange={(e) => setPrefs({ ...prefs, projectNotifications: e.target.checked })}
              color="primary"
            />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", py: 1 }}>
            <Box>
              <Typography variant="subtitle2" fontWeight={700} color="#0f172a">
                System Announcements
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Receive official SMIT portal maintenance and schedule broadcasts.
              </Typography>
            </Box>
            <Switch
              checked={prefs.systemNotifications}
              onChange={(e) => setPrefs({ ...prefs, systemNotifications: e.target.checked })}
              color="primary"
            />
          </Box>
        </Stack>

        <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3, pt: 2, borderTop: "1px solid #e2e8f0" }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
            sx={{ fontWeight: 800, borderRadius: 2, px: 3.5 }}
          >
            {loading ? "Saving..." : "Save Preferences"}
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
}
