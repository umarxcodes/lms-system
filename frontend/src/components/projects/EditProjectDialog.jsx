import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
  Box,
  CircularProgress,
} from "@mui/material";

export function EditProjectDialog({ open, project, teams = [], onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    teamId: "",
    status: "pending",
    deadline: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (project) {
      const formattedDate = project.deadline
        ? new Date(project.deadline).toISOString().split("T")[0]
        : "";
      setFormData({
        title: project.title || project.name || "",
        description: project.description || "",
        teamId: project.team?._id || project.team || project.teamId?._id || project.teamId || "",
        status: project.status || "pending",
        deadline: formattedDate,
      });
      setErrors({});
    }
  }, [project, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setErrors({ title: "Project title is required" });
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description?.trim() || "",
        status: formData.status,
      };
      if (formData.teamId) {
        payload.teamId = formData.teamId;
      }
      if (formData.deadline) {
        payload.deadline = new Date(formData.deadline).toISOString();
      } else {
        payload.deadline = null;
      }

      await onSave(project._id || project.id, payload);
      onClose();
    } catch (err) {
      // Error handled by parent toast
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ fontWeight: 800 }}>Edit Project Details</DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Project Title"
                fullWidth
                required
                value={formData.title}
                onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value });
                  if (errors.title) setErrors({});
                }}
                error={Boolean(errors.title)}
                helperText={errors.title}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Assign Team"
                select
                fullWidth
                value={formData.teamId}
                onChange={(e) => setFormData({ ...formData, teamId: e.target.value })}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              >
                {teams.map((t) => (
                  <MenuItem key={t._id || t.id} value={t._id || t.id}>
                    {t.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Project Status"
                select
                fullWidth
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="in-progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Deadline"
                type="date"
                fullWidth
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                InputLabelProps={{ shrink: true }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, bgcolor: "#f8fafc" }}>
          <Button onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : null}
            sx={{ fontWeight: 700, borderRadius: 2 }}
          >
            {submitting ? "Saving Changes..." : "Save Changes"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
