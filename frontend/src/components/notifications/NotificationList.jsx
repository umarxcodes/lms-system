import React, { useState } from "react";
import {
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  Stack,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Box,
  Skeleton,
  Button,
  Alert,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AssignmentIcon from "@mui/icons-material/Assignment";
import FolderIcon from "@mui/icons-material/Folder";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import CampaignIcon from "@mui/icons-material/Campaign";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";

import EmptyState from "../common/EmptyState";

export default function NotificationList({
  loading,
  error,
  notifications = [],
  onRetry,
  onMarkAsRead,
  onViewDetails,
  onDelete,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedNotif, setSelectedNotif] = useState(null);

  const handleOpenMenu = (e, notif) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
    setSelectedNotif(notif);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedNotif(null);
  };

  const getCategoryIcon = (category, title = "") => {
    const cat = (category || title).toLowerCase();
    if (cat.includes("task") || cat.includes("assignment") || cat.includes("deliverable")) {
      return { icon: <AssignmentIcon fontSize="small" />, bg: "#eff6ff", color: "#1e40af", label: "Task" };
    }
    if (cat.includes("project") || cat.includes("team")) {
      return { icon: <FolderIcon fontSize="small" />, bg: "#f0f9ff", color: "#0369a1", label: "Project" };
    }
    if (cat.includes("attendance") || cat.includes("session")) {
      return { icon: <EventAvailableIcon fontSize="small" />, bg: "#f0fdf4", color: "#16a34a", label: "Attendance" };
    }
    if (cat.includes("announcement") || cat.includes("broadcast") || cat.includes("system")) {
      return { icon: <CampaignIcon fontSize="small" />, bg: "#fdf4ff", color: "#9333ea", label: "Announcement" };
    }
    return { icon: <NotificationsIcon fontSize="small" />, bg: "#f8fafc", color: "#475569", label: "Alert" };
  };

  const formatRelativeTime = (timestamp) => {
    if (!timestamp) return "Just now";
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  if (error) {
    return (
      <Paper elevation={0} sx={{ p: 3, border: "1px solid #fee2e2", borderRadius: 2.5, bgcolor: "#fff5f5" }}>
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={onRetry} sx={{ fontWeight: 700 }}>
              Try Again
            </Button>
          }
        >
          {error || "Unable to load notifications. Please try again."}
        </Alert>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        border: "1px solid #e2e8f0",
        borderRadius: 2.5,
        bgcolor: "#ffffff",
        overflow: "hidden",
      }}
    >
      {loading ? (
        <Box sx={{ p: 2 }}>
          {Array.from({ length: 4 }).map((_, idx) => (
            <Stack key={idx} direction="row" spacing={2} alignItems="center" sx={{ py: 2, borderBottom: "1px solid #f1f5f9" }}>
              <Skeleton variant="circular" width={42} height={42} />
              <Box sx={{ flexGrow: 1 }}>
                <Skeleton width="40%" height={20} />
                <Skeleton width="75%" height={16} />
              </Box>
              <Skeleton width={60} height={20} />
            </Stack>
          ))}
        </Box>
      ) : notifications.length === 0 ? (
        <Box sx={{ py: 6, textAlign: "center" }}>
          <EmptyState
            title="No Notifications"
            description="You're all caught up! No notifications or announcements match your criteria."
            icon={HourglassTopIcon}
          />
        </Box>
      ) : (
        <List disablePadding>
          {notifications.map((item, index) => {
            const isRead = item.isRead || item.read;
            const itemId = item._id || item.id || index;
            const meta = getCategoryIcon(item.type || item.category, item.title);
            const timeStr = formatRelativeTime(item.createdAt || item.date);

            return (
              <ListItem
                key={itemId}
                sx={{
                  py: 2,
                  px: { xs: 2, sm: 3 },
                  bgcolor: isRead ? "#ffffff" : "#f0f9ff",
                  borderBottom: "1px solid #e2e8f0",
                  transition: "background-color 0.2s ease",
                  cursor: "pointer",
                  "&:hover": {
                    bgcolor: isRead ? "#f8fafc" : "#e0f2fe",
                  },
                  "&:last-child": {
                    borderBottom: 0,
                  },
                }}
                onClick={() => onViewDetails(item)}
              >
                <ListItemAvatar sx={{ minWidth: 48 }}>
                  <Avatar sx={{ bgcolor: meta.bg, color: meta.color, width: 40, height: 40, borderRadius: 2 }}>
                    {meta.icon}
                  </Avatar>
                </ListItemAvatar>

                <ListItemText
                  primary={
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                      {!isRead && (
                        <Box
                          component="span"
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            bgcolor: "#0284c7",
                            display: "inline-block",
                          }}
                        />
                      )}
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: isRead ? 600 : 800,
                          color: isRead ? "#334155" : "#0f172a",
                          fontSize: "0.925rem",
                        }}
                      >
                        {item.title}
                      </Typography>

                      <Chip
                        label={meta.label}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          fontSize: "0.65rem",
                          bgcolor: meta.bg,
                          color: meta.color,
                          height: 20,
                          borderRadius: 1,
                          ml: 1,
                        }}
                      />
                    </Stack>
                  }
                  secondary={
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        lineHeight: 1.4,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {item.message || item.body || item.description}
                    </Typography>
                  }
                />

                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ ml: 2, flexShrink: 0 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    {timeStr}
                  </Typography>

                  <IconButton
                    aria-label={`Notification actions for ${item.title}`}
                    size="small"
                    onClick={(e) => handleOpenMenu(e, item)}
                    sx={{ color: "text.secondary", "&:hover": { bgcolor: "rgba(0,0,0,0.04)" } }}
                  >
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </ListItem>
            );
          })}
        </List>
      )}

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        PaperProps={{
          elevation: 2,
          sx: { minWidth: 170, borderRadius: 2, border: "1px solid #e2e8f0", py: 0.5 },
        }}
      >
        <MenuItem
          onClick={() => {
            const item = selectedNotif;
            handleCloseMenu();
            if (item && onViewDetails) onViewDetails(item);
          }}
        >
          <ListItemIcon>
            <VisibilityIcon fontSize="small" color="action" />
          </ListItemIcon>
          <Typography variant="body2" fontWeight={600}>
            View Details
          </Typography>
        </MenuItem>

        {selectedNotif && !(selectedNotif.isRead || selectedNotif.read) && (
          <MenuItem
            onClick={() => {
              const item = selectedNotif;
              handleCloseMenu();
              if (item && onMarkAsRead) onMarkAsRead(item._id || item.id);
            }}
          >
            <ListItemIcon>
              <MarkEmailReadIcon fontSize="small" color="primary" />
            </ListItemIcon>
            <Typography variant="body2" fontWeight={600} color="primary.main">
              Mark as Read
            </Typography>
          </MenuItem>
        )}

        {selectedNotif && onDelete && (
          <MenuItem
            onClick={() => {
              const item = selectedNotif;
              handleCloseMenu();
              if (item && onDelete) onDelete(item._id || item.id);
            }}
          >
            <ListItemIcon>
              <DeleteIcon fontSize="small" color="error" />
            </ListItemIcon>
            <Typography variant="body2" fontWeight={600} color="error.main">
              Delete
            </Typography>
          </MenuItem>
        )}
      </Menu>
    </Paper>
  );
}
