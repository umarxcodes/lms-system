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
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

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
        py: 2.5,
        bgcolor: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid",
        borderColor: "divider",
        position: "sticky",
        top: 0,
        zIndex: 1100,
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.02)",
        flexShrink: 0,
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
        {/* Left: Mobile Toggle + Logo + Title */}
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <IconButton
            onClick={onMobileNavOpen}
            sx={{
              display: { xs: "flex", md: "none" },
              color: "grey.700",
              bgcolor: "grey.100",
              p: 1,
            }}
            aria-label="open navigation drawer"
          >
            <MenuIcon />
          </IconButton>

          {/* Mobile Logo Indicator */}
          <Box
            component="img"
            src="https://res.cloudinary.com/dlul8f6xz/image/upload/v1786599373/logo.6lrMPvRL_phqqyj.png"
            alt="SMIT Logo"
            sx={{
              display: { xs: "block", md: "none" },
              height: 32,
              width: "auto",
              objectFit: "contain",
            }}
          />

          <Box>
            <Typography
              component="h1"
              sx={{
                fontSize: { xs: 18, md: 22 },
                fontWeight: 800,
                color: "text.primary",
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
              }}
            >
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.25, fontSize: "0.825rem" }}>
                {subtitle}
              </Typography>
            )}
          </Box>
        </Stack>

        {/* Right: Custom Actions, Notifications, & User Profile Pill */}
        <Stack direction="row" alignItems="center" spacing={1.5}>
          {actions}

          {/* Notifications Button */}
          <IconButton
            onClick={handleOpenNotif}
            sx={{
              bgcolor: "grey.50",
              border: "1px solid",
              borderColor: "divider",
              color: "grey.700",
              width: 40,
              height: 40,
              transition: "all 0.2s ease",
              "&:hover": { bgcolor: "grey.100", transform: "scale(1.04)" },
            }}
            aria-label="view notifications"
          >
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsNoneOutlinedIcon fontSize="small" />
            </Badge>
          </IconButton>

          {/* User Profile Pill Button */}
          <Button
            onClick={(e) => setProfileAnchorEl(e.currentTarget)}
            sx={{
              p: 0.5,
              pr: { xs: 0.5, sm: 1.5 },
              bgcolor: "grey.50",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 3,
              color: "text.primary",
              transition: "all 0.2s ease",
              "&:hover": { bgcolor: "grey.100", borderColor: "grey.300" },
            }}
            aria-label="open user profile menu"
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar
                src={user?.avatarUrl || user?.profileImage || ""}
                alt={user?.name || "User"}
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: "primary.main",
                  fontWeight: 800,
                  fontSize: 13,
                  boxShadow: "0 2px 6px rgba(30,64,175,0.2)",
                }}
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </Avatar>

              <Box sx={{ display: { xs: "none", sm: "block" }, textAlign: "left", lineHeight: 1.1 }}>
                <Typography variant="body2" sx={{ fontWeight: 700, fontSize: "0.825rem", color: "text.primary" }}>
                  {user?.name || "Logged User"}
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.7rem", fontWeight: 600 }}>
                  {user?.role || "Account"}
                </Typography>
              </Box>

              <KeyboardArrowDownIcon fontSize="small" sx={{ color: "text.secondary", display: { xs: "none", sm: "block" } }} />
            </Stack>
          </Button>
        </Stack>
      </Stack>

      {/* Notifications Popover */}
      <Popover
        open={isNotifOpen}
        anchorEl={notifAnchorEl}
        onClose={() => setNotifAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{ sx: { width: 340, p: 2, borderRadius: 4, mt: 1 } }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, fontSize: "1rem" }}>
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
          <Typography variant="body2" sx={{ color: "text.secondary", py: 3, textAlign: "center" }}>
            No new unread notifications.
          </Typography>
        ) : (
          <List disablePadding sx={{ maxHeight: 280, overflowY: "auto" }}>
            {notifications.map((n) => (
              <ListItem key={n._id || n.id} divider disableGutters sx={{ py: 1 }}>
                <ListItemText
                  primary={n.title}
                  secondary={n.message}
                  primaryTypographyProps={{ fontWeight: 700, variant: "body2" }}
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
        PaperProps={{ sx: { width: 220, borderRadius: 3, mt: 1, p: 0.5 } }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "text.primary" }}>
            {user?.name || "User"}
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>
            {user?.email}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              display: "inline-block",
              mt: 0.75,
              px: 1.2,
              py: 0.3,
              borderRadius: 1.5,
              bgcolor: "primary.50",
              color: "primary.main",
              fontWeight: 800,
              fontSize: "0.7rem",
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
          sx={{ borderRadius: 2, my: 0.5 }}
        >
          <ListItemIcon>
            <PersonOutlinedIcon fontSize="small" color="action" />
          </ListItemIcon>
          <Typography variant="body2" fontWeight={600}>
            Profile & Settings
          </Typography>
        </MenuItem>

        <MenuItem onClick={handleLogout} sx={{ color: "error.main", borderRadius: 2 }}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" color="error" />
          </ListItemIcon>
          <Typography variant="body2" fontWeight={700}>
            Logout
          </Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
}
