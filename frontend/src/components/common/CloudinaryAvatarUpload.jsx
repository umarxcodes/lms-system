import React, { useState } from "react";
import { Box, Avatar, Button, Stack, Typography, CircularProgress, Alert } from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function CloudinaryAvatarUpload({
  currentAvatarUrl,
  userName = "User",
  onUpload,
  onDelete,
  size = 96,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);

    // Validate type
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Only JPEG, PNG, and WEBP image files are allowed.");
      return;
    }

    // Validate size
    if (file.size > MAX_FILE_SIZE) {
      setError("Image size exceeds the 2MB limit.");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      setLoading(true);
      await onUpload(formData);
    } catch (err) {
      setError(err?.message || "Failed to upload profile image.");
    } finally {
      setLoading(false);
      event.target.value = "";
    }
  };

  const handleDelete = async () => {
    setError(null);
    try {
      setLoading(true);
      await onDelete();
    } catch (err) {
      setError(err?.message || "Failed to delete profile image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, alignItems: "flex-start" }}>
      <Stack direction="row" spacing={3} alignItems="center">
        <Box sx={{ position: "relative" }}>
          <Avatar
            src={currentAvatarUrl || ""}
            alt={userName}
            sx={{
              width: size,
              height: size,
              bgcolor: "primary.main",
              fontSize: size * 0.4,
              fontWeight: 700,
              border: "3px solid #ffffff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
            }}
          >
            {userName ? userName.charAt(0).toUpperCase() : "U"}
          </Avatar>
          {loading && (
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: size,
                height: size,
                borderRadius: "50%",
                bgcolor: "rgba(0,0,0,0.4)",
                display: "grid",
                placeItems: "center",
              }}
            >
              <CircularProgress size={24} sx={{ color: "#ffffff" }} />
            </Box>
          )}
        </Box>

        <Stack spacing={1}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary" }}>
            Profile Picture
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            JPEG, PNG, or WEBP. Max size 2MB.
          </Typography>

          <Stack direction="row" spacing={1} sx={{ pt: 0.5 }}>
            <Button
              variant="outlined"
              size="small"
              component="label"
              startIcon={<PhotoCameraIcon />}
              disabled={loading}
            >
              {currentAvatarUrl ? "Change Photo" : "Upload Photo"}
              <input type="file" hidden accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} />
            </Button>

            {currentAvatarUrl && (
              <Button
                variant="text"
                color="error"
                size="small"
                startIcon={<DeleteOutlinedIcon />}
                onClick={handleDelete}
                disabled={loading}
              >
                Remove
              </Button>
            )}
          </Stack>
        </Stack>
      </Stack>

      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ width: "100%", mt: 1 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
}
