import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  Typography,
  Stack,
  Box,
  LinearProgress,
  IconButton,
  Tooltip,
} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import GroupsIcon from "@mui/icons-material/Groups";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ChecklistIcon from "@mui/icons-material/Checklist";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import PageHeader from "../../components/common/PageHeader";
import { PageContent } from "../../components/layout/AppLayout";
import StatCard from "../../components/common/StatCard";
import StatusBadge from "../../components/common/StatusBadge";
import DataTable from "../../components/common/DataTable";
import ActionButton from "../../components/common/ActionButton";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { projectApi } from "../../services/projectApi";
import { taskApi } from "../../services/taskApi";
import { useToast } from "../../context/ToastContext";

export default function StudentProjects() {
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    let isMounted = true;
    const fetchStudentProject = async () => {
      try {
        setLoading(true);
        const res = await projectApi.getMyProject();
        if (isMounted && res.success && res.data) {
          const projData = Array.isArray(res.data) ? res.data[0] : res.data;
          setProject(projData);

          if (projData?._id) {
            const tasksRes = await taskApi.getTasks();
            if (isMounted && tasksRes.success && Array.isArray(tasksRes.data)) {
              const projTasks = tasksRes.data.filter(
                (t) => t.project?._id === projData._id || t.project === projData._id
              );
              setTasks(projTasks);
            }
          }
        }
      } catch (err) {
        if (isMounted && err?.status !== 404) {
          showToast(err?.message || "Failed to load team project", "error");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchStudentProject();
    return () => {
      isMounted = false;
    };
  }, [showToast]);

  const mockProject = {
    title: "Bootcamp LMS Portal Capstone",
    description: "Build an enterprise-grade Learning Management System with role-based auth, modern MUI/Tailwind UI design system, performance optimization, and REST API integration.",
    team: { name: "Team Alpha" },
    progress: 75,
    deadline: "2026-09-30",
    status: "in_progress",
  };

  const activeProject = project || mockProject;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => (t.status || "").toLowerCase() === "done" || (t.status || "").toLowerCase() === "completed").length;
  const progress = totalTasks > 0
    ? Math.round((completedTasks / totalTasks) * 100)
    : (activeProject.status === "completed" ? 100 : (activeProject.progress || 0));

  const columns = [
    {
      field: "title",
      label: "Milestone Deliverable",
      render: (row) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600, color: "#111827" }}>
            {row.title}
          </Typography>
          <Typography variant="caption" sx={{ color: "#64748B" }}>
            {row.description || "Core module requirement"}
          </Typography>
        </Box>
      ),
    },
    {
      field: "assignedTo",
      label: "Assignee",
      render: (row) => row.assignedTo?.name || "Ali Khan",
    },
    {
      field: "priority",
      label: "Priority",
      render: (row) => <StatusBadge status={row.priority || "high"} />,
    },
    {
      field: "status",
      label: "Status",
      render: (row) => <StatusBadge status={row.status || "completed"} />,
    },
    {
      field: "actions",
      label: "Actions",
      align: "right",
      render: (row) => (
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Tooltip title="View Milestone">
            <IconButton
              size="small"
              sx={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                color: "#2563EB",
                bgcolor: "#EFF6FF",
                border: "1px solid #DBEAFE",
                transition: "all 0.18s ease-in-out",
                "&:hover": { bgcolor: "#2563EB", color: "#FFFFFF" },
              }}
              onClick={() => showToast(`View: ${row.title}`, "info")}
            >
              <VisibilityIcon sx={{ fontSize: 17 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit Milestone">
            <IconButton
              size="small"
              sx={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                color: "#0284C7",
                bgcolor: "#F0F9FF",
                border: "1px solid #E0F2FE",
                transition: "all 0.18s ease-in-out",
                "&:hover": { bgcolor: "#0284C7", color: "#FFFFFF" },
              }}
              onClick={() => showToast(`Edit: ${row.title}`, "info")}
            >
              <EditIcon sx={{ fontSize: 17 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Remove Milestone">
            <IconButton
              size="small"
              sx={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                color: "#DC2626",
                bgcolor: "#FEF2F2",
                border: "1px solid #FEE2E2",
                transition: "all 0.18s ease-in-out",
                "&:hover": { bgcolor: "#DC2626", color: "#FFFFFF" },
              }}
              onClick={() => setDeleteId(row.id || row._id)}
            >
              <DeleteIcon sx={{ fontSize: 17 }} />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <PageContent>
      <PageHeader
        breadcrumbs={[{ label: "Home", to: "/student/dashboard" }, { label: "My Project" }]}
        title="Capstone Project Overview"
        description="Track your assigned team project milestones, overall progress, and technical submission requirements."
      />

      {/* Project Summary StatCards */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="PROJECT STATUS"
            value="In Progress"
            subtitle="Sprint Phase 3"
            icon={FolderIcon}
            iconBgColor="#EFF6FF"
            iconColor="#2563EB"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="OVERALL PROGRESS"
            value={`${Math.round(progress)}%`}
            subtitle="12 of 16 tasks complete"
            icon={ChecklistIcon}
            iconBgColor="#ECFDF5"
            iconColor="#16A34A"
            progress={progress}
            accentColor="#16A34A"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="ASSIGNED TEAM"
            value={activeProject.team?.name || "Team Alpha"}
            subtitle="4 Registered members"
            icon={GroupsIcon}
            iconBgColor="#F3E8FF"
            iconColor="#7C3AED"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="FINAL DEADLINE"
            value="30 Sep 2026"
            subtitle="42 Days remaining"
            icon={CalendarTodayIcon}
            iconBgColor="#FFFBEB"
            iconColor="#F59E0B"
          />
        </Grid>
      </Grid>

      {/* Main Capstone Project Detail Card */}
      <Card elevation={0} sx={{ p: 3.5, borderRadius: "12px", border: "1px solid #E2E8F0", bgcolor: "#FFFFFF", mb: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 700, color: "#111827", mb: 1 }}>
              {activeProject.title || activeProject.name}
            </Typography>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <StatusBadge status={activeProject.status || "in_progress"} />
              <StatusBadge status="brand" label={activeProject.team?.name || "Team Alpha"} icon={GroupsIcon} />
            </Stack>
          </Box>
          <ActionButton variant="contained" color="primary">
            Submit Deliverable
          </ActionButton>
        </Stack>

        <Typography variant="body1" sx={{ color: "#475569", mb: 3, lineHeight: 1.6 }}>
          {activeProject.description}
        </Typography>

        {/* Progress Bar Container */}
        <Box sx={{ p: 2.5, bgcolor: "#F8FAFC", borderRadius: "10px", border: "1px solid #E2E8F0" }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>
              Project Milestone Completion
            </Typography>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#2563EB" }}>
              {Math.round(progress)}%
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 10,
              borderRadius: 5,
              bgcolor: "#E2E8F0",
              "& .MuiLinearProgress-bar": { borderRadius: 5, bgcolor: "#2563EB" },
            }}
          />
        </Box>
      </Card>

      {/* Milestones & Deliverables Table */}
      <Card elevation={0} sx={{ p: 3, borderRadius: "12px", border: "1px solid #E2E8F0", bgcolor: "#FFFFFF" }}>
        <Typography variant="h3" sx={{ fontWeight: 600, color: "#111827", mb: 0.5 }}>
          Project Task Milestones
        </Typography>
        <Typography variant="body2" sx={{ color: "#64748B", mb: 2 }}>
          Individual task breakdown assigned to team members
        </Typography>

        <DataTable
          columns={columns}
          data={tasks}
          loading={loading}
          emptyTitle="No tasks assigned yet"
          emptyDescription="Project milestone tasks will appear here once your admin assigns them."
        />
      </Card>

      {/* Delete Modal */}
      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Remove Milestone"
        description="Are you sure you want to remove this project milestone?"
        confirmLabel="Remove Milestone"
        confirmColor="error"
        onConfirm={() => {
          showToast("Milestone removed", "info");
          setDeleteId(null);
        }}
        onClose={() => setDeleteId(null)}
      />
    </PageContent>
  );
}


