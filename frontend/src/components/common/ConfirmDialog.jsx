import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
} from "@mui/material";
import ActionButton from "./ActionButton";

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

  const handleConfirm = async () => {
    if (!onConfirm) return;
    try {
      setLoading(true);
      setErrorMsg("");
      await onConfirm();
      onClose();
    } catch (err) {
      setErrorMsg(err?.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, color: "#111827", pb: 1 }}>
        {title}
      </DialogTitle>
      <DialogContent>
        {errorMsg && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {errorMsg}
          </Alert>
        )}
        <DialogContentText sx={{ color: "#64748B", fontSize: "0.9rem" }}>
          {description}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <ActionButton
          variant="outlined"
          disabled={loading}
          onClick={onClose}
        >
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
