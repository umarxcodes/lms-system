import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
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
  Tooltip,
  Chip,
} from "@mui/material";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { notificationApi } from "../../services/notificationApi";

export default function Header({ onMobileNavOpen }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [notifAnchorEl, setNotifAnchorEl] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);

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
      } catch {
        // Silently ignore notification errors
      }
    };
    fetchNotifications();
    return () => { isMounted = false; };
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
    } catch {
      // Silently ignore
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setUnreadCount(0);
      setNotifications([]);
      setNotifAnchorEl(null);
    } catch {
      // Silently ignore
    }
  };

  const handleLogout = () => {
    setProfileAnchorEl(null);
    logout();
    navigate("/login");
  };

  const isProfileOpen = Boolean(profileAnchorEl);
  const isNotifOpen = Boolean(notifAnchorEl);

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";
  const userRoleLabel = user?.role === "ADMIN" ? "Admin" : "Student";

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        color: "text.primary",
        borderBottom: "1px solid",
        borderColor: "rgba(226,232,240,0.8)",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar
        sx={{
          minHeight: { xs: 60, md: 64 },
          px: { xs: 2, md: 3 },
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        {/* ─── Left: Mobile toggle + Brand ─── */}
        <Stack direction="row" alignItems="center" spacing={2}>
          {/* Mobile Drawer Toggle */}
          <IconButton
            onClick={onMobileNavOpen}
            edge="start"
            size="small"
            sx={{
              display: { xs: "flex", md: "none" },
              color: "text.secondary",
              width: 36,
              height: 36,
              "&:hover": { bgcolor: "grey.100", color: "text.primary" },
            }}
            aria-label="Open navigation"
          >
            <MenuIcon sx={{ fontSize: 20 }} />
          </IconButton>

          {/* Brand */}
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ cursor: "default", userSelect: "none" }}>
            <Box
              component="img"
              src="https://res.cloudinary.com/dlul8f6xz/image/upload/v1786599373/logo.6lrMPvRL_phqqyj.png"
              alt="SMIT Logo"
              sx={{
                height: 32,
                width: "auto",
                objectFit: "contain",
                filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.08))",
              }}
            />
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <Typography
                component="span"
                sx={{
                  fontSize: "0.95rem",
                  fontWeight: 800,
                  color: "text.primary",
                  letterSpacing: "-0.025em",
                  lineHeight: 1,
                  display: "block",
                }}
              >
                SMIT LMS
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "text.disabled", fontWeight: 600, fontSize: "0.67rem", letterSpacing: "0.02em" }}
              >
                Saylani Mass I.T. Training
              </Typography>
            </Box>
          </Stack>
        </Stack>

        {/* ─── Right: Notifications + Profile ─── */}
        <Stack direction="row" alignItems="center" spacing={1}>
          {/* Notification Button */}
          <Tooltip title="Notifications" arrow>
            <IconButton
              onClick={handleOpenNotif}
              size="small"
              sx={{
                width: 36,
                height: 36,
                color: "text.secondary",
                transition: "all 0.18s ease",
                "&:hover": { bgcolor: "grey.100", color: "text.primary" },
                "&:active": { transform: "scale(0.93)" },
              }}
              aria-label="Notifications"
            >
              <Badge
                badgeContent={unreadCount > 0 ? unreadCount : null}
                color="error"
                sx={{
                  "& .MuiBadge-badge": {
                    fontSize: "0.6rem",
                    height: 16,
                    minWidth: 16,
                    fontWeight: 800,
                  },
                }}
              >
                <NotificationsNoneOutlinedIcon sx={{ fontSize: 20 }} />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Divider */}
          <Box sx={{ width: 1, height: 22, bgcolor: "divider", mx: 0.5 }} />

          {/* Profile Pill */}
          <Tooltip title="Account settings" arrow>
            <Box
              onClick={(e) => setProfileAnchorEl(e.currentTarget)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: 1,
                py: 0.5,
                borderRadius: 2.5,
                cursor: "pointer",
                border: "1px solid transparent",
                transition: "all 0.18s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  bgcolor: "grey.100",
                  borderColor: "divider",
                },
                "&:active": { transform: "scale(0.98)" },
              }}
              role="button"
              aria-label="Open user menu"
            >
              <Avatar
                src={user?.avatarUrl || user?.profileImage || ""}
                alt={user?.name || "User"}
                sx={{
                  width: 30,
                  height: 30,
                  fontSize: "0.8rem",
                  fontWeight: 800,
                  bgcolor: "primary.main",
                  boxShadow: "0 0 0 2px #ffffff, 0 0 0 3px #dbeafe",
                }}
              >
                {userInitial}
              </Avatar>

              <Box sx={{ display: { xs: "none", sm: "block" }, lineHeight: 1.2 }}>
                <Typography
                  sx={{ fontWeight: 700, fontSize: "0.8rem", color: "text.primary", lineHeight: 1.3 }}
                  noWrap
                >
                  {user?.name || "User"}
                </Typography>
                <Typography
                  sx={{ fontSize: "0.68rem", color: "text.disabled", fontWeight: 600, lineHeight: 1 }}
                >
                  {userRoleLabel}
                </Typography>
              </Box>

              <KeyboardArrowDownIcon
                sx={{
                  fontSize: 16,
                  color: "text.disabled",
                  display: { xs: "none", sm: "block" },
                  transition: "transform 0.18s ease",
                  transform: isProfileOpen ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            </Box>
          </Tooltip>
        </Stack>
      </Toolbar>

      {/* ─── Notifications Popover ─── */}
      <Popover
        open={isNotifOpen}
        anchorEl={notifAnchorEl}
        onClose={() => setNotifAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          elevation: 0,
          sx: {
            width: 360,
            borderRadius: 3,
            mt: 1.5,
            border: "1px solid",
            borderColor: "divider",
            boxShadow: "0 12px 40px rgba(15,23,42,0.10), 0 2px 8px rgba(15,23,42,0.04)",
            overflow: "hidden",
          },
        }}
      >
        {/* Popover Header */}
        <Box sx={{ px: 2.5, py: 2, borderBottom: "1px solid", borderColor: "divider", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Stack direction="row" spacing={1.25} alignItems="center">
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "text.primary", fontSize: "0.9rem" }}>
              Notifications
            </Typography>
            {unreadCount > 0 && (
              <Chip
                label={unreadCount}
                size="small"
                sx={{ height: 20, fontSize: "0.68rem", fontWeight: 800, bgcolor: "error.main", color: "#fff", borderRadius: "10px", "& .MuiChip-label": { px: "6px" } }}
              />
            )}
          </Stack>
          {notifications.length > 0 && (
            <Button
              size="small"
              startIcon={<MarkEmailReadIcon sx={{ fontSize: 14 }} />}
              onClick={handleMarkAllRead}
              sx={{ fontWeight: 700, fontSize: "0.75rem", textTransform: "none", color: "primary.main" }}
            >
              Mark all read
            </Button>
          )}
        </Box>

        {/* Popover Body */}
        {notifications.length === 0 ? (
          <Box sx={{ py: 5, textAlign: "center" }}>
            <Box sx={{ width: 44, height: 44, borderRadius: "50%", bgcolor: "grey.100", color: "grey.400", display: "grid", placeItems: "center", mx: "auto", mb: 1.5 }}>
              <NotificationsNoneOutlinedIcon sx={{ fontSize: 22 }} />
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 700, color: "text.primary" }}>
              You're all caught up
            </Typography>
            <Typography variant="caption" sx={{ color: "text.disabled" }}>
              No unread notifications right now.
            </Typography>
          </Box>
        ) : (
          <List disablePadding sx={{ maxHeight: 300, overflowY: "auto" }}>
            {notifications.map((n, idx) => (
              <ListItem
                key={n._id || n.id}
                disableGutters
                sx={{
                  px: 2.5,
                  py: 1.5,
                  borderBottom: idx < notifications.length - 1 ? "1px solid" : "none",
                  borderColor: "grey.100",
                  "&:hover": { bgcolor: "grey.50" },
                  transition: "background 0.15s ease",
                  alignItems: "flex-start",
                  gap: 1.5,
                }}
              >
                <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "primary.main", mt: "6px", flexShrink: 0 }} />
                <ListItemText
                  primary={n.title}
                  secondary={n.message}
                  primaryTypographyProps={{ fontWeight: 700, fontSize: "0.825rem", color: "text.primary" }}
                  secondaryTypographyProps={{ fontSize: "0.775rem", color: "text.secondary", mt: 0.25 }}
                />
              </ListItem>
            ))}
          </List>
        )}

        {/* Popover Footer */}
        <Box sx={{ borderTop: "1px solid", borderColor: "divider", p: 1.5 }}>
          <Button
            fullWidth
            size="small"
            onClick={() => {
              setNotifAnchorEl(null);
              navigate(user?.role === "ADMIN" ? "/admin/notifications" : "/student/notifications");
            }}
            sx={{ fontWeight: 700, textTransform: "none", color: "primary.main", borderRadius: 2, "&:hover": { bgcolor: "primary.50" } }}
          >
            View all notifications
          </Button>
        </Box>
      </Popover>

      {/* ─── Profile Dropdown Menu ─── */}
      <Menu
        anchorEl={profileAnchorEl}
        open={isProfileOpen}
        onClose={() => setProfileAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          elevation: 0,
          sx: {
            width: 240,
            borderRadius: 3,
            mt: 1.5,
            border: "1px solid",
            borderColor: "divider",
            boxShadow: "0 12px 40px rgba(15,23,42,0.10), 0 2px 8px rgba(15,23,42,0.04)",
            overflow: "hidden",
          },
        }}
      >
        {/* User info header */}
        <Box sx={{ px: 2.5, py: 2, borderBottom: "1px solid", borderColor: "grey.100" }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar
              src={user?.avatarUrl || user?.profileImage || ""}
              sx={{ width: 38, height: 38, bgcolor: "primary.main", fontWeight: 800, fontSize: "0.9rem", boxShadow: "0 0 0 2px #fff, 0 0 0 3px #dbeafe" }}
            >
              {userInitial}
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, color: "text.primary" }} noWrap>
                {user?.name || "User"}
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }} noWrap>
                {user?.email}
              </Typography>
              <Chip
                label={userRoleLabel}
                size="small"
                sx={{ mt: 0.5, height: 18, fontSize: "0.65rem", fontWeight: 800, bgcolor: "primary.50", color: "primary.dark", borderRadius: "6px", "& .MuiChip-label": { px: "6px" } }}
              />
            </Box>
          </Stack>
        </Box>

        {/* Menu items */}
        <Box sx={{ p: 0.75 }}>
          <MenuItem
            onClick={() => {
              setProfileAnchorEl(null);
              navigate(user?.role === "ADMIN" ? "/admin/settings" : "/student/profile");
            }}
            sx={{ borderRadius: 2, px: 1.5, py: 1, transition: "all 0.15s ease" }}
          >
            <ListItemIcon sx={{ minWidth: 32 }}>
              <PersonOutlinedIcon sx={{ fontSize: 18, color: "text.secondary" }} />
            </ListItemIcon>
            <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary" }}>
              Profile & Settings
            </Typography>
          </MenuItem>

          <Divider sx={{ my: 0.75 }} />

          <MenuItem
            onClick={handleLogout}
            sx={{ borderRadius: 2, px: 1.5, py: 1, transition: "all 0.15s ease", "&:hover": { bgcolor: "error.50" } }}
          >
            <ListItemIcon sx={{ minWidth: 32 }}>
              <LogoutRoundedIcon sx={{ fontSize: 18, color: "error.main" }} />
            </ListItemIcon>
            <Typography variant="body2" sx={{ fontWeight: 600, color: "error.main" }}>
              Sign out
            </Typography>
          </MenuItem>
        </Box>
      </Menu>
    </AppBar>
  );
}
