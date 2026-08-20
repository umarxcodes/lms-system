import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Grid,
  Skeleton,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  Tabs,
  Tab,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import CalendarTodayIcon from "@mui/icons-material/CalendarTodayOutlined";
import GroupsIcon from "@mui/icons-material/GroupsOutlined";
import FolderOpenIcon from "@mui/icons-material/FolderOpenOutlined";
import ChecklistIcon from "@mui/icons-material/ChecklistOutlined";
import { useParams, useNavigate } from "react-router-dom";

import PageHeader from "../../components/common/PageHeader";
import { PageContent } from "../../components/layout/AppLayout";
import StatusChip from "../../components/common/StatusChip";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { EditProjectDialog } from "../../components/projects/EditProjectDialog";
import { projectApi } from "../../services/projectApi";
import { taskApi } from "../../services/taskApi";
import { teamApi } from "../../services/teamApi";
import { useToast } from "../../context/ToastContext";

export default function AdminProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  // Edit & Delete State
  const [editingProject, setEditingProject] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  const fetchProjectDetails = useCallback(async () => {
    try {
      setLoading(true);
      const [projRes, tasksRes, teamsRes] = await Promise.all([
        projectApi.getProjectById(id),
        taskApi.getTasks(),
        teamApi.getTeams().catch(() => ({ data: [] })),
      ]);

      if (projRes.success && projRes.data) {
        setProject(projRes.data);

        // Fetch team members if team ID exists
        const teamId = projRes.data.team?._id || projRes.data.team || projRes.data.teamId;
        if (teamId) {
          try {
            const membersRes = await teamApi.getTeamMembers(teamId);
            if (membersRes.success && Array.isArray(membersRes.data)) {
              setTeamMembers(membersRes.data);
            }
          } catch (e) {
            setTeamMembers([]);
          }
        }
      }

      if (tasksRes.success && Array.isArray(tasksRes.data)) {
        const projTasks = tasksRes.data.filter(
          (t) =>
            t.project?._id === id ||
            t.project === id ||
            t.projectId === id ||
            t.projectId?._id === id
        );
        setTasks(projTasks);
      }

      if (teamsRes.success && Array.isArray(teamsRes.data)) {
        setTeams(teamsRes.data);
      }
    } catch (err) {
      showToast(err?.message || "Failed to load project details", "error");
    } finally {
      setLoading(false);
    }
  }, [id, showToast]);

  useEffect(() => {
    fetchProjectDetails();
  }, [fetchProjectDetails]);

  const handleSaveEdit = async (projectId, payload) => {
    try {
      await projectApi.updateProject(projectId, payload);
      showToast("Project details updated successfully!", "success");
      fetchProjectDetails();
    } catch (err) {
      showToast(err?.message || "Failed to update project", "error");
      throw err;
    }
  };

  const handleDeleteConfirm = async () => {
    setDeleteSubmitting(true);
    try {
      await projectApi.deleteProject(id);
      showToast("Project deleted successfully!", "success");
      navigate("/admin/projects");
    } catch (err) {
      if (err?.status === 409 || err?.message?.includes("task")) {
        showToast("Cannot delete project while it still has active tasks attached.", "error");
      } else {
        showToast(err?.message || "Failed to delete project", "error");
      }
    } finally {
      setDeleteSubmitting(false);
      setDeleteOpen(false);
    }
  };

  const projTitle = project?.title || project?.name || "Project Detail";
  const teamName = project?.team?.name || project?.teamId?.name || "Unassigned Team";
  const progress = project?.progress || 0;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "done").length;
  const remainingTasks = totalTasks - completedTasks;

  const formattedDeadline = project?.deadline
    ? new Date(project.deadline).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <>
      <PageContent>
        {/* Page Header */}
        <PageHeader
          breadcrumbs={[
            { label: "Home", to: "/admin/dashboard" },
            { label: "Projects", to: "/admin/projects" },
            { label: projTitle },
          ]}
          title={projTitle}
          description={`Assigned Team: ${teamName}`}
          actions={
            <Stack direction="row" spacing={1.5}>
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate("/admin/projects")}
                sx={{ borderRadius: 2, bgcolor: "#ffffff" }}
              >
                Back to Projects
              </Button>
              <Button
                variant="outlined"
                color="info"
                startIcon={<EditIcon />}
                onClick={() => setEditingProject(project)}
                sx={{ borderRadius: 2, bgcolor: "#ffffff" }}
              >
                Edit
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => setDeleteOpen(true)}
                sx={{ borderRadius: 2, bgcolor: "#ffffff" }}
              >
                Delete
              </Button>
            </Stack>
          }
        />

        {loading ? (
          <Skeleton variant="rounded" height={220} sx={{ borderRadius: 3 }} />
        ) : (
          <>
            {/* Overview Banner Card */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                mb: 3,
                bgcolor: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: 2.5,
              }}
            >
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={8}>
                  <Stack direction="row" spacing={2} alignItems="flex-start">
                    <Avatar
                      sx={{
                        width: 56,
                        height: 56,
                        bgcolor: "#eff6ff",
                        color: "#1e40af",
                        borderRadius: 2,
                      }}
                    >
                      <FolderOpenIcon fontSize="medium" />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                        <Typography variant="h5" fontWeight={800} color="#0f172a">
                          {projTitle}
                        </Typography>
                        <StatusChip status={project?.status || "pending"} />
                      </Stack>

                      <Typography variant="body2" color="#475569" sx={{ mb: 2, maxWidth: 720 }}>
                        {project?.description || "No project description provided."}
                      </Typography>

                      <Stack direction="row" spacing={2} flexWrap="wrap">
                        <Chip
                          icon={<GroupsIcon sx={{ fontSize: "16px !important", color: "#1e40af" }} />}
                          label={`Team: ${teamName}`}
                          size="small"
                          sx={{ bgcolor: "#eff6ff", color: "#1e40af", fontWeight: 700, borderRadius: 1.5 }}
                        />
                        {formattedDeadline && (
                          <Chip
                            icon={<CalendarTodayIcon sx={{ fontSize: "15px !important", color: "#475569" }} />}
                            label={`Due Date: ${formattedDeadline}`}
                            size="small"
                            variant="outlined"
                            sx={{ fontWeight: 600, borderRadius: 1.5 }}
                          />
                        )}
                      </Stack>
                    </Box>
                  </Stack>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Box sx={{ p: 2.5, bgcolor: "#f8fafc", borderRadius: 2, border: "1px solid #e2e8f0" }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                      <Typography variant="caption" fontWeight={700} color="#64748b" sx={{ textTransform: "uppercase" }}>
                        Completion Progress
                      </Typography>
                      <Typography variant="subtitle1" fontWeight={800} color="#1e40af">
                        {Math.round(progress)}%
                      </Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={progress}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: "#e2e8f0",
                        mb: 1.5,
                        "& .MuiLinearProgress-bar": { borderRadius: 4, bgcolor: "#1e40af" },
                      }}
                    />
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="caption" color="text.secondary">
                        Completed: <strong>{completedTasks}</strong>
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Total Tasks: <strong>{totalTasks}</strong>
                      </Typography>
                    </Stack>
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* Tab Navigation */}
            <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
              <Tabs value={activeTab} onChange={(e, val) => setActiveTab(val)}>
                <Tab icon={<ChecklistIcon fontSize="small" />} iconPosition="start" label={`Tasks & Milestones (${totalTasks})`} />
                <Tab icon={<GroupsIcon fontSize="small" />} iconPosition="start" label={`Team Roster (${teamMembers.length})`} />
              </Tabs>
            </Box>

            {/* Tab 0: Tasks List */}
            {activeTab === 0 && (
              <Paper elevation={0} sx={{ p: 3, bgcolor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 2.5 }}>
                <Typography variant="h6" fontWeight={800} color="#0f172a" sx={{ mb: 2 }}>
                  Project Tasks Breakdown
                </Typography>
                {tasks.length === 0 ? (
                  <Box sx={{ py: 6, textAlign: "center", border: "1px dashed #e2e8f0", borderRadius: 2 }}>
                    <ChecklistIcon sx={{ fontSize: 40, color: "text.secondary", mb: 1 }} />
                    <Typography variant="h6" color="text.secondary" fontWeight={700}>
                      No Tasks Created
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Tasks assigned to this project will be listed here with status tracking.
                    </Typography>
                  </Box>
                ) : (
                  <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 2 }}>
                    <Table size="small">
                      <TableHead sx={{ bgcolor: "#f8fafc" }}>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Task Title</TableCell>
                          <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Assignee</TableCell>
                          <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Priority</TableCell>
                          <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {tasks.map((t) => {
                          const assigneeName = t.assignedTo?.name || t.assignedTo?.user?.name || "Unassigned";
                          return (
                            <TableRow key={t._id || t.id} hover>
                              <TableCell sx={{ fontWeight: 700, color: "#0f172a" }}>{t.title}</TableCell>
                              <TableCell>
                                <Stack direction="row" spacing={1} alignItems="center">
                                  <Avatar sx={{ width: 24, height: 24, bgcolor: "#eff6ff", color: "#1e40af", fontSize: 11, fontWeight: 700 }}>
                                    {assigneeName.charAt(0)}
                                  </Avatar>
                                  <Typography variant="body2" color="text.secondary">
                                    {assigneeName}
                                  </Typography>
                                </Stack>
                              </TableCell>
                              <TableCell>
                                <StatusChip status={t.priority || "medium"} />
                              </TableCell>
                              <TableCell>
                                <StatusChip status={t.status || "todo"} />
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Paper>
            )}

            {/* Tab 1: Team Roster */}
            {activeTab === 1 && (
              <Paper elevation={0} sx={{ p: 3, bgcolor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 2.5 }}>
                <Typography variant="h6" fontWeight={800} color="#0f172a" sx={{ mb: 2 }}>
                  Assigned Team Roster: {teamName}
                </Typography>
                {teamMembers.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No individual member details available for this team.
                  </Typography>
                ) : (
                  <Grid container spacing={2}>
                    {teamMembers.map((m) => {
                      const name = m.name || m.user?.name || "Student";
                      const email = m.email || m.user?.email || "N/A";
                      const roll = m.rollNumber || "Trainee";
                      return (
                        <Grid item xs={12} sm={6} md={4} key={m._id || m.id}>
                          <Paper elevation={0} sx={{ p: 2, border: "1px solid #e2e8f0", borderRadius: 2, bgcolor: "#f8fafc" }}>
                            <Stack direction="row" spacing={1.5} alignItems="center">
                              <Avatar sx={{ width: 40, height: 40, bgcolor: "#eff6ff", color: "#1e40af", fontWeight: 700 }}>
                                {name.charAt(0)}
                              </Avatar>
                              <Box>
                                <Typography variant="subtitle2" fontWeight={700} color="#0f172a">
                                  {name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" display="block">
                                  {email}
                                </Typography>
                                <Typography variant="caption" color="primary.main" fontWeight={600}>
                                  {roll}
                                </Typography>
                              </Box>
                            </Stack>
                          </Paper>
                        </Grid>
                      );
                    })}
                  </Grid>
                )}
              </Paper>
            )}
          </>
        )}
      </PageContent>

      {/* Edit Dialog */}
      <EditProjectDialog
        open={Boolean(editingProject)}
        project={editingProject}
        teams={teams}
        onClose={() => setEditingProject(null)}
        onSave={handleSaveEdit}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteOpen}
        title="Delete Project?"
        description={`Are you sure you want to delete "${projTitle}"? Projects containing tasks cannot be removed.`}
        confirmText="Delete Project"
        confirmColor="error"
        loading={deleteSubmitting}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteOpen(false)}
      />
    </>
  );
}
