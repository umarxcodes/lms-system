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

import { useAuth } from "../../context/AuthContext";

const SIDEBAR_WIDTH = 260;

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

export default function Sidebar({ mobileOpen, onMobileClose }) {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = role === "ADMIN" ? adminNavItems : studentNavItems;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const sidebarContent = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#ffffff",
      }}
    >
      {/* Brand Header */}
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ px: 3, py: 2.5 }}>
        <Box
          component="img"
          src="https://res.cloudinary.com/dlul8f6xz/image/upload/v1786599373/logo.6lrMPvRL_phqqyj.png"
          alt="SMIT Logo"
          sx={{
            height: 44,
            width: "auto",
            objectFit: "contain",
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.06))",
          }}
        />
        <Box sx={{ lineHeight: 1.2 }}>
          <Typography
            sx={{
              fontWeight: 800,
              color: "text.primary",
              fontSize: 17,
              letterSpacing: "-0.02em",
              fontFamily: '"Plus Jakarta Sans", sans-serif',
            }}
          >
            SMIT LMS
          </Typography>
          <Typography sx={{ fontSize: 11, color: "text.secondary", fontWeight: 600 }}>
            Saylani Bootcamp Portal
          </Typography>
        </Box>
      </Stack>

      <Divider sx={{ borderColor: "grey.100" }} />

      {/* Navigation List */}
      <Box sx={{ flex: 1, px: 2, py: 2.5, overflowY: "auto" }}>
        <Typography
          variant="caption"
          sx={{
            px: 1.5,
            pb: 1.5,
            display: "block",
            fontWeight: 800,
            color: "text.disabled",
            letterSpacing: "0.08em",
            fontSize: "0.7rem",
          }}
        >
          {role === "ADMIN" ? "ADMINISTRATION" : "STUDENT PORTAL"}
        </Typography>

        <List disablePadding sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
          {navItems.map((item) => (
            <ListItem key={item.to} disablePadding>
              <ListItemButton
                component={NavLink}
                to={item.to}
                onClick={onMobileClose}
                sx={{
                  borderRadius: 2.5,
                  py: 1.1,
                  px: 2,
                  color: "#475569",
                  transition: "all 0.2s ease-in-out",
                  "&.active": {
                    background: "linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%)",
                    color: "#ffffff",
                    fontWeight: 700,
                    boxShadow: "0 4px 12px rgba(30, 64, 175, 0.25)",
                    "& .MuiListItemIcon-root": {
                      color: "#ffffff",
                    },
                  },
                  "&:not(.active):hover": {
                    bgcolor: "grey.100",
                    color: "primary.main",
                    transform: "translateX(4px)",
                    "& .MuiListItemIcon-root": {
                      color: "primary.main",
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: "inherit", transition: "color 0.2s ease" }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontSize: 13.5, fontWeight: "inherit" }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      <Divider sx={{ borderColor: "grey.100" }} />

      {/* User Summary & Logout */}
      <Box sx={{ p: 2 }}>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ px: 1.5, py: 1, mb: 1 }}>
          <Avatar
            src={user?.avatarUrl || user?.profileImage || ""}
            alt={user?.name || "User"}
            sx={{ width: 34, height: 34, bgcolor: "primary.main", fontSize: 14, fontWeight: 700 }}
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
          <ListItemIcon sx={{ minWidth: 36, color: "error.main" }}>
            <LogoutRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Logout" primaryTypographyProps={{ fontSize: 13.5, fontWeight: 700 }} />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile Temporary Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: SIDEBAR_WIDTH },
        }}
      >
        {sidebarContent}
      </Drawer>

      {/* Desktop Permanent Sidebar */}
      <Box
        component="aside"
        sx={{
          width: SIDEBAR_WIDTH,
          flexShrink: 0,
          display: { xs: "none", md: "block" },
          height: "100vh",
          borderRight: "1px solid",
          borderColor: "divider",
        }}
      >
        {sidebarContent}
      </Box>
    </>
  );
}
