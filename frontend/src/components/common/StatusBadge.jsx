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
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import PauseCircleOutlinedIcon from "@mui/icons-material/PauseCircleOutlined";

/**
 * StatusBadge — Unified semantic status chip.
 *
 * Accepts a `status` string and maps it to:
 * - Background color, text color, border color
 * - Contextual icon
 * - Readable label (auto-formatted, or overridden with `label`)
 *
 * Also accepts an optional `icon` prop to display a custom icon.
 */
export default function StatusBadge({ status, variant, icon: CustomIcon, label: customLabel, size = "small" }) {
  const val = String(status || variant || "neutral")
    .toLowerCase()
    .trim()
    .replace(/_/g, " ")
    .replace(/-/g, " ");

  let icon = null;
  let bg = "#F1F5F9";
  let color = "#475569";
  let border = "#CBD5E120";
  let label = customLabel || val.charAt(0).toUpperCase() + val.slice(1);

  switch (val) {
    // ── Positive / Success
    case "present":
    case "completed":
    case "done":
    case "active":
    case "approved":
    case "verified":
    case "submitted":
    case "success":
      icon = <CheckCircleOutlinedIcon style={{ fontSize: 13 }} />;
      bg = "#ECFDF5";
      color = "#15803D";
      border = "#16A34A22";
      break;

    // ── Negative / Error
    case "absent":
    case "danger":
    case "failed":
    case "rejected":
    case "inactive":
    case "overdue":
      icon = <CancelOutlinedIcon style={{ fontSize: 13 }} />;
      bg = "#FEF2F2";
      color = "#DC2626";
      border = "#DC262622";
      break;

    // ── Warning / Late
    case "leave":
    case "excused":
    case "late":
    case "warning":
    case "under review":
      icon = <AccessTimeIcon style={{ fontSize: 13 }} />;
      bg = "#FFFBEB";
      color = "#D97706";
      border = "#F59E0B22";
      break;

    // ── In Progress / Blue
    case "in progress":
    case "in-progress":
    case "inprogress":
    case "processing":
      icon = <HourglassEmptyIcon style={{ fontSize: 13 }} />;
      bg = "#EFF6FF";
      color = "#2563EB";
      border = "#2563EB22";
      break;

    // ── Pending / Gray
    case "pending":
    case "todo":
    case "to do":
    case "draft":
    case "new":
      icon = <RadioButtonUncheckedIcon style={{ fontSize: 13 }} />;
      bg = "#F8FAFC";
      color = "#64748B";
      border = "#94A3B822";
      break;

    // ── On Hold / Purple
    case "on hold":
    case "planning":
    case "paused":
      icon = <PauseCircleOutlinedIcon style={{ fontSize: 13 }} />;
      bg = "#FAF5FF";
      color = "#7C3AED";
      border = "#7C3AED22";
      break;

    // ── Info / Brand
    case "brand":
    case "secure auth":
    case "info":
      icon = <InfoOutlinedIcon style={{ fontSize: 13 }} />;
      bg = "#EFF6FF";
      color = "#2563EB";
      border = "#DBEAFE";
      break;

    // ── Priority: High / Urgent
    case "high":
    case "urgent":
    case "critical":
      icon = <ArrowUpwardIcon style={{ fontSize: 13 }} />;
      bg = "#FEF2F2";
      color = "#DC2626";
      border = "#DC262622";
      label = customLabel || val.charAt(0).toUpperCase() + val.slice(1);
      break;

    // ── Priority: Medium
    case "medium":
      icon = <RemoveIcon style={{ fontSize: 13 }} />;
      bg = "#FFFBEB";
      color = "#D97706";
      border = "#F59E0B22";
      break;

    // ── Priority: Low
    case "low":
      icon = <ArrowDownwardIcon style={{ fontSize: 13 }} />;
      bg = "#F1F5F9";
      color = "#64748B";
      border = "#94A3B822";
      break;

    default:
      break;
  }

  // Custom icon overrides the auto-selected one
  if (CustomIcon) {
    icon = <CustomIcon style={{ fontSize: 13 }} />;
  }

  return (
    <Chip
      size={size}
      icon={icon || undefined}
      label={label}
      sx={{
        bgcolor: bg,
        color,
        fontWeight: 700,
        fontSize: "0.72rem",
        height: size === "small" ? 24 : 28,
        px: 0.25,
        borderRadius: "6px",
        border: "1px solid",
        borderColor: border,
        letterSpacing: "0.01em",
        "& .MuiChip-icon": {
          color,
          ml: "4px",
          mr: "-2px",
        },
        "& .MuiChip-label": {
          px: "8px",
        },
      }}
    />
  );
}
