import React from "react";
import { Card, CardContent, Typography, Box, Stack, LinearProgress } from "@mui/material";

/**
 * StatCard — A clean, minimal metric card for Dashboard KPIs.
 *
 * Design principles:
 * - The VALUE dominates (largest, heaviest element)
 * - The LABEL is small and muted (explains the value)
 * - The ICON supports but does not compete
 * - Hover is subtle (1px lift, soft shadow)
 * - No accent lines or heavy decorative borders
 */
export default function StatCard({
  title,
  value,
  subtitle,
  icon: IconComponent,
  iconBgColor = "grey.100",
  iconColor = "primary.main",
  progress,
  accentColor,
  action,
}) {
  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        border: "1px solid",
        borderColor: "divider",
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
        "&:hover": {
          transform: "translateY(-1px)",
          boxShadow: 2,
        },
      }}
    >
      <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 }, flex: 1, display: "flex", flexDirection: "column" }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                fontWeight: 600,
                fontSize: "0.8rem",
                mb: 0.75,
                letterSpacing: "0.01em",
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: "text.primary",
                lineHeight: 1.2,
                letterSpacing: "-0.02em",
              }}
            >
              {value ?? 0}
            </Typography>
          </Box>

          {IconComponent && (
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2.5,
                bgcolor: iconBgColor,
                color: iconColor,
                display: "grid",
                placeItems: "center",
                flexShrink: 0,
              }}
            >
              {React.isValidElement(IconComponent) ? IconComponent : <IconComponent fontSize="small" />}
            </Box>
          )}
        </Stack>

        {progress !== undefined && (
          <Box sx={{ mt: 1.5 }}>
            <LinearProgress
              variant="determinate"
              value={Math.min(100, Math.max(0, progress))}
              sx={{
                height: 4,
                borderRadius: 2,
                bgcolor: "grey.100",
                "& .MuiLinearProgress-bar": {
                  bgcolor: accentColor || "primary.main",
                  borderRadius: 2,
                },
              }}
            />
          </Box>
        )}

        {(subtitle || action) && (
          <Box sx={{ mt: "auto", pt: 1.5 }}>
            {subtitle && (
              <Typography variant="caption" sx={{ color: "text.disabled", fontWeight: 500, display: "block" }}>
                {subtitle}
              </Typography>
            )}
            {action && <Box sx={{ mt: 1 }}>{action}</Box>}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
