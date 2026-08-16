import React, { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  Box,
  Stack,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

export default function ApplicationSettings({ appSettings, onSaveAppSettings, loading }) {
  const [formData, setFormData] = useState({
    applicationName: "Saylani Bootcamp LMS",
    timezone: "Asia/Karachi",
    dateFormat: "YYYY-MM-DD",
    defaultPageSize: 20,
  });

  useEffect(() => {
    if (appSettings) {
      setFormData({
        applicationName: appSettings.applicationName || "Saylani Bootcamp LMS",
        timezone: appSettings.timezone || "Asia/Karachi",
        dateFormat: appSettings.dateFormat || "YYYY-MM-DD",
        defaultPageSize: appSettings.defaultPageSize || 20,
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
          Application Configuration (Admin Only)
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Global institutional settings and system-wide default configuration parameters.
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2.5}>
          <TextField
            label="Portal Branding Name"
            fullWidth
            required
            size="small"
            value={formData.applicationName}
            onChange={(e) => setFormData({ ...formData, applicationName: e.target.value })}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />

          <TextField
            select
            label="Default System Timezone"
            fullWidth
            size="small"
            value={formData.timezone}
            onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          >
            <MenuItem value="Asia/Karachi">Asia/Karachi (PKT +05:00)</MenuItem>
            <MenuItem value="UTC">Coordinated Universal Time (UTC)</MenuItem>
            <MenuItem value="America/New_York">America/New_York (EST -05:00)</MenuItem>
            <MenuItem value="Europe/London">Europe/London (GMT +00:00)</MenuItem>
          </TextField>

          <TextField
            select
            label="Default System Date Display Format"
            fullWidth
            size="small"
            value={formData.dateFormat}
            onChange={(e) => setFormData({ ...formData, dateFormat: e.target.value })}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          >
            <MenuItem value="YYYY-MM-DD">2026-08-16 (YYYY-MM-DD)</MenuItem>
            <MenuItem value="DD-MM-YYYY">16-08-2026 (DD-MM-YYYY)</MenuItem>
            <MenuItem value="MM-DD-YYYY">08-16-2026 (MM-DD-YYYY)</MenuItem>
          </TextField>

          <TextField
            select
            label="Default Table Items Per Page"
            fullWidth
            size="small"
            value={formData.defaultPageSize}
            onChange={(e) => setFormData({ ...formData, defaultPageSize: Number(e.target.value) })}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          >
            <MenuItem value={10}>10 items per page</MenuItem>
            <MenuItem value={20}>20 items per page (Recommended)</MenuItem>
            <MenuItem value={50}>50 items per page</MenuItem>
            <MenuItem value={100}>100 items per page</MenuItem>
          </TextField>

          <Stack direction="row" justifyContent="flex-end" sx={{ pt: 1 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
              sx={{ fontWeight: 800, borderRadius: 2, px: 3.5 }}
            >
              {loading ? "Saving Application Configuration..." : "Save System Settings"}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Paper>
  );
}
