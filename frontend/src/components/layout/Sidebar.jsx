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

const EXPANDED = 256;
const COLLAPSED = 68;

const adminNavItems = [
  { label: "Dashboard", to: "/admin/dashboard", icon: <GridViewRoundedIcon sx={{ fontSize: 18 }} /> },
  { label: "Students", to: "/admin/students", icon: <PersonOutlineRoundedIcon sx={{ fontSize: 18 }} /> },
  { label: "Attendance", to: "/admin/attendance", icon: <EventAvailableOutlinedIcon sx={{ fontSize: 18 }} /> },
  { label: "Teams", to: "/admin/teams", icon: <GroupsRoundedIcon sx={{ fontSize: 18 }} /> },
  { label: "Projects", to: "/admin/projects", icon: <FolderOpenRoundedIcon sx={{ fontSize: 18 }} /> },
  { label: "Tasks", to: "/admin/tasks", icon: <ChecklistRtlRoundedIcon sx={{ fontSize: 18 }} /> },
  { label: "Progress", to: "/admin/progress", icon: <TrendingUpIcon sx={{ fontSize: 18 }} /> },
  { label: "Reports", to: "/admin/reports", icon: <AssessmentOutlinedIcon sx={{ fontSize: 18 }} /> },
  { label: "Notifications", to: "/admin/notifications", icon: <NotificationsOutlinedIcon sx={{ fontSize: 18 }} /> },
  { label: "Settings", to: "/admin/settings", icon: <SettingsOutlinedIcon sx={{ fontSize: 18 }} /> },
];

const studentNavItems = [
  { label: "Dashboard", to: "/student/dashboard", icon: <GridViewRoundedIcon sx={{ fontSize: 18 }} /> },
  { label: "Profile", to: "/student/profile", icon: <AccountCircleOutlinedIcon sx={{ fontSize: 18 }} /> },
  { label: "Attendance", to: "/student/attendance", icon: <EventAvailableOutlinedIcon sx={{ fontSize: 18 }} /> },
  { label: "My Team", to: "/student/team", icon: <GroupsRoundedIcon sx={{ fontSize: 18 }} /> },
  { label: "Projects", to: "/student/projects", icon: <FolderOpenRoundedIcon sx={{ fontSize: 18 }} /> },
  { label: "My Tasks", to: "/student/tasks", icon: <ChecklistRtlRoundedIcon sx={{ fontSize: 18 }} /> },
  { label: "Progress", to: "/student/progress", icon: <TrendingUpIcon sx={{ fontSize: 18 }} /> },
  { label: "Reports", to: "/student/reports", icon: <AssessmentOutlinedIcon sx={{ fontSize: 18 }} /> },
  { label: "Notifications", to: "/student/notifications", icon: <NotificationsOutlinedIcon sx={{ fontSize: 18 }} /> },
  { label: "Settings", to: "/student/settings", icon: <SettingsOutlinedIcon sx={{ fontSize: 18 }} /> },
];

