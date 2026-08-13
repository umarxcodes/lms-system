import React from "react";
import { Card, CardContent, Typography, Box, Stack, LinearProgress } from "@mui/material";

export default function StatCard({
  title,
  value,
  subtitle,
  icon: IconComponent,
  iconBgColor = "#eff6ff",
  iconColor = "#1d4ed8",
  progress,
  action,
}) {
  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
          <Box>
            <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 600, mb: 0.5 }}>
              {title}
            </Typography>
            <Typography variant="h2" sx={{ fontWeight: 700, color: "text.primary" }}>
              {value ?? 0}
            </Typography>
          </Box>
          {IconComponent && (
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2.5,
                bgcolor: iconBgColor,
                color: iconColor,
                display: "grid",
                placeItems: "center",
                flexShrink: 0,
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
              <Typography variant="caption" sx={{ fontWeight: 700, color: "primary.main" }}>
                {Math.round(progress)}%
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={Math.min(100, Math.max(0, progress))}
              sx={{ height: 6, borderRadius: 3, bgcolor: "grey.100" }}
            />
          </Box>
        )}

        {subtitle && (
          <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mt: 1 }}>
            {subtitle}
          </Typography>
        )}

        {action && <Box sx={{ mt: 1.5 }}>{action}</Box>}
      </CardContent>
    </Card>
  );
}
