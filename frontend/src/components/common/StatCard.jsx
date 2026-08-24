import React from "react";
import { Card, CardContent, Typography, Box, Stack, LinearProgress } from "@mui/material";

/**
 * StatCard — Clean, minimal KPI metric card for Dashboard stats.
 *
 * Design principles:
 * - Value dominates (largest, heaviest element)
 * - Label is small and muted (contextualizes the value)
 * - Icon supports but never competes
 * - Hover: 2px lift with soft accent shadow
 * - Progress bar optional (accent color matches icon color)
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
        transition: "transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: accentColor
            ? `0 8px 24px -4px ${accentColor}22`
            : "0 8px 24px rgba(0,0,0,0.06)",
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
                fontSize: "0.78rem",
                mb: 0.75,
                letterSpacing: "0.02em",
                textTransform: "uppercase",
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: "text.primary",
                lineHeight: 1.15,
                letterSpacing: "-0.025em",
                fontSize: { xs: "1.6rem", sm: "1.75rem" },
              }}
            >
              {value ?? 0}
            </Typography>
          </Box>

          {IconComponent && (
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2.5,
                bgcolor: iconBgColor,
                color: iconColor,
                display: "grid",
                placeItems: "center",
                flexShrink: 0,
                transition: "transform 0.2s ease",
                ".MuiCard-root:hover &": {
                  transform: "scale(1.08)",
                },
              }}
            >
              {React.isValidElement(IconComponent) ? IconComponent : <IconComponent sx={{ fontSize: 22 }} />}
            </Box>
          )}
        </Stack>

        {progress !== undefined && (
          <Box sx={{ mt: 2 }}>
            <LinearProgress
              variant="determinate"
              value={Math.min(100, Math.max(0, progress))}
              sx={{
                height: 5,
                borderRadius: 3,
                bgcolor: "grey.100",
                "& .MuiLinearProgress-bar": {
                  bgcolor: accentColor || "primary.main",
                  borderRadius: 3,
                },
              }}
            />
          </Box>
        )}

        {(subtitle || action) && (
          <Box sx={{ mt: "auto", pt: 1.5 }}>
            {subtitle && (
              <Typography variant="caption" sx={{ color: "text.disabled", fontWeight: 500, display: "block", fontSize: "0.75rem" }}>
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
