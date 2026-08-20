import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Box, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";

import PageHeader from "../../components/common/PageHeader";
import { PageContent } from "../../components/layout/AppLayout";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { teamApi } from "../../services/teamApi";
import { projectApi } from "../../services/projectApi";
import { useToast } from "../../context/ToastContext";

import TeamSummaryCards from "../../components/teams/TeamSummaryCards";
import TeamToolbar from "../../components/teams/TeamToolbar";
import TeamTable from "../../components/teams/TeamTable";
import TeamFormDialog from "../../components/teams/TeamFormDialog";
import ManageMembersDialog from "../../components/teams/ManageMembersDialog";

export default function AdminTeams() {
  const [teams, setTeams] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search and Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [projectFilter, setProjectFilter] = useState("all");

  // Dialog States
  const [openFormModal, setOpenFormModal] = useState(false);
  const [teamToEdit, setTeamToEdit] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  const [openManageModal, setOpenManageModal] = useState(false);
  const [teamToManage, setTeamToManage] = useState(null);

  const [deleteId, setDeleteId] = useState(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  const { showToast } = useToast();
  const navigate = useNavigate();

  // Fetch teams and projects data
  const fetchTeamsAndProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [teamsRes, projectsRes] = await Promise.allSettled([
        teamApi.getTeams({ search: search || undefined }),
        projectApi.getProjects(),
      ]);

      if (teamsRes.status === "fulfilled" && teamsRes.value.success) {
        setTeams(Array.isArray(teamsRes.value.data) ? teamsRes.value.data : []);
      } else if (teamsRes.status === "rejected") {
        throw new Error(teamsRes.reason?.message || "Failed to load teams");
      }

      if (projectsRes.status === "fulfilled" && projectsRes.value.success) {
        setProjects(Array.isArray(projectsRes.value.data) ? projectsRes.value.data : []);
      }
    } catch (err) {
      setError(err?.message || "Failed to load teams");
      showToast(err?.message || "Failed to load teams", "error");
    } finally {
      setLoading(false);
    }
  }, [search, showToast]);

  useEffect(() => {
    fetchTeamsAndProjects();
  }, [fetchTeamsAndProjects]);

  // Handle Create or Update Team Submit
  const handleFormSubmit = async (formData) => {
    setFormSubmitting(true);
    try {
      if (teamToEdit) {
        const tId = teamToEdit._id || teamToEdit.id;
        await teamApi.updateTeam(tId, formData);
        showToast("Team updated successfully!", "success");
      } else {
        await teamApi.createTeam(formData);
        showToast("Team created successfully!", "success");
      }
      setOpenFormModal(false);
      setTeamToEdit(null);
      fetchTeamsAndProjects();
    } catch (err) {
      showToast(err?.message || "Failed to save team", "error");
    } finally {
      setFormSubmitting(false);
    }
  };

  // Handle Delete Team Confirm
  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setDeleteSubmitting(true);
    try {
      await teamApi.deleteTeam(deleteId);
      showToast("Team deleted successfully!", "success");
      setDeleteId(null);
      fetchTeamsAndProjects();
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

  // Compute project assignment mapping
  const teamIdsWithProjects = useMemo(() => {
    const set = new Set();
    projects.forEach((p) => {
      const tId = p.team?._id || p.team?.id || p.teamId?._id || p.teamId?.id || p.team || p.teamId;
      if (tId) set.add(tId.toString());
    });
    return set;
  }, [projects]);

  // Filtered teams list based on search, status, and project filters
  const filteredTeams = useMemo(() => {
    return teams.filter((t) => {
      const tId = (t._id || t.id)?.toString();
      const memberCount = Array.isArray(t.members) ? t.members.length : 0;
      const hasProject = Boolean(t.project || (tId && teamIdsWithProjects.has(tId)));

      // Search Filter
      const matchesSearch = !search || t.name.toLowerCase().includes(search.toLowerCase());

      // Status Filter
      let matchesStatus = true;
      if (statusFilter === "active") matchesStatus = memberCount > 0;
      if (statusFilter === "empty") matchesStatus = memberCount === 0;

      // Project Filter
      let matchesProject = true;
      if (projectFilter === "assigned") matchesProject = hasProject;
      if (projectFilter === "unassigned") matchesProject = !hasProject;

      return matchesSearch && matchesStatus && matchesProject;
    });
  }, [teams, search, statusFilter, projectFilter, teamIdsWithProjects]);

  return (
    <PageContent px={{ xs: 2, sm: 3, md: 4 }}>
      {/* Page Header */}
      <PageHeader
        breadcrumbs={[{ label: "Home", to: "/admin/dashboard" }, { label: "Teams" }]}
        title="Team Management"
        description="Manage and organize bootcamp teams and their members."
        actions={
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => {
              setTeamToEdit(null);
              setOpenFormModal(true);
            }}
            sx={{ fontWeight: 700, borderRadius: 2, px: 2.5, boxShadow: "none" }}
          >
            Create Team
          </Button>
        }
      />

      {/* Summary Section KPIs */}
      <TeamSummaryCards loading={loading} teams={teams} projects={projects} />

      {/* Search & Filter Toolbar */}
      <TeamToolbar
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        projectFilter={projectFilter}
        onProjectFilterChange={setProjectFilter}
        onCreateClick={() => {
          setTeamToEdit(null);
          setOpenFormModal(true);
        }}
      />

      {/* Full-Width Team Table */}
      <TeamTable
        loading={loading}
        error={error}
        teams={filteredTeams}
        projects={projects}
        onRetry={fetchTeamsAndProjects}
        onViewTeam={(id) => navigate(`/admin/teams/${id}`)}
        onEditTeam={(team) => {
          setTeamToEdit(team);
          setOpenFormModal(true);
        }}
        onManageMembers={(team) => {
          setTeamToManage(team);
          setOpenManageModal(true);
        }}
        onDeleteTeam={(id) => setDeleteId(id)}
        onCreateTeam={() => {
          setTeamToEdit(null);
          setOpenFormModal(true);
        }}
      />

      {/* Create / Edit Team Form Dialog */}
      <TeamFormDialog
        open={openFormModal}
        onClose={() => {
          setOpenFormModal(false);
          setTeamToEdit(null);
        }}
        teamToEdit={teamToEdit}
        onSubmit={handleFormSubmit}
        submitting={formSubmitting}
      />

      {/* Manage Team Members Dialog */}
      <ManageMembersDialog
        open={openManageModal}
        onClose={() => {
          setOpenManageModal(false);
          setTeamToManage(null);
        }}
        team={teamToManage}
        onRosterUpdated={fetchTeamsAndProjects}
      />

      {/* Delete Team Confirmation Dialog */}
      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete Team?"
        description="Are you sure you want to delete this team? This action cannot be undone. Teams with active members or assigned projects cannot be deleted."
        confirmText="Delete Team"
        confirmColor="error"
        loading={deleteSubmitting}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteId(null)}
      />
    </PageContent>
  );
}
