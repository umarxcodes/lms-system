import React from "react";
import {
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  TextField,
  MenuItem,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import NotificationsIcon from "@mui/icons-material/Notifications";
import TuneIcon from "@mui/icons-material/Tune";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";

export default function SettingsNavigation({ sections, activeSection, onSelectSection }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const getIcon = (id) => {
    switch (id) {
      case "profile":
        return <PersonIcon fontSize="small" />;
      case "security":
        return <LockIcon fontSize="small" />;
      case "notifications":
        return <NotificationsIcon fontSize="small" />;
      case "preferences":
        return <TuneIcon fontSize="small" />;
      case "application":
        return <SettingsApplicationsIcon fontSize="small" />;
      default:
        return <PersonIcon fontSize="small" />;
    }
  };

  if (isMobile) {
    return (
      <Box sx={{ mb: 2.5, width: "100%" }}>
        <TextField
          select
          fullWidth
          size="small"
          label="Settings Section"
          value={activeSection}
          onChange={(e) => onSelectSection(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              bgcolor: "#ffffff",
              fontWeight: 700,
            },
          }}
        >
          {sections.map((sec) => (
            <MenuItem key={sec.id} value={sec.id}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                {getIcon(sec.id)}
                {sec.label}
              </Box>
            </MenuItem>
          ))}
        </TextField>
      </Box>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        width: 260,
        flexShrink: 0,
        border: "1px solid #e2e8f0",
        borderRadius: 2.5,
        bgcolor: "#ffffff",
        overflow: "hidden",
        alignSelf: "flex-start",
      }}
    >
      <List disablePadding sx={{ py: 1 }}>
        {sections.map((sec) => {
          const selected = activeSection === sec.id;
          return (
            <ListItem key={sec.id} disablePadding sx={{ px: 1, py: 0.25 }}>
              <ListItemButton
                selected={selected}
                onClick={() => onSelectSection(sec.id)}
                sx={{
                  borderRadius: 2,
                  py: 1.1,
                  px: 2,
                  "&.Mui-selected": {
                    bgcolor: "#eff6ff",
                    color: "#1e40af",
                    fontWeight: 800,
                    "& .MuiListItemIcon-root": {
                      color: "#1e40af",
                    },
                    "&:hover": {
                      bgcolor: "#dbeafe",
                    },
                  },
                  "&:hover": {
                    bgcolor: "#f8fafc",
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: selected ? "#1e40af" : "text.secondary" }}>
                  {getIcon(sec.id)}
                </ListItemIcon>
                <ListItemText
                  primary={sec.label}
                  primaryTypographyProps={{
                    variant: "body2",
                    fontWeight: selected ? 800 : 600,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Paper>
  );
}
