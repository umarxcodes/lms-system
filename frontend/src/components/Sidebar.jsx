import { NavLink } from "react-router-dom";
import { Box, Stack, Typography, List } from "@mui/material";

import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import ChecklistRtlRoundedIcon from "@mui/icons-material/ChecklistRtlRounded";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import AutoAwesomeMosaicRoundedIcon from "@mui/icons-material/AutoAwesomeMosaicRounded";

// Main navigation links
const mainNavItems = [
  {
    label: "Dashboard",
    to: "/",
    icon: <GridViewRoundedIcon fontSize="small" />,
  },
  {
    label: "Students",
    to: "/students",
    icon: <PersonOutlineRoundedIcon fontSize="small" />,
  },
  {
    label: "Attendance",
    to: "/attendance",
    icon: <EventAvailableOutlinedIcon fontSize="small" />,
  },
  {
    label: "Teams",
    to: "/teams",
    icon: <GroupsRoundedIcon fontSize="small" />,
  },
  {
    label: "Tasks",
    to: "/tasks",
    icon: <ChecklistRtlRoundedIcon fontSize="small" />,
  },
];

const SIDEBAR_WIDTH = 260;

const navLinkBaseSx = {
  display: "flex",
  alignItems: "center",
  gap: 1.5,
  px: 1.5,
  py: 1.25,
  borderRadius: 2,
  fontSize: 14,
  fontWeight: 500,
  color: "grey.600",
  textDecoration: "none",
  position: "relative",
  transition: "background-color .15s ease, color .15s ease",
  "&:hover": {
    backgroundColor: "grey.50",
    color: "grey.900",
  },
};

const navLinkActiveSx = {
  backgroundColor: "#eff6ff", // brand-50
  color: "#1d4ed8", // brand-700
  fontWeight: 600,
  "&:hover": {
    backgroundColor: "#eff6ff",
    color: "#1d4ed8",
  },
  "&::before": {
    content: '""',
    position: "absolute",
    left: 0,
    top: "50%",
    transform: "translateY(-50%)",
    width: 4,
    height: 20,
    borderRadius: "0 4px 4px 0",
    backgroundColor: "#1d4ed8",
  },
};

function SidebarLink({ to, icon, label }) {
  return (
    <Box
      component={NavLink}
      to={to}
      sx={({ isActive }) => ({
        ...navLinkBaseSx,
        ...(isActive ? navLinkActiveSx : {}),
      })}
    >
      <Box
        sx={{
          width: 20,
          display: "flex",
          justifyContent: "center",
          color: "inherit",
          "& svg": { fontSize: 18 },
        }}
      >
        {icon}
      </Box>
      {label}
    </Box>
  );
}

export default function Sidebar() {
  return (
    <Box
      component="aside"
      sx={{
        width: SIDEBAR_WIDTH,
        flexShrink: 0,
        height: "100vh",
        bgcolor: "#fff",
        borderRight: "1px solid",
        borderColor: "grey.200",
        display: { xs: "none", md: "flex" },
        flexDirection: "column",
        zIndex: 20,
      }}
    >
      {/* Brand */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={1.5}
        sx={{ px: 3, pt: 3.5, pb: 3 }}
      >
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 1.5,
            display: "grid",
            placeItems: "center",
            color: "#fff",
            background: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
          }}
        >
          <AutoAwesomeMosaicRoundedIcon fontSize="small" />
        </Box>
        <Box sx={{ lineHeight: 1.2 }}>
          <Typography sx={{ fontWeight: 800, color: "grey.900", fontSize: 18 }}>
            SMIT
          </Typography>
          <Typography sx={{ fontSize: 12, color: "grey.500", fontWeight: 500 }}>
            Bootcamp LMS
          </Typography>
        </Box>
      </Stack>

      {/* Main nav */}
      <Box sx={{ flex: 1, px: 1.5, overflowY: "auto", pb: 3 }}>
        <Typography
          sx={{
            px: 1.5,
            pt: 1,
            pb: 0.5,
            fontSize: 11,
            fontWeight: 600,
            color: "grey.400",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          Main
        </Typography>

        <List
          disablePadding
          sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}
        >
          {mainNavItems.map((item) => (
            <SidebarLink key={item.to} {...item} />
          ))}
        </List>
      </Box>

      {/* Bottom: Settings + Logout */}
      <Stack spacing={0.5} sx={{ px: 1.5, pb: 2 }}>
        <SidebarLink
          to="/settings"
          icon={<SettingsOutlinedIcon fontSize="small" />}
          label="Settings"
        />

        <Box
          component="button"
          onClick={() => {
            // TODO: wire up actual logout logic
          }}
          sx={{
            ...navLinkBaseSx,
            width: "100%",
            border: "none",
            background: "none",
            cursor: "pointer",
            color: "#ef4444",
            fontFamily: "inherit",
            "&:hover": {
              backgroundColor: "#fef2f2",
              color: "#ef4444",
            },
          }}
        >
          <Box sx={{ width: 20, display: "flex", justifyContent: "center" }}>
            <LogoutRoundedIcon fontSize="small" />
          </Box>
          Logout
        </Box>
      </Stack>
    </Box>
  );
}
