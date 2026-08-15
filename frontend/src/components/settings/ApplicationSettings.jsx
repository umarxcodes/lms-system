import React, { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  Box,
  Stack,
  TextField,
  Switch,
  FormControlLabel,
  Button,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

export default function ApplicationSettings({ appSettings, onSaveAppSettings, loading }) {
  const [formData, setFormData] = useState({
    appName: "Saylani Bootcamp LMS",
    defaultBatch: "Batch 2026",
    allowStudentRegistration: true,
    maintenanceMode: false,
  });

  useEffect(() => {
    if (appSettings) {
      setFormData({
        appName: appSettings.appName || "Saylani Bootcamp LMS",
        defaultBatch: appSettings.defaultBatch || "Batch 2026",
        allowStudentRegistration: appSettings.allowStudentRegistration ?? true,
        maintenanceMode: appSettings.maintenanceMode ?? false,
      });
    }
  }, [appSettings]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveAppSettings(formData);
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
        maxWidth: 720,
      }}
    >
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" fontWeight={800} color="#0f172a">
          Application Configuration
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Global institutional settings and system-wide maintenance controls.
        </Typography>
      </Box>

      {formData.maintenanceMode && (
        <Alert severity="warning" icon={<WarningAmberIcon />} sx={{ mb: 3, borderRadius: 2 }}>
          System Maintenance Mode is currently enabled. Trainee self-service portals may have limited accessibility.
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2.5}>
          <TextField
            label="Portal Branding Name"
            fullWidth
            required
            size="small"
            value={formData.appName}
            onChange={(e) => setFormData({ ...formData, appName: e.target.value })}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />

          <TextField
            label="Default Active Batch Identifier"
            fullWidth
            size="small"
            value={formData.defaultBatch}
            onChange={(e) => setFormData({ ...formData, defaultBatch: e.target.value })}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />

          <Divider sx={{ my: 1 }} />

          <Box sx={{ p: 2, bgcolor: "#f8fafc", borderRadius: 2, border: "1px solid #e2e8f0" }}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.allowStudentRegistration}
                  onChange={(e) => setFormData({ ...formData, allowStudentRegistration: e.target.checked })}
                  color="primary"
                />
              }
              label={
                <Box>
                  <Typography variant="subtitle2" fontWeight={700} color="#0f172a">
                    Allow Trainee Self-Registration
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Permit new students to register profiles without manual admin pre-authorization.
                  </Typography>
                </Box>
              }
            />
          </Box>

          <Box sx={{ p: 2, bgcolor: "#fff5f5", borderRadius: 2, border: "1px solid #fee2e2" }}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.maintenanceMode}
                  onChange={(e) => setFormData({ ...formData, maintenanceMode: e.target.checked })}
                  color="error"
                />
              }
              label={
                <Box>
                  <Typography variant="subtitle2" fontWeight={700} color="#991b1b">
                    Enable System Maintenance Mode
                  </Typography>
                  <Typography variant="caption" color="#b91c1c">
                    Restrict non-administrator portal operations during scheduled database audits.
                  </Typography>
                </Box>
              }
            />
          </Box>

          <Stack direction="row" justifyContent="flex-end" sx={{ pt: 1 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
              sx={{ fontWeight: 800, borderRadius: 2, px: 3.5 }}
            >
              {loading ? "Saving System Configuration..." : "Save System Settings"}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Paper>
  );
}
