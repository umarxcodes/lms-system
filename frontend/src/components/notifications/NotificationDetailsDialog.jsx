import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Stack,
  Chip,
  Button,
  IconButton,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

export default function NotificationDetailsDialog({
  open,
  notification,
  onClose,
  onMarkAsRead,
}) {
  if (!notification) return null;

  const isRead = notification.isRead || notification.read;
  const notifId = notification._id || notification.id;

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        elevation: 4,
        sx: { borderRadius: 3, border: "1px solid #e2e8f0" },
      }}
    >
      {/* Header */}
      <DialogTitle sx={{ m: 0, p: 2.5, pb: 1.5 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
          <Box>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
              <Chip
                label={notification.type || notification.category || "NOTIFICATION"}
                size="small"
                sx={{ fontWeight: 800, fontSize: "0.68rem", bgcolor: "#eff6ff", color: "#1e40af" }}
              />
              <Chip
                label={isRead ? "READ" : "UNREAD"}
                size="small"
                sx={{
                  fontWeight: 800,
                  fontSize: "0.68rem",
                  bgcolor: isRead ? "#f1f5f9" : "#fef3c7",
                  color: isRead ? "#475569" : "#d97706",
                }}
              />
            </Stack>
            <Typography variant="h6" fontWeight={800} color="#0f172a">
              {notification.title}
            </Typography>
          </Box>
          <IconButton
            aria-label="close notification details"
            onClick={onClose}
            size="small"
            sx={{ color: "text.secondary" }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>
      </DialogTitle>

      <Divider />

      {/* Body Content */}
      <DialogContent sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Stack direction="row" spacing={1} alignItems="center">
            <AccessTimeIcon fontSize="small" sx={{ color: "text.secondary" }} />
            <Typography variant="caption" color="text.secondary" fontWeight={600}>
              Received on {formatDate(notification.createdAt || notification.date)}
            </Typography>
          </Stack>

          <Box
            sx={{
              p: 2.5,
              bgcolor: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: 2,
            }}
          >
            <Typography variant="body1" color="#1e293b" sx={{ lineHeight: 1.6, whiteSpace: "pre-line" }}>
              {notification.message || notification.body || notification.description}
            </Typography>
          </Box>
        </Stack>
      </DialogContent>

      <Divider />

      {/* Actions */}
      <DialogActions sx={{ p: 2, px: 3 }}>
        {!isRead && onMarkAsRead && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<MarkEmailReadIcon />}
            onClick={() => {
              onMarkAsRead(notifId);
              onClose();
            }}
            sx={{ fontWeight: 800, borderRadius: 2, px: 2.5 }}
          >
            Mark as Read
          </Button>
        )}
        <Button onClick={onClose} variant="outlined" color="inherit" sx={{ fontWeight: 700, borderRadius: 2, px: 2.5 }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
