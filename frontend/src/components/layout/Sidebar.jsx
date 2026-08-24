import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Box,
  Stack,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Drawer,
  Divider,
  Avatar,
  IconButton,
  Tooltip,
} from "@mui/material";

import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import FolderOpenRoundedIcon from "@mui/icons-material/FolderOpenRounded";
import ChecklistRtlRoundedIcon from "@mui/icons-material/ChecklistRtlRounded";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import { useAuth } from "../../context/AuthContext";

const SIDEBAR_EXPANDED_WIDTH = 260;
const SIDEBAR_COLLAPSED_WIDTH = 76;

const adminNavItems = [
  { label: "Dashboard", to: "/admin/dashboard", icon: <GridViewRoundedIcon fontSize="small" /> },
  { label: "Students", to: "/admin/students", icon: <PersonOutlineRoundedIcon fontSize="small" /> },
  { label: "Attendance", to: "/admin/attendance", icon: <EventAvailableOutlinedIcon fontSize="small" /> },
  { label: "Teams", to: "/admin/teams", icon: <GroupsRoundedIcon fontSize="small" /> },
  { label: "Projects", to: "/admin/projects", icon: <FolderOpenRoundedIcon fontSize="small" /> },
  { label: "Tasks", to: "/admin/tasks", icon: <ChecklistRtlRoundedIcon fontSize="small" /> },
  { label: "Progress", to: "/admin/progress", icon: <TrendingUpIcon fontSize="small" /> },
  { label: "Reports", to: "/admin/reports", icon: <AssessmentOutlinedIcon fontSize="small" /> },
  { label: "Notifications", to: "/admin/notifications", icon: <NotificationsOutlinedIcon fontSize="small" /> },
  { label: "Settings", to: "/admin/settings", icon: <SettingsOutlinedIcon fontSize="small" /> },
];

const studentNavItems = [
  { label: "Dashboard", to: "/student/dashboard", icon: <GridViewRoundedIcon fontSize="small" /> },
  { label: "Profile", to: "/student/profile", icon: <AccountCircleOutlinedIcon fontSize="small" /> },
  { label: "Attendance", to: "/student/attendance", icon: <EventAvailableOutlinedIcon fontSize="small" /> },
  { label: "My Team", to: "/student/team", icon: <GroupsRoundedIcon fontSize="small" /> },
  { label: "Projects", to: "/student/projects", icon: <FolderOpenRoundedIcon fontSize="small" /> },
  { label: "My Tasks", to: "/student/tasks", icon: <ChecklistRtlRoundedIcon fontSize="small" /> },
  { label: "Progress", to: "/student/progress", icon: <TrendingUpIcon fontSize="small" /> },
  { label: "Reports", to: "/student/reports", icon: <AssessmentOutlinedIcon fontSize="small" /> },
  { label: "Notifications", to: "/student/notifications", icon: <NotificationsOutlinedIcon fontSize="small" /> },
  { label: "Settings", to: "/student/settings", icon: <SettingsOutlinedIcon fontSize="small" /> },
];