export default function Sidebar({ mobileOpen, onMobileClose, isCollapsed = false, onToggleCollapse }) {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = role === "ADMIN" ? adminNavItems : studentNavItems;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const renderContent = (collapsed) => (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", bgcolor: "background.paper", overflow: "hidden" }}>

      {/* ─── Sidebar Header ─── */}
      <Box
        sx={{
          px: collapsed ? 0 : 2,
          py: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          minHeight: 64,
          borderBottom: "1px solid",
          borderColor: "divider",
          flexShrink: 0,
        }}
      >
        {!collapsed ? (
          <>
            <Box>
              <Typography
                sx={{
                  fontSize: "0.65rem",
                  fontWeight: 800,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "text.disabled",
                }}
              >
                {role === "ADMIN" ? "Admin" : "Student"} Menu
              </Typography>
            </Box>
            {onToggleCollapse && (
              <Tooltip title="Collapse sidebar" placement="right" arrow>
                <IconButton
                  onClick={onToggleCollapse}
                  size="small"
                  sx={{
                    width: 28,
                    height: 28,
                    color: "text.disabled",
                    borderRadius: 1.5,
                    transition: "all 0.18s ease",
                    "&:hover": { color: "primary.main", bgcolor: "primary.50" },
                  }}
                >
                  <ChevronLeftIcon sx={{ fontSize: 18 }} />
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
                  width: 34,
                  height: 34,
                  color: "text.disabled",
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                  transition: "all 0.18s ease",
                  "&:hover": { color: "primary.main", bgcolor: "primary.50", borderColor: "primary.200" },
                }}
              >
                <ChevronRightIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          )
        )}
      </Box>

      {/* ─── Navigation ─── */}
      <Box
        sx={{
          flex: 1,
          px: collapsed ? 1 : 1.5,
          py: 1.5,
          overflowY: "auto",
          overflowX: "hidden",
          "&::-webkit-scrollbar": { width: 3 },
          "&::-webkit-scrollbar-thumb": { bgcolor: "grey.200", borderRadius: 2 },
        }}
      >
        <List disablePadding sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          {navItems.map((item) => {
            const btn = (
              <ListItemButton
                component={NavLink}
                to={item.to}
                onClick={onMobileClose}
                sx={{
                  position: "relative",
                  borderRadius: 2,
                  py: 0.9,
                  px: collapsed ? 0 : 1.25,
                  justifyContent: collapsed ? "center" : "flex-start",
                  minHeight: 40,
                  color: "text.secondary",
                  transition: "all 0.16s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:active": { transform: "scale(0.96)" },
                  "&.active": {
                    bgcolor: "primary.50",
                    color: "primary.dark",
                    "& .MuiListItemIcon-root": { color: "primary.dark" },
                    "& .MuiListItemText-primary": { fontWeight: 700, color: "primary.dark" },
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      left: 0,
                      top: 6,
                      bottom: 6,
                      width: 3,
                      borderRadius: "0 3px 3px 0",
                      bgcolor: "primary.main",
                    },
                    "&:hover": { bgcolor: "primary.100" },
                  },
                  "&:not(.active):hover": {
                    bgcolor: "grey.100",
                    color: "text.primary",
                    "& .MuiListItemIcon-root": { color: "text.primary" },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: collapsed ? "auto" : 32,
                    justifyContent: "center",
                    color: "inherit",
                    transition: "color 0.16s ease",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {!collapsed && (
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: "0.825rem",
                      fontWeight: 600,
                      color: "inherit",
                      noWrap: true,
                    }}
                  />
                )}
              </ListItemButton>
            );

            return collapsed ? (
              <Tooltip key={item.to} title={item.label} placement="right" arrow>
                <ListItem disablePadding>{btn}</ListItem>
              </Tooltip>
            ) : (
              <ListItem key={item.to} disablePadding>{btn}</ListItem>
            );
          })}
        </List>
      </Box>

      {/* ─── User Footer ─── */}
      <Box
        sx={{
          borderTop: "1px solid",
          borderColor: "divider",
          p: collapsed ? 1 : 1.5,
          flexShrink: 0,
        }}
      >
        {!collapsed ? (
          <Box>
            {/* User info row */}
            <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 1, px: 0.5, py: 0.75, borderRadius: 2, "&:hover": { bgcolor: "grey.50" }, transition: "all 0.15s ease" }}>
              <Avatar
                src={user?.avatarUrl || user?.profileImage || ""}
                alt={user?.name || "User"}
                sx={{ width: 32, height: 32, bgcolor: "primary.main", fontSize: "0.8rem", fontWeight: 700 }}
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </Avatar>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography variant="body2" noWrap sx={{ fontWeight: 700, color: "text.primary", fontSize: "0.8rem", lineHeight: 1.3 }}>
                  {user?.name || "User"}
                </Typography>
                <Typography variant="caption" sx={{ color: "text.disabled", fontSize: "0.7rem" }}>
                  {role === "ADMIN" ? "Administrator" : "Student"}
                </Typography>
              </Box>
            </Stack>

            {/* Logout button */}
            <ListItemButton
              onClick={handleLogout}
              sx={{
                borderRadius: 2,
                py: 0.875,
                px: 1.25,
                color: "error.main",
                transition: "all 0.16s ease",
                "&:hover": { bgcolor: "error.50" },
              }}
            >
              <ListItemIcon sx={{ minWidth: 30, color: "error.main" }}>
                <LogoutRoundedIcon sx={{ fontSize: 17 }} />
              </ListItemIcon>
              <ListItemText
                primary="Sign out"
                primaryTypographyProps={{ fontSize: "0.825rem", fontWeight: 700, color: "error.main" }}
              />
            </ListItemButton>
          </Box>
        ) : (
          <Stack spacing={1} alignItems="center">
            <Tooltip title={`${user?.name || "User"} · ${role || "Account"}`} placement="right" arrow>
              <Avatar
                src={user?.avatarUrl || user?.profileImage || ""}
                sx={{ width: 32, height: 32, bgcolor: "primary.main", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer", transition: "transform 0.2s ease", "&:hover": { transform: "scale(1.08)" } }}
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </Avatar>
            </Tooltip>

            <Tooltip title="Sign out" placement="right" arrow>
              <IconButton
                onClick={handleLogout}
                size="small"
                sx={{
                  width: 32,
                  height: 32,
                  color: "error.main",
                  border: "1px solid",
                  borderColor: "error.100",
                  borderRadius: 1.5,
                  transition: "all 0.18s ease",
                  "&:hover": { bgcolor: "error.50" },
                }}
              >
                <LogoutRoundedIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          </Stack>
        )}
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { width: EXPANDED, boxSizing: "border-box", border: "none" },
        }}
      >
        {renderContent(false)}
      </Drawer>

      {/* Desktop Permanent Sidebar */}
      <Box
        component="aside"
        sx={{
          width: isCollapsed ? COLLAPSED : EXPANDED,
          flexShrink: 0,
          display: { xs: "none", md: "block" },
          height: "100%",
          borderRight: "1px solid",
          borderColor: "divider",
          transition: "width 0.22s cubic-bezier(0.4, 0, 0.2, 1)",
          overflow: "hidden",
        }}
      >
        {renderContent(isCollapsed)}
      </Box>
    </>
  );
}
