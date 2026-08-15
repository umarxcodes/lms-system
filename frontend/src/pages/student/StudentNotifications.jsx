import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Stack, Button } from "@mui/material";

import PageHeader from "../../components/common/PageHeader";
import { PageContent } from "../../components/layout/AppLayout";
import { notificationApi } from "../../services/notificationApi";
import { useToast } from "../../context/ToastContext";

import NotificationSummaryCards from "../../components/notifications/NotificationSummaryCards";
import NotificationFilters from "../../components/notifications/NotificationFilters";
import NotificationList from "../../components/notifications/NotificationList";
import NotificationDetailsDialog from "../../components/notifications/NotificationDetailsDialog";
import DeleteNotificationDialog from "../../components/notifications/DeleteNotificationDialog";

export default function StudentNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filter State
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Dialog State
  const [selectedNotif, setSelectedNotif] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { showToast } = useToast();

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

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      await notificationApi.deleteNotification(deleteId);
      showToast("Notification deleted!", "info");
      setDeleteId(null);
      fetchNotifications();
    } catch (err) {
      showToast(err?.message || "Failed to delete notification", "error");
    } finally {
      setDeleteLoading(false);
    }
  };

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
        breadcrumbs={[{ label: "Dashboard", to: "/student/dashboard" }, { label: "Notifications" }]}
        title="Notifications & Alerts"
        description="Stay updated with important bootcamp activities, deliverables, and official announcements."
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
