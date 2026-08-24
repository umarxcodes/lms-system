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
} from "@mui/material";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { notificationApi } from "../../services/notificationApi";

export default function Header({ onMobileNavOpen, isSidebarCollapsed, onToggleSidebarCollapse }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Notification Popover State
  const [notifAnchorEl, setNotifAnchorEl] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);

  // Profile Menu State
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);

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
    } catch {
      // Silently catch — notification errors must not surface to console
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setUnreadCount(0);
      setNotifications([]);
      setNotifAnchorEl(null);
    } catch {
      // Silently catch — notification errors must not surface to console
    }
  };

  const isProfileOpen = Boolean(profileAnchorEl);
  const isNotifOpen = Boolean(notifAnchorEl);

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "background.paper",
        color: "text.primary",
        borderBottom: "1px solid",
        borderColor: "divider",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar
        sx={{
          minHeight: { xs: 64, md: 70 },
          px: { xs: 2, md: 3 },
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        {/* Left: Mobile Drawer Toggle + Desktop Collapse Button + Brand Logo & Title */}
        <Stack direction="row" alignItems="center" spacing={1.5}>
          {/* Mobile Drawer Toggle */}
          <IconButton
            onClick={onMobileNavOpen}
            edge="start"
            sx={{
              display: { xs: "flex", md: "none" },
              color: "text.primary",
              bgcolor: "grey.100",
              p: 1,
            }}
            aria-label="open navigation drawer"
          >
            <MenuIcon fontSize="small" />
          </IconButton>

          {/* Desktop Sidebar Collapse Toggle */}
          {onToggleSidebarCollapse && (
            <Tooltip title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}>
              <IconButton
                onClick={onToggleSidebarCollapse}
                sx={{
                  display: { xs: "none", md: "flex" },
                  color: "grey.700",
                  bgcolor: "grey.50",
                  border: "1px solid",
                  borderColor: "divider",
                  p: 1,
                  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": { bgcolor: "grey.100", transform: "scale(1.05)" },
                }}
                aria-label="toggle sidebar collapse"
              >
                {isSidebarCollapsed ? <MenuIcon fontSize="small" /> : <MenuOpenIcon fontSize="small" />}
              </IconButton>
            </Tooltip>
          )}

          {/* SMIT Brand Logo & Title */}
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Box
              component="img"
              src="https://res.cloudinary.com/dlul8f6xz/image/upload/v1786599373/logo.6lrMPvRL_phqqyj.png"
              alt="SMIT Logo"
              sx={{
                height: 38,
                width: "auto",
                objectFit: "contain",
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.06))",
                transition: "transform 0.2s ease",
                "&:hover": { transform: "scale(1.02)" },
              }}
            />
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <Typography
                component="h1"
                sx={{
                  fontSize: { xs: 16, md: 18 },
                  fontWeight: 800,
                  color: "text.primary",
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                }}
              >
                SMIT LMS
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, fontSize: "0.72rem" }}>
                Saylani Mass I.T. Training
              </Typography>
            </Box>
          </Stack>
        </Stack>

        {/* Right: Notifications & User Profile Menu */}
        <Stack direction="row" alignItems="center" spacing={1.5}>
          {/* Notifications Button */}
          <Tooltip title="Notifications">
            <IconButton
              onClick={handleOpenNotif}
              sx={{
                bgcolor: "grey.50",
                border: "1px solid",
                borderColor: "divider",
                color: "grey.700",
                width: 40,
                height: 40,
                transition: "all 0.18s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": { bgcolor: "grey.100", transform: "scale(1.06)" },
                "&:active": { transform: "scale(0.95)" },
              }}
              aria-label="open notifications"
            >
              {unreadCount > 0 ? (
                <Badge
                  badgeContent={unreadCount}
                  color="error"
                  sx={{
                    "& .MuiBadge-badge": {
                      animation: "badgePop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                      "@keyframes badgePop": {
                        "0%": { transform: "scale(0)" },
                        "100%": { transform: "scale(1)" },
                      },
                    },
                  }}
                >
                  <NotificationsNoneOutlinedIcon fontSize="small" />
                </Badge>
              ) : (
                <NotificationsNoneOutlinedIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>

          {/* User Profile Pill Button */}
          <Tooltip title="User Profile & Settings">
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
                transition: "all 0.18s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": { bgcolor: "grey.100", borderColor: "grey.300", transform: "translateY(-1px)" },
                "&:active": { transform: "scale(0.98)" },
              }}
              aria-label="open user profile menu"
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <Avatar
                  src={user?.avatarUrl || user?.profileImage || ""}
                  alt={user?.name || "User"}
                  sx={{
                    width: 34,
                    height: 34,
                    bgcolor: "primary.main",
                    fontWeight: 800,
                    fontSize: 14,
                    boxShadow: "0 2px 6px rgba(30,64,175,0.2)",
                  }}
                >
                  {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                </Avatar>

                <Box sx={{ display: { xs: "none", sm: "block" }, textAlign: "left", lineHeight: 1.15, maxWidth: 140 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 700,
                      fontSize: "0.825rem",
                      color: "text.primary",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {user?.name || "User Account"}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.02em" }}>
                    {user?.role || "ACCOUNT"}
                  </Typography>
                </Box>

                <KeyboardArrowDownIcon
                  fontSize="small"
                  sx={{
                    color: "text.secondary",
                    display: { xs: "none", sm: "block" },
                    transition: "transform 0.18s ease",
                    transform: isProfileOpen ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                />
              </Stack>
            </Button>
          </Tooltip>
        </Stack>
      </Toolbar>

      {/* Notifications Popover */}
      <Popover
        open={isNotifOpen}
        anchorEl={notifAnchorEl}
        onClose={() => setNotifAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            width: 340,
            p: 2,
            borderRadius: 4,
            mt: 1,
            boxShadow: "0 10px 28px rgba(15, 23, 42, 0.1)",
            border: "1px solid #e2e8f0",
            animation: "menuEntrance 180ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
            willChange: "opacity, transform",
            "@keyframes menuEntrance": {
              "0%": { opacity: 0, transform: "translateY(-4px) scale(0.98)" },
              "100%": { opacity: 1, transform: "translateY(0) scale(1)" },
            },
          },
        }}
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
            No unread notifications.
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
        <Divider sx={{ my: 1 }} />
        <Button
          fullWidth
          size="small"
          onClick={() => {
            setNotifAnchorEl(null);
            navigate(user?.role === "ADMIN" ? "/admin/notifications" : "/student/notifications");
          }}
          sx={{ fontWeight: 800, textTransform: "none", color: "primary.main" }}
        >
          View all notifications →
        </Button>
      </Popover>

      {/* User Profile Menu */}
      <Menu
        anchorEl={profileAnchorEl}
        open={isProfileOpen}
        onClose={() => setProfileAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            width: 230,
            borderRadius: 3,
            mt: 1,
            p: 0.5,
            boxShadow: "0 10px 28px rgba(15, 23, 42, 0.1)",
            border: "1px solid #e2e8f0",
            animation: "menuEntrance 180ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
            willChange: "opacity, transform",
            "@keyframes menuEntrance": {
              "0%": { opacity: 0, transform: "translateY(-4px) scale(0.98)" },
              "100%": { opacity: 1, transform: "translateY(0) scale(1)" },
            },
          },
        }}
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
          sx={{ borderRadius: 2, my: 0.5, transition: "all 0.15s ease" }}
        >
          <ListItemIcon>
            <PersonOutlinedIcon fontSize="small" color="action" />
          </ListItemIcon>
          <Typography variant="body2" fontWeight={600}>
            Profile & Settings
          </Typography>
        </MenuItem>
      </Menu>
    </AppBar>
  );
}
