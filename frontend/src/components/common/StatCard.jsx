import React from "react";
import { Card, CardContent, Typography, Box, Stack, LinearProgress } from "@mui/material";

export default function StatCard({
  title,
  value,
  subtitle,
  icon: IconComponent,
  iconBgColor = "#eff6ff",
  iconColor = "#1e40af",
  progress,
  accentColor = "#1e40af",
  action,
}) {
  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        border: "1px solid",
        borderColor: "divider",
        transition: "all 0.25s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 12px 24px -8px rgba(0, 0, 0, 0.08)",
          borderColor: accentColor,
        },
      }}
    >
      {/* Top Accent Line */}
      <Box sx={{ height: 4, width: "100%", bgcolor: accentColor }} />

      <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 }, flex: 1, display: "flex", flexDirection: "column" }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
          <Box>
            <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 600, mb: 0.5, fontSize: "0.82rem" }}>
              {title}
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                color: "text.primary",
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                letterSpacing: "-0.02em",
              }}
            >
              {value ?? 0}
            </Typography>
          </Box>

          {IconComponent && (
            <Box
              sx={{
                width: 46,
                height: 46,
                borderRadius: 3,
                bgcolor: iconBgColor,
                color: iconColor,
                display: "grid",
                placeItems: "center",
                flexShrink: 0,
                boxShadow: `0 4px 10px ${iconBgColor}`,
              }}
            >
              {React.isValidElement(IconComponent) ? IconComponent : <IconComponent />}
            </Box>
          )}
        </Stack>

        {progress !== undefined && (
          <Box sx={{ mt: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 600, color: "text.secondary" }}>
                Progress
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 800, color: accentColor }}>
                {Math.round(progress)}%
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={Math.min(100, Math.max(0, progress))}
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: "grey.100",
                "& .MuiLinearProgress-bar": {
                  bgcolor: accentColor,
                  borderRadius: 3,
                },
              }}
            />
          </Box>
        )}

        <Box sx={{ mt: "auto", pt: subtitle || action ? 1.5 : 0 }}>
          {subtitle && (
            <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 500, display: "block" }}>
              {subtitle}
            </Typography>
          )}

          {action && <Box sx={{ mt: 1 }}>{action}</Box>}
        </Box>
      </CardContent>
    </Card>
  );
}
