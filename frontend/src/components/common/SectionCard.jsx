import React from "react";
import { Card, CardContent, Box, Stack, Typography, Divider } from "@mui/material";

/**
 * SectionCard — Reusable dashboard card with a consistent header pattern.
 *
 * Used across Admin and Student dashboards for sections like:
 * "Tasks Due Today", "Assigned Tasks", "Team Members", etc.
 *
 * Props:
 * - `icon`         — MUI icon element
 * - `iconBg`       — background color of icon box (e.g. "#FFF7ED")
 * - `iconColor`    — icon color (e.g. "#EA580C")
 * - `title`        — section heading string
 * - `badge`        — optional React node rendered next to the title (e.g. a Chip)
 * - `subtitle`     — small muted description below the title
 * - `action`       — optional action element (e.g. "View All" button) placed top-right
 * - `children`     — card body content
 * - `minHeight`    — optional min height for the card body
 * - `noDivider`    — suppress the horizontal divider between header and body
 */
export default function SectionCard({
  icon,
  iconBg = "#EFF6FF",
  iconColor = "#2563EB",
  title,
  badge,
  subtitle,
  action,
  children,
  minHeight,
  noDivider = false,
  sx = {},
}) {
  return (
    <Card
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        ...sx,
      }}
    >
      <CardContent sx={{ p: 2.5, flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Header Row */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: noDivider ? 2 : 0 }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            {/* Icon */}
            {icon && (
              <Box
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: 2,
                  bgcolor: iconBg,
                  color: iconColor,
                  display: "grid",
                  placeItems: "center",
                  flexShrink: 0,
                }}
              >
                {icon}
              </Box>
            )}

            {/* Title + Badge + Subtitle */}
            <Box>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                    color: "text.primary",
                    fontSize: "1rem",
                    lineHeight: 1.3,
                  }}
                >
                  {title}
                </Typography>
                {badge}
              </Stack>
              {subtitle && (
                <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.75rem" }}>
                  {subtitle}
                </Typography>
              )}
            </Box>
          </Stack>

          {/* Right Action */}
          {action && <Box sx={{ flexShrink: 0, ml: 2 }}>{action}</Box>}
        </Stack>

        {!noDivider && <Divider sx={{ my: 2 }} />}

        {/* Body */}
        <Box sx={{ flex: 1, minHeight, display: "flex", flexDirection: "column" }}>
          {children}
        </Box>
      </CardContent>
    </Card>
  );
}
