import React, { useState, useEffect, useCallback } from "react";
import {
  Grid,
  Button,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Box,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import { useNavigate } from "react-router-dom";

import PageHeader from "../../components/common/PageHeader";
import { PageContent } from "../../components/layout/AppLayout";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import EmptyState from "../../components/common/EmptyState";
import { ProjectCard, ProjectCardSkeleton } from "../../components/projects/ProjectCard";
import { projectApi } from "../../services/projectApi";
import { teamApi } from "../../services/teamApi";
import { useToast } from "../../context/ToastContext";

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  // Create Project Modal State
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [createSubmitting, setCreateSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    teamId: "",
    deadline: "",
  });

  // Delete State
  const [deleteId, setDeleteId] = useState(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  const { showToast } = useToast();
  const navigate = useNavigate();

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const res = await projectApi.getProjects();
      if (res.success && res.data) {
        setProjects(Array.isArray(res.data) ? res.data : []);
      }
    } catch (err) {
      showToast(err?.message || "Failed to load projects", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchProjects();
    teamApi.getTeams().then((res) => {
      if (res.success && res.data) {
        setTeams(Array.isArray(res.data) ? res.data : []);
      }
    });
  }, [fetchProjects]);

  const handleOpenCreateModal = () => {
    navigate("/admin/projects/create");
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.teamId) {
      showToast("Please enter a project title and select a team.", "warning");
      return;
    }

    setCreateSubmitting(true);
    try {
      const payload = {
        title: formData.title.trim(),
        teamId: formData.teamId,
      };
      if (formData.description?.trim()) {
        payload.description = formData.description.trim();
      }
      if (formData.deadline) {
        payload.deadline = new Date(formData.deadline).toISOString();
      }

      await projectApi.createProject(payload);
      showToast("Project created successfully!", "success");
      setOpenCreateModal(false);
      fetchProjects();
    } catch (err) {
      showToast(err?.message || "Failed to create project", "error");
    } finally {
      setCreateSubmitting(false);
    }
  };

  const handleStatusChange = async (projectId, newStatus) => {
    try {
      await projectApi.updateProjectStatus(projectId, newStatus);
      showToast("Project status updated!", "success");
      fetchProjects();
    } catch (err) {
      showToast(err?.message || "Failed to update project status", "error");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setDeleteSubmitting(true);
    try {
      await projectApi.deleteProject(deleteId);
      showToast("Project deleted successfully!", "success");
      setDeleteId(null);
      fetchProjects();
    } catch (err) {
      if (err?.status === 409 || err?.message?.includes("task")) {
        showToast("Cannot delete project while it still has active tasks attached.", "error");
      } else {
        showToast(err?.message || "Failed to delete project", "error");
      }
    } finally {
      setDeleteSubmitting(false);
    }
  };

  return (
    <>
      <PageContent>
        <PageHeader
          title="Project Management"
          description="Assign, track, and review team capstone & module projects."
          actions={
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreateModal}>
              Create Project
            </Button>
          }
        />

        {loading ? (
          <Grid container spacing={3}>
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                <ProjectCardSkeleton />
              </Grid>
            ))}
          </Grid>
        ) : projects.length === 0 ? (
          <EmptyState
            title="No projects found"
            description="Create projects and assign them to teams to manage student deliverables."
            icon={FolderOpenIcon}
            actionLabel="Create Project"
            onAction={handleOpenCreateModal}
          />
        ) : (
          <Grid container spacing={3}>
            {projects.map((proj) => (
              <Grid item xs={12} sm={6} md={4} key={proj._id || proj.id}>
                <ProjectCard
                  project={proj}
                  onDelete={(id) => setDeleteId(id)}
                  onStatusChange={handleStatusChange}
                  onNavigateDetails={(id) => navigate(`/admin/projects/${id}`)}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </PageContent>

      {/* Create Project Modal */}
      <Dialog open={openCreateModal} onClose={() => setOpenCreateModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Create New Project</DialogTitle>
        <Box component="form" onSubmit={handleCreateSubmit}>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Project Title"
                  fullWidth
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Saylani LMS Full-Stack Web App"
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
                  placeholder="Enter project goals and requirements..."
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Assign Team"
                  select
                  fullWidth
                  required
                  value={formData.teamId}
                  onChange={(e) => setFormData({ ...formData, teamId: e.target.value })}
                >
                  {teams.length === 0 ? (
                    <MenuItem value="" disabled>
                      No teams available (Create a team first)
                    </MenuItem>
                  ) : (
                    teams.map((t) => (
                      <MenuItem key={t._id || t.id} value={t._id || t.id}>
                        {t.name}
                      </MenuItem>
                    ))
                  )}
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
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setOpenCreateModal(false)} disabled={createSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={createSubmitting}
              startIcon={createSubmitting ? <CircularProgress size={16} color="inherit" /> : null}
            >
              {createSubmitting ? "Creating..." : "Create Project"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete Project"
        description="Are you sure you want to delete this project? Projects containing tasks cannot be deleted."
        loading={deleteSubmitting}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteId(null)}
      />
    </>
  );
}
