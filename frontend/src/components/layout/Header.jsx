import React, { useState, useEffect } from "react";
import {
  Box,
  Stack,
  Typography,
  Avatar,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  Popover,
  List,
  ListItem,
  ListItemText,
  Button,
} from "@mui/material";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";

import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { notificationApi } from "../../services/notificationApi";

export default function Header({ title, subtitle, actions, onMobileNavOpen }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Profile Menu State
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  // Notification Popover State
  const [notifAnchorEl, setNotifAnchorEl] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);

  // Fetch unread notifications for students
  useEffect(() => {
    let isMounted = true;
    const fetchNotifications = async () => {
      try {
        if (user?.role === "STUDENT") {
          const countRes = await notificationApi.getUnreadCount();
          if (isMounted && countRes.success) {
            setUnreadCount(countRes.data?.count || 0);
          }
        }
      } catch (err) {
        // Silently catch notification errors
      }
    };
    fetchNotifications();
    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleOpenNotif = async (event) => {
    setNotifAnchorEl(event.currentTarget);
    try {
      if (user?.role === "STUDENT") {
        const res = await notificationApi.getUnreadNotifications();
        if (res.success && Array.isArray(res.data)) {
          setNotifications(res.data);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setUnreadCount(0);
      setNotifications([]);
      setNotifAnchorEl(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    setProfileAnchorEl(null);
    logout();
    navigate("/login");
  };

  const isProfileOpen = Boolean(profileAnchorEl);
  const isNotifOpen = Boolean(notifAnchorEl);

  return (
    <Box
      component="header"
      sx={{
        px: { xs: 2.5, md: 4 },
        pt: 3,
        pb: 2,
        bgcolor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider",
        flexShrink: 0,
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
        {/* Left: Mobile Toggle + Title */}
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <IconButton
            onClick={onMobileNavOpen}
            sx={{ display: { xs: "flex", md: "none" }, color: "grey.700" }}
            aria-label="open drawer"
          >
            <MenuIcon />
          </IconButton>
          <Box>
            <Typography
              component="h1"
              sx={{
                fontSize: { xs: 20, md: 24 },
                fontWeight: 700,
                color: "text.primary",
                letterSpacing: "-0.01em",
              }}
            >
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.25 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
        </Stack>

        {/* Right: Actions & User Avatar */}
        <Stack direction="row" alignItems="center" spacing={2}>
          {actions}

          {/* Notifications Button */}
          <IconButton
            onClick={handleOpenNotif}
            sx={{
              bgcolor: "grey.100",
              color: "grey.700",
              "&:hover": { bgcolor: "grey.200" },
            }}
            aria-label="notifications"
          >
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsNoneOutlinedIcon fontSize="small" />
            </Badge>
          </IconButton>

          {/* User Profile Avatar Button */}
          <IconButton
            onClick={(e) => setProfileAnchorEl(e.currentTarget)}
            sx={{ p: 0.5 }}
            aria-label="user profile menu"
          >
            <Avatar
              src={user?.avatarUrl || user?.profileImage || ""}
              alt={user?.name || "User"}
              sx={{ width: 38, height: 38, bgcolor: "primary.main", fontWeight: 700 }}
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </Avatar>
          </IconButton>
        </Stack>
      </Stack>

      {/* Notifications Popover */}
      <Popover
        open={isNotifOpen}
        anchorEl={notifAnchorEl}
        onClose={() => setNotifAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{ sx: { width: 340, p: 2, borderRadius: 3 } }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Notifications
          </Typography>
          {notifications.length > 0 && (
            <Button size="small" startIcon={<MarkEmailReadIcon />} onClick={handleMarkAllRead}>
              Mark all read
            </Button>
          )}
        </Stack>
        <Divider sx={{ mb: 1 }} />
        {notifications.length === 0 ? (
          <Typography variant="body2" sx={{ color: "text.secondary", py: 2, textAlign: "center" }}>
            No new unread notifications.
          </Typography>
        ) : (
          <List disablePadding sx={{ maxHeight: 280, overflowY: "auto" }}>
            {notifications.map((n) => (
              <ListItem key={n._id || n.id} divider disableGutters sx={{ py: 1 }}>
                <ListItemText
                  primary={n.title}
                  secondary={n.message}
                  primaryTypographyProps={{ fontWeight: 600, variant: "body2" }}
                  secondaryTypographyProps={{ variant: "caption" }}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Popover>

      {/* Profile Menu */}
      <Menu
        anchorEl={profileAnchorEl}
        open={isProfileOpen}
        onClose={() => setProfileAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{ sx: { width: 220, borderRadius: 3, mt: 1 } }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "text.primary" }}>
            {user?.name || "User"}
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>
            {user?.email}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              display: "inline-block",
              mt: 0.5,
              px: 1,
              py: 0.2,
              borderRadius: 1,
              bgcolor: "primary.50",
              color: "primary.main",
              fontWeight: 700,
            }}
          >
            {user?.role}
          </Typography>
        </Box>

        <Divider />

        <MenuItem
          onClick={() => {
            setProfileAnchorEl(null);
            navigate(user?.role === "ADMIN" ? "/admin/settings" : "/student/profile");
          }}
        >
          <ListItemIcon>
            <PersonOutlinedIcon fontSize="small" />
          </ListItemIcon>
          Profile & Settings
        </MenuItem>

        <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" color="error" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
}
