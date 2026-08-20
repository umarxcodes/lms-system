import React from "react";
import { Button, IconButton, Tooltip, styled } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const StyledButton = styled(Button)(({ ownerState }) => {
  const { color = "primary", variant = "outlined" } = ownerState || {};

  return {
    borderRadius: "8px",
    textTransform: "none",
    fontWeight: 600,
    fontSize: "0.875rem",
    padding: "6px 14px",
    transition: "all 0.15s ease",
    boxShadow: "none",
    "&:focus-visible": {
      outline: "2px solid #2563EB",
      outlineOffset: "2px",
    },
    ...(variant === "contained" && color === "primary" && {
      bgcolor: "#2563EB",
      color: "#FFFFFF",
      "&:hover": {
        bgcolor: "#1D4ED8",
        boxShadow: "none",
      },
    }),
    ...(variant === "contained" && color === "success" && {
      bgcolor: "#16A34A",
      color: "#FFFFFF",
      "&:hover": {
        bgcolor: "#15803D",
        boxShadow: "none",
      },
    }),
    ...(variant === "contained" && color === "error" && {
      bgcolor: "#DC2626",
      color: "#FFFFFF",
      "&:hover": {
        bgcolor: "#B91C1C",
        boxShadow: "none",
      },
    }),
    ...(variant === "outlined" && {
      borderColor: "#E2E8F0",
      color: "#111827",
      bgcolor: "#FFFFFF",
      "&:hover": {
        borderColor: "#2563EB",
        bgcolor: "#EFF6FF",
        color: "#2563EB",
      },
    }),
    ...(variant === "text" && {
      color: "#2563EB",
      "&:hover": {
        bgcolor: "#EFF6FF",
      },
    }),
  };
});

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
  // If `type` is passed (e.g. "view", "edit", "delete", "arrow") and no text children, render a sleek circular icon button
  if (type && !children) {
    let icon = <ArrowForwardIcon sx={{ fontSize: 16 }} />;
    let iconBg = "#EFF6FF";
    let iconColor = "#2563EB";
    let borderColor = "#DBEAFE";
    let hoverBg = "#2563EB";
    let hoverColor = "#FFFFFF";

    if (type === "view") {
      icon = <ArrowForwardIcon sx={{ fontSize: 16 }} />;
      iconBg = "#EFF6FF";
      iconColor = "#2563EB";
      borderColor = "#DBEAFE";
      hoverBg = "#2563EB";
      hoverColor = "#FFFFFF";
    } else if (type === "edit") {
      icon = <EditIcon sx={{ fontSize: 16 }} />;
      iconBg = "#FFF7ED";
      iconColor = "#EA580C";
      borderColor = "#FFEDD5";
      hoverBg = "#EA580C";
      hoverColor = "#FFFFFF";
    } else if (type === "delete") {
      icon = <DeleteIcon sx={{ fontSize: 16 }} />;
      iconBg = "#FEF2F2";
      iconColor = "#DC2626";
      borderColor = "#FEE2E2";
      hoverBg = "#DC2626";
      hoverColor = "#FFFFFF";
    } else if (type === "arrow") {
      icon = <ArrowForwardIcon sx={{ fontSize: 16 }} />;
    }

    const iconBtn = (
      <IconButton
        size="small"
        sx={{
          width: 32,
          height: 32,
          minWidth: 32,
          minHeight: 32,
          borderRadius: "50%",
          color: iconColor,
          bgcolor: iconBg,
          border: `1px solid ${borderColor}`,
          p: 0,
          flexShrink: 0,
          transition: "all 0.18s cubic-bezier(0.16, 1, 0.3, 1)",
          "&:hover": {
            bgcolor: hoverBg,
            color: hoverColor,
            borderColor: hoverBg,
            transform: "scale(1.08)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
          },
          ...sx,
        }}
        {...rest}
      >
        {icon}
      </IconButton>
    );

    return title ? <Tooltip title={title}>{iconBtn}</Tooltip> : iconBtn;
  }

  // Standard Button Component
  const btn = (
    <StyledButton variant={variant} color={color} ownerState={{ variant, color }} sx={sx} {...rest}>
      {children}
    </StyledButton>
  );

  return title ? <Tooltip title={title}>{btn}</Tooltip> : btn;
}
