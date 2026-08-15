import React, { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  Box,
  Stack,
  Switch,
  FormControlLabel,
  Divider,
  Button,
  CircularProgress,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

export default function NotificationSettings({ preferences, onSavePreferences, loading }) {
  const [prefs, setPrefs] = useState({
    emailNotifications: true,
    taskReminders: true,
    systemAnnouncements: true,
    weeklyReportDigest: false,
  });

  useEffect(() => {
    if (preferences) {
      setPrefs({
        emailNotifications: preferences.emailNotifications ?? true,
        taskReminders: preferences.taskReminders ?? true,
        systemAnnouncements: preferences.systemAnnouncements ?? true,
        weeklyReportDigest: preferences.weeklyReportDigest ?? false,
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
                Receive important account and assignment updates directly in your inbox.
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
                Task & Milestone Reminders
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Get notified when tasks are assigned, updated, or nearing due dates.
              </Typography>
            </Box>
            <Switch
              checked={prefs.taskReminders}
              onChange={(e) => setPrefs({ ...prefs, taskReminders: e.target.checked })}
              color="primary"
            />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", py: 1 }}>
            <Box>
              <Typography variant="subtitle2" fontWeight={700} color="#0f172a">
                System Announcements
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Receive official SMIT portal maintenance and schedule announcements.
              </Typography>
            </Box>
            <Switch
              checked={prefs.systemAnnouncements}
              onChange={(e) => setPrefs({ ...prefs, systemAnnouncements: e.target.checked })}
              color="primary"
            />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", py: 1 }}>
            <Box>
              <Typography variant="subtitle2" fontWeight={700} color="#0f172a">
                Weekly Performance Summary Digest
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Receive a weekly summary email of student progress and team milestones.
              </Typography>
            </Box>
            <Switch
              checked={prefs.weeklyReportDigest}
              onChange={(e) => setPrefs({ ...prefs, weeklyReportDigest: e.target.checked })}
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
