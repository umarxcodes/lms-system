import React, { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  Box,
  Stack,
  TextField,
  Button,
  Divider,
  CircularProgress,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CloudinaryAvatarUpload from "../common/CloudinaryAvatarUpload";

export default function ProfileSettings({
  user,
  onSaveProfile,
  onUploadAvatar,
  onDeleteAvatar,
  loading,
}) {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    bio: user?.bio || "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        bio: user.bio || "",
      });
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveProfile(formData);
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
          Profile Settings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Update your personal information and profile picture.
        </Typography>
      </Box>

      {/* Cloudinary Profile Photo Section */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" fontWeight={700} color="#334155" sx={{ mb: 1.5 }}>
          Profile Photo
        </Typography>
        <CloudinaryAvatarUpload
          currentAvatarUrl={user?.avatarUrl || user?.profileImage}
          userName={user?.name}
          onUpload={onUploadAvatar}
          onDelete={onDeleteAvatar}
        />
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2.5}>
          <TextField
            label="Full Name"
            fullWidth
            required
            size="small"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />

          <TextField
            label="Email Address"
            fullWidth
            disabled
            size="small"
            value={user?.email || ""}
            helperText="Account email address cannot be changed."
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />

          <TextField
            label="Phone Number"
            fullWidth
            size="small"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+92 300 1234567"
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />

          <TextField
            label="Bio / Professional Summary"
            fullWidth
            multiline
            rows={3}
            size="small"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            placeholder="Brief description about your background or specialization..."
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />

          <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ pt: 1 }}>
            <Button
              type="button"
              variant="outlined"
              color="inherit"
              onClick={() =>
                setFormData({
                  name: user?.name || "",
                  phone: user?.phone || "",
                  bio: user?.bio || "",
                })
              }
              sx={{ fontWeight: 700, borderRadius: 2, px: 3, borderColor: "#cbd5e1", color: "#475569" }}
            >
              Reset
            </Button>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
              sx={{ fontWeight: 800, borderRadius: 2, px: 3.5 }}
            >
              {loading ? "Saving Changes..." : "Save Changes"}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Paper>
  );
}
