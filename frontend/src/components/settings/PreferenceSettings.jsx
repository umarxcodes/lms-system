import React, { useState } from "react";
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
  const [language, setLanguage] = useState("en-US");
  const [timezone, setTimezone] = useState("Asia/Karachi");
  const [dateFormat, setDateFormat] = useState("MMM DD, YYYY");
  const [saving, setSaving] = useState(false);

  const { showToast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      showToast("Portal preferences saved!", "success");
    }, 400);
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
          Configure regional settings, language preferences, and date formats.
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
            <MenuItem value="MMM DD, YYYY">Aug 15, 2026 (MMM DD, YYYY)</MenuItem>
            <MenuItem value="DD/MM/YYYY">15/08/2026 (DD/MM/YYYY)</MenuItem>
            <MenuItem value="YYYY-MM-DD">2026-08-15 (YYYY-MM-DD)</MenuItem>
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
