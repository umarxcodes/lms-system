import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  Box,
  Typography,
} from "@mui/material";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import ActionButton from "./ActionButton";

/**
 * ConfirmDialog — Accessible confirmation modal with async support.
 *
 * - Handles async `onConfirm` with loading and error states.
 * - Destructive mode renders a red confirm button with a warning icon.
 * - Blocks closing while the action is in-flight.
 */
export default function ConfirmDialog({
  open,
  onClose,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmLabel = "Confirm",
  destructive = false,
  onConfirm,
}) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleClose = () => {
    if (loading) return;
    setErrorMsg("");
    onClose();
  };

  const handleConfirm = async () => {
    if (!onConfirm) return;
    try {
      setLoading(true);
      setErrorMsg("");
      await onConfirm();
      onClose();
    } catch (err) {
      setErrorMsg(err?.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ pb: 1, pt: 3, px: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {destructive && (
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                bgcolor: "error.50",
                color: "error.main",
                display: "grid",
                placeItems: "center",
                flexShrink: 0,
              }}
            >
              <WarningAmberRoundedIcon sx={{ fontSize: 20 }} />
            </Box>
          )}
          <Typography variant="h6" sx={{ fontWeight: 700, color: "text.primary", fontSize: "1rem" }}>
            {title}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pb: 1 }}>
        {errorMsg && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2, fontSize: "0.825rem" }}>
            {errorMsg}
          </Alert>
        )}
        <DialogContentText sx={{ color: "text.secondary", fontSize: "0.875rem", lineHeight: 1.6 }}>
          {description}
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 2, gap: 1 }}>
        <ActionButton variant="outlined" disabled={loading} onClick={handleClose}>
          Cancel
        </ActionButton>
        <ActionButton
          variant="contained"
          color={destructive ? "error" : "primary"}
          disabled={loading}
          onClick={handleConfirm}
        >
          {loading ? "Processing..." : confirmLabel}
        </ActionButton>
      </DialogActions>
    </Dialog>
  );
}
