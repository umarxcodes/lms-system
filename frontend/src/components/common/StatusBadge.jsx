import React from "react";
import { Chip } from "@mui/material";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import RemoveIcon from "@mui/icons-material/Remove";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";

export default function StatusBadge({ status, variant, icon: CustomIcon, label: customLabel }) {
  const val = String(status || variant || "neutral").toLowerCase().trim().replace(/_/g, " ");

  let icon = null;
  let bg = "#F1F5F9";
  let color = "#475569";
  let label = customLabel || val.charAt(0).toUpperCase() + val.slice(1);

  switch (val) {
    case "present":
    case "completed":
    case "active":
    case "success":
      icon = <CheckCircleOutlinedIcon style={{ fontSize: 14 }} />;
      bg = "#ECFDF5";
      color = "#16A34A";
      break;

    case "absent":
    case "danger":
    case "failed":
    case "rejected":
      icon = <CancelOutlinedIcon style={{ fontSize: 14 }} />;
      bg = "#FEF2F2";
      color = "#DC2626";
      break;

    case "leave":
    case "late":
    case "warning":
      icon = <AccessTimeIcon style={{ fontSize: 14 }} />;
      bg = "#FFFBEB";
      color = "#D97706";
      break;

    case "pending":
    case "todo":
      icon = <RadioButtonUncheckedIcon style={{ fontSize: 14 }} />;
      bg = "#F8FAFC";
      color = "#64748B";
      break;

    case "in progress":
    case "inprogress":
      icon = <HourglassEmptyIcon style={{ fontSize: 14 }} />;
      bg = "#EFF6FF";
      color = "#2563EB";
      break;

    case "high":
    case "urgent":
      icon = <ArrowUpwardIcon style={{ fontSize: 14 }} />;
      bg = "#FEF2F2";
      color = "#DC2626";
      break;

    case "medium":
      icon = <RemoveIcon style={{ fontSize: 14 }} />;
      bg = "#FFFBEB";
      color = "#D97706";
      break;

    case "low":
      icon = <ArrowDownwardIcon style={{ fontSize: 14 }} />;
      bg = "#F1F5F9";
      color = "#64748B";
      break;

    default:
      bg = "#F1F5F9";
      color = "#475569";
      break;
  }

  if (CustomIcon) {
    icon = <CustomIcon style={{ fontSize: 14 }} />;
  }

  return (
    <Chip
      size="small"
      icon={icon}
      label={label}
      sx={{
        bgcolor: bg,
        color: color,
        fontWeight: 700,
        fontSize: "0.75rem",
        height: 24,
        px: 0.5,
        borderRadius: "6px",
        border: "1px solid",
        borderColor: `${color}20`,
        "& .MuiChip-icon": {
          color: color,
          ml: 0.5,
        },
      }}
    />
  );
}
