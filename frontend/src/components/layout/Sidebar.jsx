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
import AutoAwesomeMosaicRoundedIcon from "@mui/icons-material/AutoAwesomeMosaicRounded";
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
  const { role, logout } = useAuth();
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
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ px: 3, py: 3 }}>
        <Box
          sx={{
            width: 38,
            height: 38,
            borderRadius: 2,
            display: "grid",
            placeItems: "center",
            color: "#ffffff",
            background: "linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <AutoAwesomeMosaicRoundedIcon fontSize="small" />
        </Box>
        <Box sx={{ lineHeight: 1.2 }}>
          <Typography sx={{ fontWeight: 800, color: "text.primary", fontSize: 18 }}>
            SMIT
          </Typography>
          <Typography sx={{ fontSize: 12, color: "text.secondary", fontWeight: 600 }}>
            Bootcamp LMS
          </Typography>
        </Box>
      </Stack>

      <Divider />

      {/* Navigation List */}
      <Box sx={{ flex: 1, px: 1.5, py: 2, overflowY: "auto" }}>
        <Typography
          variant="caption"
          sx={{
            px: 1.5,
            pb: 1,
            display: "block",
            fontWeight: 700,
            color: "text.disabled",
            letterSpacing: "0.05em",
          }}
        >
          {role === "ADMIN" ? "ADMINISTRATION" : "STUDENT PORTAL"}
        </Typography>

        <List disablePadding sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          {navItems.map((item) => (
            <ListItem key={item.to} disablePadding>
              <ListItemButton
                component={NavLink}
                to={item.to}
                onClick={onMobileClose}
                sx={{
                  borderRadius: 2,
                  py: 1,
                  px: 1.5,
                  color: "text.secondary",
                  "&.active": {
                    bgcolor: "primary.50",
                    color: "primary.main",
                    fontWeight: 700,
                    "& .MuiListItemIcon-root": {
                      color: "primary.main",
                    },
                  },
                  "&:hover": {
                    bgcolor: "grey.100",
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: "inherit" }}>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontSize: 14, fontWeight: "inherit" }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      <Divider />

      {/* Footer Logout Action */}
      <Box sx={{ p: 2 }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            py: 1,
            px: 1.5,
            color: "error.main",
            "&:hover": { bgcolor: "error.50" },
          }}
        >
          <ListItemIcon sx={{ minWidth: 36, color: "error.main" }}>
            <LogoutRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Logout" primaryTypographyProps={{ fontSize: 14, fontWeight: 600 }} />
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
