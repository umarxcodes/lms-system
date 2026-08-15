import React from "react";
import { Box, Stack, Typography, LinearProgress } from "@mui/material";

export default function ProgressBar({ value = 0, showLabel = true, height = 8, labelPosition = "right" }) {
  const normalizedValue = Math.min(100, Math.max(0, Math.round(value)));

  const getColor = (val) => {
    if (val >= 75) return "success";
    if (val >= 40) return "primary";
    if (val > 0) return "warning";
    return "error";
  };

  const color = getColor(normalizedValue);

  if (labelPosition === "top") {
    return (
      <Box sx={{ width: "100%" }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
          <Typography variant="caption" fontWeight={700} color="text.secondary">
            Progress
          </Typography>
          <Typography variant="caption" fontWeight={800} color={`${color}.main`}>
            {normalizedValue}%
          </Typography>
        </Stack>
        <LinearProgress
          variant="determinate"
          value={normalizedValue}
          color={color}
          sx={{
            height,
            borderRadius: height / 2,
            bgcolor: "#f1f5f9",
          }}
        />
      </Box>
    );
  }

  return (
    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ width: "100%" }}>
      <Box sx={{ flexGrow: 1 }}>
        <LinearProgress
          variant="determinate"
          value={normalizedValue}
          color={color}
          sx={{
            height,
            borderRadius: height / 2,
            bgcolor: "#f1f5f9",
          }}
        />
      </Box>
      {showLabel && (
        <Typography
          variant="body2"
          fontWeight={800}
          color={`${color}.main`}
          sx={{ minWidth: 42, textAlign: "right", fontSize: "0.825rem" }}
        >
          {normalizedValue}%
        </Typography>
      )}
    </Stack>
  );
}
