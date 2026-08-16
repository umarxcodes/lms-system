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
import { useToast } from "../../context/ToastContext";

export default function PreferenceSettings() {
  const [language, setLanguage] = useState(() => localStorage.getItem("portal_language") || "en-US");
  const [timezone, setTimezone] = useState(() => localStorage.getItem("portal_timezone") || "Asia/Karachi");
  const [dateFormat, setDateFormat] = useState(() => localStorage.getItem("portal_date_format") || "YYYY-MM-DD");
  const [saving, setSaving] = useState(false);

  const { showToast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      localStorage.setItem("portal_language", language);
      localStorage.setItem("portal_timezone", timezone);
      localStorage.setItem("portal_date_format", dateFormat);
      showToast("Portal preferences saved successfully!", "success");
    } catch (err) {
      showToast("Failed to save portal preferences", "error");
    } finally {
      setSaving(false);
    }
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
        maxWidth: 640,
      }}
    >
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" fontWeight={800} color="#0f172a">
          Portal Preferences
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Configure personal regional settings, portal language preferences, and date formats.
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2.5}>
          <TextField
            select
            label="Portal Interface Language"
            fullWidth
            size="small"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          >
            <MenuItem value="en-US">English (United States)</MenuItem>
            <MenuItem value="ur-PK">Urdu (Pakistan - Regional)</MenuItem>
          </TextField>

          <TextField
            select
            label="System Timezone"
            fullWidth
            size="small"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          >
            <MenuItem value="Asia/Karachi">Asia/Karachi (PKT +05:00)</MenuItem>
            <MenuItem value="UTC">Coordinated Universal Time (UTC)</MenuItem>
            <MenuItem value="America/New_York">America/New_York (EST -05:00)</MenuItem>
          </TextField>

          <TextField
            select
            label="Date Display Format"
            fullWidth
            size="small"
            value={dateFormat}
            onChange={(e) => setDateFormat(e.target.value)}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          >
            <MenuItem value="YYYY-MM-DD">2026-08-16 (YYYY-MM-DD)</MenuItem>
            <MenuItem value="DD-MM-YYYY">16-08-2026 (DD-MM-YYYY)</MenuItem>
            <MenuItem value="MM-DD-YYYY">08-16-2026 (MM-DD-YYYY)</MenuItem>
          </TextField>

          <Stack direction="row" justifyContent="flex-end" sx={{ pt: 1 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={saving}
              startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
              sx={{ fontWeight: 800, borderRadius: 2, px: 3.5 }}
            >
              {saving ? "Saving..." : "Save Preferences"}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Paper>
  );
}