export default function Sidebar({ mobileOpen, onMobileClose, isCollapsed = false, onToggleCollapse }) {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = role === "ADMIN" ? adminNavItems : studentNavItems;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const renderSidebarContent = (collapsed) => (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#ffffff",
      }}
    >
      {/* Sidebar Header Section */}
      <Box
        sx={{
          px: collapsed ? 1.5 : 2.5,
          py: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          minHeight: 56,
        }}
      >
        {!collapsed ? (
          <>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 800,
                color: "text.disabled",
                letterSpacing: "0.08em",
                fontSize: "0.7rem",
                textTransform: "uppercase",
              }}
            >
              {role === "ADMIN" ? "ADMIN MENU" : "STUDENT MENU"}
            </Typography>
            {onToggleCollapse && (
              <Tooltip title="Collapse sidebar" placement="right">
                <IconButton
                  onClick={onToggleCollapse}
                  size="small"
                  sx={{
                    color: "grey.500",
                    transition: "all 0.2s ease",
                    "&:hover": { color: "primary.main", bgcolor: "grey.100" },
                  }}
                >
                  <ChevronLeftIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </>
        ) : (
          onToggleCollapse && (
            <Tooltip title="Expand sidebar" placement="right" arrow>
              <IconButton
                onClick={onToggleCollapse}
                size="small"
                sx={{
                  color: "grey.600",
                  bgcolor: "grey.50",
                  border: "1px solid",
                  borderColor: "divider",
                  transition: "all 0.2s ease",
                  "&:hover": { color: "primary.main", bgcolor: "grey.100", transform: "scale(1.08)" },
                }}
              >
                <ChevronRightIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )
        )}
      </Box>

      <Divider sx={{ borderColor: "divider" }} />

      {/* Navigation List */}
      <Box
        sx={{
          flex: 1,
          px: collapsed ? 1.2 : 2,
          py: 2,
          overflowY: "auto",
          overflowX: "hidden",
          "&::-webkit-scrollbar": {
            width: "4px",
          },
          "&::-webkit-scrollbar-thumb": {
            bgcolor: "grey.200",
            borderRadius: "4px",
          },
        }}
      >
        <List disablePadding sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
          {navItems.map((item) => {
            const buttonContent = (
              <ListItemButton
                component={NavLink}
                to={item.to}
                onClick={onMobileClose}
                sx={{
                  position: "relative",
                  borderRadius: 2.5,
                  py: 1.1,
                  px: collapsed ? 1.5 : 2,
                  justifyContent: collapsed ? "center" : "flex-start",
                  minHeight: 44,
                  color: "text.secondary",
                  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:active": {
                    transform: "scale(0.97)",
                  },
                  "&.active": {
                    bgcolor: "#EFF6FF",
                    color: "#2563EB !important",
                    fontWeight: 700,
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      left: 0,
                      top: 6,
                      bottom: 6,
                      width: 4,
                      borderRadius: "0 4px 4px 0",
                      bgcolor: "#2563EB",
                    },
                    "& .MuiTypography-root": {
                      color: "#2563EB !important",
                      fontWeight: 700,
                    },
                    "& .MuiListItemText-primary": {
                      color: "#2563EB !important",
                      fontWeight: 700,
                    },
                    "& .MuiListItemIcon-root": {
                      color: "#2563EB !important",
                      transform: "scale(1.08)",
                    },
                    "&:hover": {
                      bgcolor: "#DBEAFE",
                      color: "#1D4ED8 !important",
                    },
                  },
                  "&:not(.active):hover": {
                    bgcolor: "#F8FAFC",
                    color: "#2563EB",
                    transform: collapsed ? "scale(1.05)" : "translateX(2px)",
                    "& .MuiListItemIcon-root": {
                      color: "#2563EB",
                      transform: "scale(1.08)",
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: collapsed ? "auto" : 34,
                    justifyContent: "center",
                    color: "inherit",
                    transition: "transform 0.2s ease, color 0.2s ease",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {!collapsed && (
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: 13.5,
                      fontWeight: "inherit",
                      color: "inherit",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  />
                )}
              </ListItemButton>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.to} title={item.label} placement="right" arrow>
                  <ListItem disablePadding sx={{ display: "block" }}>
                    {buttonContent}
                  </ListItem>
                </Tooltip>
              );
            }

            return (
              <ListItem key={item.to} disablePadding sx={{ display: "block" }}>
                {buttonContent}
              </ListItem>
            );
          })}
        </List>
      </Box>

      <Divider sx={{ borderColor: "divider" }} />

      {/* User Summary & Logout */}
      <Box sx={{ p: collapsed ? 1.5 : 2 }}>
        {!collapsed ? (
          <>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ px: 1.5, py: 1, mb: 1.5 }}>
              <Avatar
                src={user?.avatarUrl || user?.profileImage || ""}
                alt={user?.name || "User"}
                sx={{ width: 36, height: 36, bgcolor: "primary.main", fontSize: 15, fontWeight: 700 }}
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </Avatar>
              <Box sx={{ overflow: "hidden", lineHeight: 1.2 }}>
                <Typography variant="body2" sx={{ fontWeight: 700, color: "text.primary", noWrap: true }}>
                  {user?.name || "Logged User"}
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.72rem" }}>
                  {role || "User"} Account
                </Typography>
              </Box>
            </Stack>

            <ListItemButton
              onClick={handleLogout}
              sx={{
                borderRadius: 2.5,
                py: 1,
                px: 2,
                color: "error.main",
                transition: "all 0.2s ease-in-out",
                "&:hover": { bgcolor: "error.50", transform: "translateX(4px)" },
              }}
            >
              <ListItemIcon sx={{ minWidth: 34, color: "error.main" }}>
                <LogoutRoundedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Logout" primaryTypographyProps={{ fontSize: 13.5, fontWeight: 700 }} />
            </ListItemButton>
          </>
        ) : (
          <Stack spacing={1.5} alignItems="center">
            <Tooltip title={`${user?.name || "User"} (${role || "Account"})`} placement="right" arrow>
              <Avatar
                src={user?.avatarUrl || user?.profileImage || ""}
                alt={user?.name || "User"}
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: "primary.main",
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "transform 0.2s ease",
                  "&:hover": { transform: "scale(1.08)" },
                }}
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </Avatar>
            </Tooltip>

            <Tooltip title="Logout" placement="right" arrow>
              <IconButton
                onClick={handleLogout}
                sx={{
                  color: "error.main",
                  bgcolor: "error.50",
                  width: 40,
                  height: 40,
                  transition: "all 0.2s ease",
                  "&:hover": { bgcolor: "#FEE2E2", transform: "scale(1.08)" },
                }}
              >
                <LogoutRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        )}
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile Temporary Drawer (Always rendered full width for usability) */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: SIDEBAR_EXPANDED_WIDTH },
        }}
      >
        {renderSidebarContent(false)}
      </Drawer>

      {/* Desktop Permanent Sidebar (Supports expanded 260px and mini 76px mode) */}
      <Box
        component="aside"
        sx={{
          width: isCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_EXPANDED_WIDTH,
          flexShrink: 0,
          display: { xs: "none", md: "block" },
          height: "100%",
          borderRight: "1px solid",
          borderColor: "divider",
          boxShadow: "4px 0 20px rgba(0, 0, 0, 0.02)",
          transition: "width 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          overflow: "hidden",
        }}
      >
        {renderSidebarContent(isCollapsed)}
      </Box>
    </>
  );
}
