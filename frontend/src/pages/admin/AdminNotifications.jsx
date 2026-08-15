import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  TextField,
  Box,
  CircularProgress,
  Divider,
} from "@mui/material";
import CampaignIcon from "@mui/icons-material/Campaign";
import SendIcon from "@mui/icons-material/Send";

import PageHeader from "../../components/common/PageHeader";
import { PageContent } from "../../components/layout/AppLayout";
import { notificationApi } from "../../services/notificationApi";
import { studentApi } from "../../services/studentApi";
import { useToast } from "../../context/ToastContext";

import NotificationSummaryCards from "../../components/notifications/NotificationSummaryCards";
import NotificationFilters from "../../components/notifications/NotificationFilters";
import NotificationList from "../../components/notifications/NotificationList";
import NotificationDetailsDialog from "../../components/notifications/NotificationDetailsDialog";
import DeleteNotificationDialog from "../../components/notifications/DeleteNotificationDialog";

export default function AdminNotifications() {
  // Broadcast Announcement State
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [students, setStudents] = useState([]);
  const [sendLoading, setSendLoading] = useState(false);

  // Notification List State
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters State
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Dialog States
  const [selectedNotif, setSelectedNotif] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { showToast } = useToast();

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await notificationApi.getMyNotifications();
      if (res.success && res.data) {
        setNotifications(Array.isArray(res.data) ? res.data : []);
      }
    } catch (err) {
      setError(err?.message || "Failed to load notifications.");
      showToast(err?.message || "Failed to load notifications", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // Fetch active students for announcement distribution
  useEffect(() => {
    fetchNotifications();
    studentApi
      .getStudents({ limit: 500 })
      .then((res) => {
        if (res.success && res.data) {
          const list = Array.isArray(res.data) ? res.data : res.data.students || [];
          setStudents(list);
        }
      })
      .catch(() => {});
  }, [fetchNotifications]);

  // Submit Broadcast Announcement
  const handleAnnouncementSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    const recipientIds = students
      .map((s) => s.user?._id || s.user || s._id)
      .filter(Boolean);

    if (recipientIds.length === 0) {
      showToast("No active students found to receive announcements.", "warning");
      return;
    }

    setSendLoading(true);
    try {
      await notificationApi.createAnnouncement({
        recipientIds,
        title: title.trim(),
        message: message.trim(),
      });
      showToast("Announcement broadcast successfully to all students!", "success");
      setTitle("");
      setMessage("");
      fetchNotifications();
    } catch (err) {
      showToast(err?.message || "Failed to send announcement", "error");
    } finally {
      setSendLoading(false);
    }
  };

  // Mark single read
  const handleMarkAsRead = async (id) => {
    try {
      await notificationApi.markAsRead(id);
      showToast("Notification marked as read", "success");
      fetchNotifications();
    } catch (err) {
      showToast(err?.message || "Failed to mark notification as read", "error");
    }
  };

  // Mark all read
  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      showToast("All notifications marked as read!", "success");
      fetchNotifications();
    } catch (err) {
      showToast(err?.message || "Failed to update notifications", "error");
    }
  };

  // Delete notification
  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      await notificationApi.deleteNotification(deleteId);
      showToast("Notification deleted successfully!", "info");
      setDeleteId(null);
      fetchNotifications();
    } catch (err) {
      showToast(err?.message || "Failed to delete notification", "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Filtered Notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      const isRead = n.isRead || n.read;
      if (statusFilter === "unread" && isRead) return false;
      if (statusFilter === "read" && !isRead) return false;

      if (typeFilter !== "all") {
        const cat = (n.type || n.category || n.title || "").toLowerCase();
        if (typeFilter === "task" && !cat.includes("task") && !cat.includes("assignment")) return false;
        if (typeFilter === "project" && !cat.includes("project") && !cat.includes("team")) return false;
        if (typeFilter === "attendance" && !cat.includes("attendance")) return false;
        if (typeFilter === "system" && !cat.includes("announcement") && !cat.includes("broadcast") && !cat.includes("system")) return false;
      }

      if (search.trim()) {
        const q = search.toLowerCase();
        const t = (n.title || "").toLowerCase();
        const m = (n.message || n.body || "").toLowerCase();
        if (!t.includes(q) && !m.includes(q)) return false;
      }

      return true;
    });
  }, [notifications, statusFilter, typeFilter, search]);

  // Counts
  const unreadCount = useMemo(() => notifications.filter((n) => !(n.isRead || n.read)).length, [notifications]);
  const announcementCount = useMemo(
    () =>
      notifications.filter((n) => {
        const cat = (n.type || n.category || n.title || "").toLowerCase();
        return cat.includes("announcement") || cat.includes("broadcast") || cat.includes("system");
      }).length,
    [notifications]
  );

  return (
    <PageContent px={{ xs: 2, sm: 3, md: 4 }}>
      {/* Page Header */}
      <PageHeader
        breadcrumbs={[{ label: "Dashboard", to: "/admin/dashboard" }, { label: "Notifications" }]}
        title="Notifications & Broadcasts"
        description="Broadcast system announcements to students and review administrative alerts."
        actions={
          unreadCount > 0 && (
            <Button variant="outlined" color="primary" onClick={handleMarkAllRead} sx={{ fontWeight: 700, borderRadius: 2 }}>
              Mark All as Read
            </Button>
          )
        }
      />

      <Stack spacing={3} sx={{ width: "100%" }}>
        {/* KPI Cards */}
        <NotificationSummaryCards
          loading={loading}
          totalCount={notifications.length}
          unreadCount={unreadCount}
          announcementCount={announcementCount}
        />

        {/* Global Announcement Creation Panel */}
        <Card
          elevation={0}
          sx={{
            p: { xs: 2.5, sm: 3 },
            bgcolor: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: 2.5,
            width: "100%",
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2.5 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2,
                bgcolor: "#eff6ff",
                color: "#1e40af",
                display: "grid",
                placeItems: "center",
              }}
            >
              <CampaignIcon />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a" }}>
                Create Global Announcement
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Broadcast an official announcement to all enrolled bootcamp students.
              </Typography>
            </Box>
          </Stack>

          <Divider sx={{ mb: 2.5 }} />

          <Box component="form" onSubmit={handleAnnouncementSubmit}>
            <Stack spacing={2}>
              <TextField
                label="Announcement Title"
                fullWidth
                required
                size="small"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Mandatory Live Q&A Session Tomorrow"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />

              <TextField
                label="Announcement Message"
                fullWidth
                required
                multiline
                rows={3}
                size="small"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter detailed broadcast message..."
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />

              <Stack direction="row" justifyContent="flex-end">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={sendLoading}
                  startIcon={sendLoading ? <CircularProgress size={16} color="inherit" /> : <SendIcon />}
                  sx={{ fontWeight: 800, borderRadius: 2, px: 3 }}
                >
                  {sendLoading ? "Broadcasting..." : "Broadcast Announcement"}
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Card>

        {/* Toolbar & Search */}
        <NotificationFilters
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          typeFilter={typeFilter}
          onTypeFilterChange={setTypeFilter}
          onClearFilters={() => {
            setSearch("");
            setStatusFilter("all");
            setTypeFilter("all");
          }}
          onMarkAllAsRead={handleMarkAllRead}
          hasUnread={unreadCount > 0}
        />

        {/* Primary Notification List */}
        <NotificationList
          loading={loading}
          error={error}
          notifications={filteredNotifications}
          onRetry={fetchNotifications}
          onMarkAsRead={handleMarkAsRead}
          onViewDetails={(n) => {
            setSelectedNotif(n);
            setDetailsOpen(true);
            if (!(n.isRead || n.read)) {
              handleMarkAsRead(n._id || n.id);
            }
          }}
          onDelete={(id) => setDeleteId(id)}
        />
      </Stack>

      {/* Details Dialog */}
      <NotificationDetailsDialog
        open={detailsOpen}
        notification={selectedNotif}
        onClose={() => {
          setDetailsOpen(false);
          setSelectedNotif(null);
        }}
        onMarkAsRead={handleMarkAsRead}
      />

      {/* Delete Dialog */}
      <DeleteNotificationDialog
        open={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
      />
    </PageContent>
  );
}
