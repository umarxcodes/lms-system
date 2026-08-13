import React from "react";
import { Chip } from "@mui/material";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

export default function StatusChip({ status }) {
  if (!status) return null;

  const normalized = String(status).toLowerCase().replace(/_/g, " ");

  let color = "default";
  let icon = null;
  let label = normalized.charAt(0).toUpperCase() + normalized.slice(1);

  switch (normalized) {
    case "present":
    case "completed":
    case "active":
      color = "success";
      icon = <CheckCircleOutlinedIcon fontSize="small" />;
      break;

    case "absent":
    case "urgent":
    case "high":
    case "inactive":
      color = "error";
      icon = <HighlightOffIcon fontSize="small" />;
      break;

    case "late":
    case "medium":
    case "in progress":
    case "under review":
      color = "warning";
      icon = <AccessTimeIcon fontSize="small" />;
      break;

    case "excused":
    case "planning":
    case "on hold":
    case "low":
    case "todo":
      color = "info";
      icon = <InfoOutlinedIcon fontSize="small" />;
      break;

    default:
      color = "default";
      break;
  }

  return (
    <Chip
      size="small"
      color={color}
      icon={icon}
      label={label}
      sx={{
        fontWeight: 600,
        textTransform: "capitalize",
        px: 0.5,
      }}
    />
  );
}
