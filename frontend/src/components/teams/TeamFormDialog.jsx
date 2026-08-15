import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  CircularProgress,
  Typography,
  Box,
} from "@mui/material";

export default function TeamFormDialog({ open, onClose, teamToEdit, onSubmit, submitting }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const isEditing = Boolean(teamToEdit);

  useEffect(() => {
    if (teamToEdit) {
      setName(teamToEdit.name || "");
      setDescription(teamToEdit.description || "");
    } else {
      setName("");
      setDescription("");
    }
  }, [teamToEdit, open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), description: description.trim() });
  };

  return (
    <Dialog
      open={open}
      onClose={submitting ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        elevation: 0,
        sx: {
          borderRadius: 3,
          border: "1px solid #e2e8f0",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 800, color: "#0f172a", pt: 3, pb: 1 }}>
        {isEditing ? "Edit Team Details" : "Create New Team"}
      </DialogTitle>
      
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent dividers sx={{ borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0", py: 3 }}>
          <Stack spacing={2.5}>
            <Typography variant="body2" color="text.secondary">
              {isEditing
                ? "Update the team name and description below."
                : "Fill in the team credentials to organize trainees into a new project squad."}
            </Typography>

            <TextField
              label="Team Name"
              placeholder="e.g. Team Alpha - Web Dev"
              fullWidth
              required
              variant="outlined"
              size="medium"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={submitting}
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: 2 },
              }}
            />

            <TextField
              label="Description (Optional)"
              placeholder="Provide a brief summary of the team's project focus or objectives..."
              fullWidth
              multiline
              rows={3.5}
              variant="outlined"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={submitting}
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: 2 },
              }}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 2.5, bgcolor: "#f8fafc" }}>
          <Button
            onClick={onClose}
            disabled={submitting}
            sx={{ fontWeight: 700, color: "#64748b", borderRadius: 2 }}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={submitting || !name.trim()}
            startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : null}
            sx={{
              fontWeight: 700,
              borderRadius: 2,
              px: 3,
              boxShadow: "none",
            }}
          >
            {submitting ? (isEditing ? "Saving..." : "Creating...") : (isEditing ? "Save Changes" : "Create Team")}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
