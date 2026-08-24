import React from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";

/**
 * EmptyState — Unified empty content placeholder.
 *
 * Supports two usage patterns:
 * 1. Standalone: `actionLabel` + `onAction` props (click handler)
 * 2. DataTable:  `actionButton` prop (pre-rendered React node)
 */
export default function EmptyState({
  title = "No data found",
  description = "There are no records matching your request.",
  icon: Icon = InboxOutlinedIcon,
  // Pattern 1 — standalone usage
  actionLabel,
  onAction,
  // Pattern 2 — DataTable usage (pre-rendered node)
  actionButton,
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        py: 7,
        px: 4,
        textAlign: "center",
        borderRadius: 3,
        border: "1px dashed",
        borderColor: "grey.300",
        bgcolor: "background.paper",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        animation: "emptyStateFade 250ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
        willChange: "opacity, transform",
        "@keyframes emptyStateFade": {
          "0%": { opacity: 0, transform: "translateY(8px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        "@media (prefers-reduced-motion: reduce)": {
          animation: "none",
        },
      }}
    >
      {/* Icon Container */}
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          bgcolor: "grey.100",
          color: "grey.400",
          display: "grid",
          placeItems: "center",
          mb: 2.5,
          transition: "transform 0.2s ease",
          "&:hover": { transform: "scale(1.06)" },
        }}
      >
        <Icon sx={{ fontSize: 32 }} />
      </Box>

      <Typography variant="h6" sx={{ fontWeight: 700, color: "text.primary", mb: 0.75 }}>
        {title}
      </Typography>

      <Typography
        variant="body2"
        sx={{ color: "text.secondary", maxWidth: 380, lineHeight: 1.6, mb: actionLabel || actionButton ? 3 : 0 }}
      >
        {description}
      </Typography>

      {/* Render pre-built action node (DataTable usage) */}
      {actionButton && <Box>{actionButton}</Box>}

      {/* Render label+handler action (standalone usage) */}
      {actionLabel && onAction && !actionButton && (
        <Button variant="contained" onClick={onAction} sx={{ fontWeight: 700 }}>
          {actionLabel}
        </Button>
      )}
    </Paper>
  );
}
