import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Grid, Button, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import { useNavigate } from "react-router-dom";

import PageHeader from "../../components/common/PageHeader";
import { PageContent } from "../../components/layout/AppLayout";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import EmptyState from "../../components/common/EmptyState";
import { ProjectCard, ProjectCardSkeleton } from "../../components/projects/ProjectCard";
import { ProjectSummaryCards } from "../../components/projects/ProjectSummaryCards";
import { ProjectToolbar } from "../../components/projects/ProjectToolbar";
import { EditProjectDialog } from "../../components/projects/EditProjectDialog";
import { projectApi } from "../../services/projectApi";
import { teamApi } from "../../services/teamApi";
import { useToast } from "../../context/ToastContext";

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search Controls
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [teamFilter, setTeamFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  // Edit Modal State
  const [editingProject, setEditingProject] = useState(null);

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

  const handleStatusChange = async (projectId, newStatus) => {
    try {
      await projectApi.updateProjectStatus(projectId, newStatus);
      showToast("Project status updated!", "success");
      fetchProjects();
    } catch (err) {
      showToast(err?.message || "Failed to update project status", "error");
    }
  };

  const handleSaveEdit = async (projectId, payload) => {
    try {
      await projectApi.updateProject(projectId, payload);
      showToast("Project details updated successfully!", "success");
      fetchProjects();
    } catch (err) {
      showToast(err?.message || "Failed to update project", "error");
      throw err;
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

  // Derived Filtered & Sorted Projects
  const filteredProjects = useMemo(() => {
    let result = [...projects];

    // Search filter
    if (search.trim()) {
      const query = search.toLowerCase().trim();
      result = result.filter((p) => {
        const title = (p.title || p.name || "").toLowerCase();
        const desc = (p.description || "").toLowerCase();
        const teamName = (p.team?.name || p.teamId?.name || "").toLowerCase();
        return title.includes(query) || desc.includes(query) || teamName.includes(query);
      });
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((p) => (p.status || "pending") === statusFilter);
    }

    // Team filter
    if (teamFilter !== "all") {
      result = result.filter((p) => {
        const tId = p.team?._id || p.team || p.teamId?._id || p.teamId;
        return tId === teamFilter;
      });
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "recent") {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
      if (sortBy === "deadline") {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline) - new Date(b.deadline);
      }
      if (sortBy === "title") {
        return (a.title || a.name || "").localeCompare(b.title || b.name || "");
      }
      if (sortBy === "progress") {
        return (b.progress || 0) - (a.progress || 0);
      }
      return 0;
    });

    return result;
  }, [projects, search, statusFilter, teamFilter, sortBy]);

  return (
    <>
      <PageContent>
        {/* Page Header */}
        <PageHeader
          breadcrumbs={[
            { label: "Dashboard", to: "/admin/dashboard" },
            { label: "Projects" },
          ]}
          title="Project Management"
          description="Assign, track, and review capstone and module projects across student teams."
          actions={
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleOpenCreateModal}
              sx={{ fontWeight: 700, borderRadius: 2 }}
            >
              Create Project
            </Button>
          }
        />

        {/* Project Summary Metric Row */}
        <ProjectSummaryCards projects={projects} loading={loading} />

        {/* Project Toolbar Controls */}
        <ProjectToolbar
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          teamFilter={teamFilter}
          onTeamFilterChange={setTeamFilter}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          teams={teams}
        />

        {/* Cards Grid / Empty State */}
        {loading ? (
          <Grid container spacing={3}>
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <Grid item xs={12} sm={6} lg={4} key={idx}>
                <ProjectCardSkeleton />
              </Grid>
            ))}
          </Grid>
        ) : projects.length === 0 ? (
          <EmptyState
            title="No projects yet"
            description="Create projects and assign them to teams to manage student deliverables."
            icon={FolderOpenIcon}
            actionLabel="Create Project"
            onAction={handleOpenCreateModal}
          />
        ) : filteredProjects.length === 0 ? (
          <EmptyState
            title="No matching projects found"
            description="No projects match your current search query or active filter selections."
            icon={SearchOffIcon}
            actionLabel="Clear Filters"
            onAction={() => {
              setSearch("");
              setStatusFilter("all");
              setTeamFilter("all");
            }}
          />
        ) : (
          <Grid container spacing={3}>
            {filteredProjects.map((proj) => (
              <Grid item xs={12} sm={6} lg={4} key={proj._id || proj.id}>
                <ProjectCard
                  project={proj}
                  onDelete={(id) => setDeleteId(id)}
                  onEdit={(p) => setEditingProject(p)}
                  onStatusChange={handleStatusChange}
                  onNavigateDetails={(id) => navigate(`/admin/projects/${id}`)}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </PageContent>

      {/* Edit Project Dialog */}
      <EditProjectDialog
        open={Boolean(editingProject)}
        project={editingProject}
        teams={teams}
        onClose={() => setEditingProject(null)}
        onSave={handleSaveEdit}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete Project?"
        description="Are you sure you want to delete this project? Projects containing attached tasks cannot be deleted."
        confirmText="Delete Project"
        confirmColor="error"
        loading={deleteSubmitting}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteId(null)}
      />
    </>
  );
}
