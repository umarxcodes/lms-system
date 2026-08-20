import React, { useState, useEffect, useCallback } from "react";
import {
  Grid,
  Typography,
  TextField,
  MenuItem,
  Box,
  IconButton,
  Tooltip,
  Stack,
} from "@mui/material";
import ChecklistRtlIcon from "@mui/icons-material/ChecklistRtl";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import PageHeader from "../../components/common/PageHeader";
import { PageContent } from "../../components/layout/AppLayout";
import StatCard from "../../components/common/StatCard";
import StatusBadge from "../../components/common/StatusBadge";
import DataTable from "../../components/common/DataTable";
import FilterBar from "../../components/common/FilterBar";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { taskApi } from "../../services/taskApi";
import { useToast } from "../../context/ToastContext";

export default function StudentTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const { showToast } = useToast();

  const fetchMyTasks = useCallback(async () => {
    try {
      setLoading(true);
      const res = await taskApi.getMyAssignedTasks();
      if (res.success && res.data) {
        setTasks(Array.isArray(res.data) ? res.data : []);
      }
    } catch (err) {
      showToast(err?.message || "Failed to load tasks", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchMyTasks();
  }, [fetchMyTasks]);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskApi.updateTaskStatus(taskId, newStatus);
      showToast("Task status updated successfully!", "success");
      fetchMyTasks();
    } catch (err) {
      showToast(err?.message || "Failed to update status", "error");
    }
  };

  const handleDeleteTask = async () => {
    if (!deleteId) return;
    try {
      await taskApi.deleteTask(deleteId);
      showToast("Task deliverable deleted!", "info");
      setDeleteId(null);
      fetchMyTasks();
    } catch (err) {
      showToast(err?.message || "Failed to delete task", "error");
    }
  };

  const filteredTasks = tasks.filter((t) => {
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      const title = (t.title || "").toLowerCase();
      const projName = (t.project?.name || t.projectId?.name || "").toLowerCase();
      if (!title.includes(q) && !projName.includes(q)) return false;
    }
    if (selectedStatus && (t.status || "todo") !== selectedStatus) return false;
    if (selectedPriority && (t.priority || "medium") !== selectedPriority) return false;
    return true;
  });

  const todoCount = tasks.filter((t) => t.status === "todo" || !t.status).length;
  const inProgressCount = tasks.filter((t) => t.status === "in_progress" || t.status === "in-progress").length;
  const reviewCount = tasks.filter((t) => t.status === "under_review").length;
  const completedCount = tasks.filter((t) => t.status === "completed" || t.status === "done").length;

  const columns = [
    {
      field: "title",
      label: "Task Title & Description",
      render: (row) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600, color: "#111827" }}>
            {row.title}
          </Typography>
          <Typography variant="caption" sx={{ color: "#64748B" }}>
            {row.description || "Deliverable submission"}
          </Typography>
        </Box>
      ),
    },
    {
      field: "project",
      label: "Project Context",
      render: (row) => (
        <Typography variant="body2" sx={{ fontWeight: 600, color: "#2563EB" }}>
          {row.project?.name || row.projectId?.name || "Capstone LMS Portal"}
        </Typography>
      ),
    },
    {
      field: "priority",
      label: "Priority",
      render: (row) => <StatusBadge status={row.priority || "medium"} />,
    },
    {
      field: "status",
      label: "Current Status",
      render: (row) => <StatusBadge status={row.status || "todo"} />,
    },
    {
      field: "action",
      label: "Update Status",
      render: (row) => (
        <TextField
          select
          size="small"
          value={row.status || "todo"}
          onChange={(e) => handleStatusChange(row._id || row.id, e.target.value)}
          sx={{
            minWidth: 130,
            "& .MuiOutlinedInput-root": { borderRadius: "8px", fontSize: "0.8rem", bgcolor: "#FFFFFF" },
          }}
        >
          <MenuItem value="todo">To Do</MenuItem>
          <MenuItem value="in_progress">In Progress</MenuItem>
          <MenuItem value="under_review">Under Review</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
        </TextField>
      ),
    },
    {
      field: "controls",
      label: "Actions",
      align: "right",
      render: (row) => (
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Tooltip title="View Task Details">
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
              onClick={() => showToast(`Task: ${row.title}`, "info")}
            >
              <VisibilityIcon sx={{ fontSize: 17 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit Deliverable">
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
              onClick={() => showToast(`Edit Task: ${row.title}`, "info")}
            >
              <EditIcon sx={{ fontSize: 17 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Deliverable">
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
              onClick={() => setDeleteId(row._id || row.id)}
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
        breadcrumbs={[{ label: "Home", to: "/student/dashboard" }, { label: "My Tasks" }]}
        title="My Tasks & Deliverables"
        description="Track your assigned sprint tasks, update statuses, and submit deliverables."
      />

      {/* KPI Stat Cards Header */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="TO DO TASKS"
            value={todoCount}
            subtitle="Pending start"
            icon={ChecklistRtlIcon}
            iconBgColor="#F1F5F9"
            iconColor="#64748B"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="IN PROGRESS"
            value={inProgressCount}
            subtitle="Active development"
            icon={HourglassEmptyIcon}
            iconBgColor="#EFF6FF"
            iconColor="#2563EB"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="UNDER REVIEW"
            value={reviewCount}
            subtitle="Awaiting evaluation"
            icon={RateReviewOutlinedIcon}
            iconBgColor="#FFFBEB"
            iconColor="#F59E0B"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="COMPLETED"
            value={completedCount}
            subtitle="Successfully verified"
            icon={CheckCircleOutlinedIcon}
            iconBgColor="#ECFDF5"
            iconColor="#16A34A"
          />
        </Grid>
      </Grid>

      {/* Search & Filters */}
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search tasks by title or project..."
        filters={[
          {
            key: "status",
            label: "Status",
            value: selectedStatus,
            onChange: setSelectedStatus,
            options: [
              { value: "", label: "All Statuses" },
              { value: "todo", label: "To Do" },
              { value: "in_progress", label: "In Progress" },
              { value: "under_review", label: "Under Review" },
              { value: "completed", label: "Completed" },
            ],
          },
          {
            key: "priority",
            label: "Priority",
            value: selectedPriority,
            onChange: setSelectedPriority,
            options: [
              { value: "", label: "All Priorities" },
              { value: "low", label: "Low" },
              { value: "medium", label: "Medium" },
              { value: "high", label: "High" },
            ],
          },
        ]}
        onReset={() => {
          setSearch("");
          setSelectedStatus("");
          setSelectedPriority("");
        }}
      />

      {/* Tasks DataTable */}
      <DataTable
        columns={columns}
        data={filteredTasks}
        loading={loading}
        emptyTitle="No tasks found"
        emptyDescription="You don't have any assigned tasks yet. Tasks will appear here once your admin assigns them to you."
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete Deliverable"
        description="Are you sure you want to remove this deliverable task?"
        confirmLabel="Delete Task"
        confirmColor="error"
        onConfirm={handleDeleteTask}
        onClose={() => setDeleteId(null)}
      />
    </PageContent>
  );
}


