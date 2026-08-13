import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  Typography,
  Button,
  Stack,
  CircularProgress,
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Tooltip,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import DeleteIcon from "@mui/icons-material/Delete";
import { useOutletContext } from "react-router-dom";

import PageHeader from "../../components/common/PageHeader";
import { PageContent } from "../../components/layout/AppLayout";
import EmptyState from "../../components/common/EmptyState";
import { notificationApi } from "../../services/notificationApi";
import { useToast } from "../../context/ToastContext";

export default function StudentNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const { onMobileNavOpen } = useOutletContext() || {};

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const res = await notificationApi.getMyNotifications();
      if (res.success && res.data) {
        setNotifications(Array.isArray(res.data) ? res.data : []);
      }
    } catch (err) {
      showToast(err?.message || "Failed to load notifications", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationApi.markAsRead(id);
      showToast("Notification marked as read!", "success");
      fetchNotifications();
    } catch (err) {
      showToast(err?.message || "Failed to update notification", "error");
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      showToast("All notifications marked as read!", "success");
      fetchNotifications();
    } catch (err) {
      showToast(err?.message || "Failed to update notifications", "error");
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationApi.deleteNotification(id);
      showToast("Notification deleted!", "info");
      fetchNotifications();
    } catch (err) {
      showToast(err?.message || "Failed to delete notification", "error");
    }
  };

  return (
    <PageContent>
      <PageHeader
        title="Notifications & Announcements"
        description="System alerts, project updates, and bootcamp announcements."
        actions={
          notifications.length > 0 && (
            <Button startIcon={<MarkEmailReadIcon />} onClick={handleMarkAllRead}>
              Mark All Read
            </Button>
          )
        }
      />
        <Card sx={{ p: 3, maxWidth: 800 }}>
          {loading ? (
            <Box sx={{ py: 6, textAlign: "center" }}>
              <CircularProgress color="primary" />
            </Box>
          ) : notifications.length === 0 ? (
            <EmptyState
              title="No notifications"
              description="You have no unread or archived notifications at this time."
              icon={NotificationsIcon}
            />
          ) : (
            <List disablePadding>
              {notifications.map((n) => {
                const isRead = n.isRead || n.read;
                return (
                  <ListItem
                    key={n._id || n.id}
                    divider
                    sx={{
                      py: 2,
                      bgcolor: isRead ? "transparent" : "primary.50",
                      borderRadius: 1.5,
                      mb: 1,
                    }}
                  >
                    <ListItemText
                      primary={n.title}
                      secondary={n.message}
                      primaryTypographyProps={{ fontWeight: isRead ? 600 : 700, variant: "subtitle1" }}
                      secondaryTypographyProps={{ variant: "body2", color: "text.secondary" }}
                    />
                    <Stack direction="row" spacing={1} sx={{ ml: 2 }}>
                      {!isRead && (
                        <Tooltip title="Mark as Read">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleMarkAsRead(n._id || n.id)}
                          >
                            <CheckCircleOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(n._id || n.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </ListItem>
                );
              })}
            </List>
          )}
        </Card>
      </PageContent>
  );
}
