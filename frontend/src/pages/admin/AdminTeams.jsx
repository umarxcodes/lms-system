import React, { useState, useEffect, useCallback } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  IconButton,
  Chip,
  Box,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import GroupsIcon from "@mui/icons-material/Groups";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate, useOutletContext } from "react-router-dom";

import PageHeader from "../../components/common/PageHeader";
import { PageContent } from "../../components/layout/AppLayout";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import EmptyState from "../../components/common/EmptyState";
import { teamApi } from "../../services/teamApi";
import { useToast } from "../../context/ToastContext";

export default function AdminTeams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Create Modal State
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [createSubmitting, setCreateSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // Delete State
  const [deleteId, setDeleteId] = useState(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  const { showToast } = useToast();
  const navigate = useNavigate();
  const { onMobileNavOpen } = useOutletContext() || {};

  const fetchTeams = useCallback(async () => {
    try {
      setLoading(true);
      const res = await teamApi.getTeams({ search: search || undefined });
      if (res.success && res.data) {
        setTeams(Array.isArray(res.data) ? res.data : []);
      }
    } catch (err) {
      showToast(err?.message || "Failed to load teams", "error");
    } finally {
      setLoading(false);
    }
  }, [search, showToast]);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!name) return;
    setCreateSubmitting(true);
    try {
      await teamApi.createTeam({ name, description });
      showToast("Team created successfully!", "success");
      setName("");
      setDescription("");
      setOpenCreateModal(false);
      fetchTeams();
    } catch (err) {
      showToast(err?.message || "Failed to create team", "error");
    } finally {
      setCreateSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setDeleteSubmitting(true);
    try {
      await teamApi.deleteTeam(deleteId);
      showToast("Team deleted successfully!", "success");
      setDeleteId(null);
      fetchTeams();
    } catch (err) {
      if (err?.status === 409 || err?.message?.includes("member") || err?.message?.includes("project")) {
        showToast("Cannot delete team that still contains active members or an assigned project.", "error");
      } else {
        showToast(err?.message || "Failed to delete team", "error");
      }
    } finally {
      setDeleteSubmitting(false);
    }
  };

  return (
    <>
      <PageContent>
      <PageHeader
        title="Team Management"
        description="Organize bootcamp trainees into project development teams."
        actions={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenCreateModal(true)}
            sx={{ fontWeight: 600 }}
          >
            Create Team
          </Button>
        }
      />
        <Card sx={{ p: 3, mb: 3 }}>
          <TextField
            placeholder="Search teams by name..."
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: { xs: "100%", sm: 360 } }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Card>

        {loading ? (
          <Box sx={{ py: 6, textAlign: "center" }}>
            <CircularProgress color="primary" />
          </Box>
        ) : teams.length === 0 ? (
          <EmptyState
            title="No teams found"
            description="Create project teams to assign students and track development progress."
            icon={GroupsIcon}
            actionLabel="Create Team"
            onAction={() => setOpenCreateModal(true)}
          />
        ) : (
          <Grid container spacing={3}>
            {teams.map((team) => {
              const memberCount = team.members?.length || 0;
              return (
                <Grid item xs={12} sm={6} md={4} key={team._id || team.id}>
                  <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                    <CardContent sx={{ p: 3, flex: 1 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1.5 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          {team.name}
                        </Typography>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => setDeleteId(team._id || team.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Stack>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
                        {team.description || "No description provided."}
                      </Typography>

                      <Stack direction="row" spacing={1} alignItems="center">
                        <Chip
                          icon={<GroupsIcon fontSize="small" />}
                          label={`${memberCount} Member${memberCount === 1 ? "" : "s"}`}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </Stack>
                    </CardContent>

                    <Box sx={{ p: 2, bgcolor: "grey.50", borderTop: "1px solid", borderColor: "divider" }}>
                      <Button
                        fullWidth
                        size="small"
                        endIcon={<ArrowForwardIcon />}
                        onClick={() => navigate(`/admin/teams/${team._id || team.id}`)}
                      >
                        Manage Team
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </PageContent>

      {/* Create Team Dialog */}
      <Dialog open={openCreateModal} onClose={() => setOpenCreateModal(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Create New Team</DialogTitle>
        <Box component="form" onSubmit={handleCreateSubmit}>
          <DialogContent dividers>
            <Stack spacing={2}>
              <TextField
                label="Team Name"
                fullWidth
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Stack>
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
              {createSubmitting ? "Creating..." : "Create Team"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete Team"
        description="Are you sure you want to delete this team? Teams with active members or assigned projects cannot be deleted."
        loading={deleteSubmitting}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteId(null)}
      />
    </>
  );
}
