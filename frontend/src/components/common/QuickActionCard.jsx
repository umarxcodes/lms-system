import React from "react";
import { Box, Paper, Stack, Typography } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";

/**
 * QuickActionCard — A single clickable action shortcut tile.
 *
 * Used inside both Admin and Student dashboards in a grid.
 * Props:
 * - `label`    — Action title (e.g. "My Attendance")
 * - `desc`     — Short description (e.g. "Logs & presence")
 * - `icon`     — React element (MUI icon)
 * - `to`       — Navigation path
 * - `color`    — Icon + hover accent color (hex)
 * - `bg`       — Icon background color (hex)
 * - `onClick`  — Optional click override (if not using `to`)
 */
export default function QuickActionCard({ label, desc, icon, to, color, bg, onClick }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) return onClick();
    if (to) navigate(to);
  };

  return (
    <Paper
      elevation={0}
      onClick={handleClick}
      sx={{
        p: 2,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        cursor: "pointer",
        transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        userSelect: "none",
        "&:hover": {
          borderColor: color,
          boxShadow: `0 8px 24px -6px ${color}28`,
          transform: "translateY(-2px)",
          "& .quick-action-arrow": {
            transform: "translateX(4px)",
            color,
          },
          "& .quick-action-icon": {
            transform: "scale(1.1)",
          },
        },
        "&:active": {
          transform: "scale(0.98)",
        },
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0 }}>
        {/* Icon */}
        <Box
          className="quick-action-icon"
          sx={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            bgcolor: bg,
            color,
            display: "grid",
            placeItems: "center",
            flexShrink: 0,
            transition: "transform 0.2s ease",
          }}
        >
          {icon}
        </Box>

        {/* Labels */}
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="body2"
            sx={{ fontWeight: 700, color: "text.primary", fontSize: "0.85rem", lineHeight: 1.3 }}
            noWrap
          >
            {label}
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: "text.secondary", fontSize: "0.72rem", display: "block" }}
            noWrap
          >
            {desc}
          </Typography>
        </Box>
      </Stack>

      {/* Arrow */}
      <ArrowForwardIcon
        className="quick-action-arrow"
        sx={{
          fontSize: 16,
          color: "text.disabled",
          transition: "transform 0.2s ease, color 0.2s ease",
          flexShrink: 0,
          ml: 1,
        }}
      />
    </Paper>
  );
}
