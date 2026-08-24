import React from "react";
import { Button, IconButton, Tooltip } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddIcon from "@mui/icons-material/Add";

/**
 * ActionButton — Versatile action control.
 *
 * Two modes:
 * 1. Icon-only: Pass `type` = "view" | "edit" | "delete" | "add" | "arrow"
 *    → Renders a compact circular IconButton with semantic color & hover effect.
 * 2. Text button: Pass `children` text content
 *    → Renders a styled MUI Button.
 *
 * Both modes support an optional `title` prop for Tooltip wrapping.
 */

const ICON_CONFIG = {
  view: {
    icon: <ArrowForwardIcon sx={{ fontSize: 15 }} />,
    bg: "#EFF6FF",
    color: "#2563EB",
    border: "#DBEAFE",
    hoverBg: "#2563EB",
    hoverColor: "#fff",
  },
  arrow: {
    icon: <ArrowForwardIcon sx={{ fontSize: 15 }} />,
    bg: "#EFF6FF",
    color: "#2563EB",
    border: "#DBEAFE",
    hoverBg: "#2563EB",
    hoverColor: "#fff",
  },
  edit: {
    icon: <EditIcon sx={{ fontSize: 15 }} />,
    bg: "#FFF7ED",
    color: "#EA580C",
    border: "#FFEDD5",
    hoverBg: "#EA580C",
    hoverColor: "#fff",
  },
  delete: {
    icon: <DeleteIcon sx={{ fontSize: 15 }} />,
    bg: "#FEF2F2",
    color: "#DC2626",
    border: "#FEE2E2",
    hoverBg: "#DC2626",
    hoverColor: "#fff",
  },
  add: {
    icon: <AddIcon sx={{ fontSize: 15 }} />,
    bg: "#F0FDF4",
    color: "#16A34A",
    border: "#DCFCE7",
    hoverBg: "#16A34A",
    hoverColor: "#fff",
  },
};

export default function ActionButton({
  children,
  type,
  title,
  variant = "outlined",
  color = "primary",
  size = "medium",
  sx = {},
  ...rest
}) {
  // ─── Icon-only mode ───
  if (type && !children) {
    const cfg = ICON_CONFIG[type] || ICON_CONFIG.view;

    const iconBtn = (
      <IconButton
        size="small"
        sx={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          color: cfg.color,
          bgcolor: cfg.bg,
          border: `1px solid ${cfg.border}`,
          p: 0,
          flexShrink: 0,
          transition: "all 0.18s cubic-bezier(0.16, 1, 0.3, 1)",
          "&:hover": {
            bgcolor: cfg.hoverBg,
            color: cfg.hoverColor,
            borderColor: cfg.hoverBg,
            transform: "scale(1.1)",
            boxShadow: "0 2px 10px rgba(0,0,0,0.14)",
          },
          "&:active": { transform: "scale(0.96)" },
          ...sx,
        }}
        {...rest}
      >
        {cfg.icon}
      </IconButton>
    );

    return title ? <Tooltip title={title} arrow>{iconBtn}</Tooltip> : iconBtn;
  }

  // ─── Text button mode ───
  const btn = (
    <Button
      variant={variant}
      color={color}
      size={size}
      sx={{
        borderRadius: 2.5,
        textTransform: "none",
        fontWeight: 700,
        fontSize: "0.875rem",
        px: size === "small" ? 1.75 : 2.25,
        py: size === "small" ? 0.625 : 0.875,
        boxShadow: "none",
        transition: "all 0.18s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": { boxShadow: "none" },
        "&:focus-visible": {
          outline: "2px solid",
          outlineColor: "primary.main",
          outlineOffset: "2px",
        },
        ...sx,
      }}
      {...rest}
    >
      {children}
    </Button>
  );

  return title ? <Tooltip title={title} arrow>{btn}</Tooltip> : btn;
}
