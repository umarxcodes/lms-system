import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  Typography,
  Stack,
  TextField,
  MenuItem,
  CircularProgress,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import ChecklistRtlIcon from "@mui/icons-material/ChecklistRtl";
import { useOutletContext } from "react-router-dom";

import PageHeader from "../../components/common/PageHeader";
import { PageContent } from "../../components/layout/AppLayout";
import StatusChip from "../../components/common/StatusChip";
import EmptyState from "../../components/common/EmptyState";
import FilterBar from "../../components/common/FilterBar";
import { taskApi } from "../../services/taskApi";
import { useToast } from "../../context/ToastContext";

export default function StudentTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");

  const { showToast } = useToast();
  const { onMobileNavOpen } = useOutletContext() || {};

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

  // Filter student tasks dynamically
  const filteredTasks = tasks.filter((t) => {
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      const title = (t.title || "").toLowerCase();
      const projName = (t.project?.name || t.projectId?.name || "").toLowerCase();
      if (!title.includes(q) && !projName.includes(q)) return false;
    }

    if (selectedStatus && (t.status || "todo") !== selectedStatus) {
      return false;
    }

    if (selectedPriority && (t.priority || "medium") !== selectedPriority) {
      return false;
    }

    return true;
  });

  return (
    <PageContent>
      <PageHeader
        title="My Tasks & Deliverables"
        description="Update task statuses as you work through project requirements."
      />

      {/* Clean Enterprise Filter Bar */}
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search your tasks by title or project..."
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

      <Card elevation={0} sx={{ p: 3, borderRadius: 3.5, border: "1px solid #e2e8f0", bgcolor: "#ffffff" }}>
        {loading ? (
          <Box sx={{ py: 6, textAlign: "center" }}>
            <CircularProgress color="primary" />
          </Box>
        ) : filteredTasks.length === 0 ? (
          <EmptyState
            title="No tasks match your filters"
            description="Clear search or filter criteria to view your assigned deliverables."
            icon={ChecklistRtlIcon}
          />
        ) : (
          <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 2 }}>
            <Table>
              <TableHead sx={{ bgcolor: "#f8fafc" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Task Title</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Project</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Priority</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Update Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTasks.map((t) => (
                  <TableRow key={t._id || t.id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{t.title}</TableCell>
                    <TableCell>{t.project?.name || t.projectId?.name || "N/A"}</TableCell>
                    <TableCell>
                      <StatusChip status={t.priority || "medium"} />
                    </TableCell>
                    <TableCell>
                      <StatusChip status={t.status || "todo"} />
                    </TableCell>
                    <TableCell sx={{ width: 180 }}>
                      <TextField
                        select
                        size="small"
                        fullWidth
                        value={t.status || "todo"}
                        onChange={(e) => handleStatusChange(t._id || t.id, e.target.value)}
                        sx={{
                          "& .MuiOutlinedInput-root": { borderRadius: 2, fontSize: "0.875rem" },
                        }}
                      >
                        <MenuItem value="todo">To Do</MenuItem>
                        <MenuItem value="in_progress">In Progress</MenuItem>
                        <MenuItem value="under_review">Under Review</MenuItem>
                        <MenuItem value="completed">Completed</MenuItem>
                      </TextField>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>
    </PageContent>
  );
}
