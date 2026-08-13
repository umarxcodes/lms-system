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
import { taskApi } from "../../services/taskApi";
import { useToast } from "../../context/ToastContext";

export default function StudentTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
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

  return (
    <PageContent>
      <PageHeader
        title="My Tasks & Deliverables"
        description="Update task statuses as you work through project requirements."
      />
        <Card sx={{ p: 3 }}>
          {loading ? (
            <Box sx={{ py: 6, textAlign: "center" }}>
              <CircularProgress color="primary" />
            </Box>
          ) : tasks.length === 0 ? (
            <EmptyState
              title="No assigned tasks"
              description="You have no tasks assigned to you at this time."
              icon={ChecklistRtlIcon}
            />
          ) : (
            <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
              <Table>
                <TableHead sx={{ bgcolor: "grey.50" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Task Title</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Project</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Priority</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Update Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tasks.map((t) => (
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
