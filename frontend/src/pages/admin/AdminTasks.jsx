import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  Typography,
  Button,
  Stack,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  CircularProgress,
  IconButton,
  Box,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ChecklistRtlIcon from "@mui/icons-material/ChecklistRtl";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useOutletContext } from "react-router-dom";

import Header from "../../components/layout/Header";
import { PageContent } from "../../components/layout/AppLayout";
import StatusChip from "../../components/common/StatusChip";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import EmptyState from "../../components/common/EmptyState";
import { taskApi } from "../../services/taskApi";
import { projectApi } from "../../services/projectApi";
import { studentApi } from "../../services/studentApi";
import { useToast } from "../../context/ToastContext";

export default function AdminTasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("");

  // Create Task Modal State
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [createSubmitting, setCreateSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    projectId: "",
    assignedTo: "",
    priority: "medium",
    dueDate: "",
  });

  // Assign Modal State
  const [openAssignModal, setOpenAssignModal] = useState(false);
  const [assignTaskId, setAssignTaskId] = useState(null);
  const [assignStudentId, setAssignStudentId] = useState("");
  const [assignSubmitting, setAssignSubmitting] = useState(false);

  // Delete State
  const [deleteId, setDeleteId] = useState(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  const { showToast } = useToast();
  const { onMobileNavOpen } = useOutletContext() || {};

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const res = await taskApi.getTasks();
      if (res.success && res.data) {
        let items = Array.isArray(res.data) ? res.data : [];
        if (selectedStatus) {
          items = items.filter((t) => t.status === selectedStatus);
        }
        if (selectedProjectId) {
          items = items.filter((t) => (t.project?._id || t.projectId) === selectedProjectId);
        }
        setTasks(items);
      }
    } catch (err) {
      showToast(err?.message || "Failed to load tasks", "error");
    } finally {
      setLoading(false);
    }
  }, [selectedStatus, selectedProjectId, showToast]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    projectApi.getProjects().then((res) => {
      if (res.success && res.data) setProjects(Array.isArray(res.data) ? res.data : []);
    });
    studentApi.getStudents({ limit: 100 }).then((res) => {
      if (res.success && res.data) {
        const items = Array.isArray(res.data) ? res.data : res.data.students || [];
        setStudents(items);
      }
    });
  }, []);

  const handleOpenCreateModal = () => {
    setFormData({
      title: "",
      description: "",
      projectId: projects.length > 0 ? projects[0]._id || projects[0].id : "",
      assignedTo: "",
      priority: "medium",
      dueDate: "",
    });
    setOpenCreateModal(true);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.projectId) return;
    setCreateSubmitting(true);
    try {
      const payload = { ...formData };
      if (!payload.assignedTo) delete payload.assignedTo;
      if (!payload.dueDate) delete payload.dueDate;
      await taskApi.createTask(payload);
      showToast("Task created successfully!", "success");
      setOpenCreateModal(false);
      fetchTasks();
    } catch (err) {
      showToast(err?.message || "Failed to create task", "error");
    } finally {
      setCreateSubmitting(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskApi.updateTaskStatus(taskId, newStatus);
      showToast("Task status updated!", "success");
      fetchTasks();
    } catch (err) {
      showToast(err?.message || "Failed to update task status", "error");
    }
  };

  const handleOpenAssignModal = (task) => {
    setAssignTaskId(task._id || task.id);
    setAssignStudentId(task.assignedTo?._id || task.assignedTo || "");
    setOpenAssignModal(true);
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    if (!assignTaskId || !assignStudentId) return;
    setAssignSubmitting(true);
    try {
      await taskApi.assignTask(assignTaskId, assignStudentId);
      showToast("Task assigned successfully!", "success");
      setOpenAssignModal(false);
      fetchTasks();
    } catch (err) {
      showToast(err?.message || "Failed to assign task", "error");
    } finally {
      setAssignSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setDeleteSubmitting(true);
    try {
      await taskApi.deleteTask(deleteId);
      showToast("Task deleted successfully!", "success");
      setDeleteId(null);
      fetchTasks();
    } catch (err) {
      showToast(err?.message || "Failed to delete task", "error");
    } finally {
      setDeleteSubmitting(false);
    }
  };

  return (
    <>
      <Header
        title="Task Management"
        subtitle="Assign, track, and review student deliverables across projects."
        onMobileNavOpen={onMobileNavOpen}
        actions={
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreateModal}>
            Create Task
          </Button>
        }
      />

      <PageContent>
        <Card sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={2} sx={{ alignItems: "center" }}>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Filter by Status"
                select
                fullWidth
                size="small"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <MenuItem value="">All Statuses</MenuItem>
                <MenuItem value="todo">To Do</MenuItem>
                <MenuItem value="in_progress">In Progress</MenuItem>
                <MenuItem value="under_review">Under Review</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                label="Filter by Project"
                select
                fullWidth
                size="small"
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
              >
                <MenuItem value="">All Projects</MenuItem>
                {projects.map((p) => (
                  <MenuItem key={p._id || p.id} value={p._id || p.id}>
                    {p.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </Card>

        {loading ? (
          <Box sx={{ py: 6, textAlign: "center" }}>
            <CircularProgress color="primary" />
          </Box>
        ) : tasks.length === 0 ? (
          <EmptyState
            title="No tasks found"
            description="Create tasks under project modules and assign them to students."
            icon={ChecklistRtlIcon}
            actionLabel="Create Task"
            onAction={handleOpenCreateModal}
          />
        ) : (
          <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
            <Table>
              <TableHead sx={{ bgcolor: "grey.50" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Task Title</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Project</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Assigned To</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Priority</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.map((t) => {
                  const projName = t.project?.name || t.projectId?.name || "N/A";
                  const studentName = t.assignedTo?.name || t.assignedTo?.user?.name || "Unassigned";
                  return (
                    <TableRow key={t._id || t.id} hover>
                      <TableCell sx={{ fontWeight: 600 }}>{t.title}</TableCell>
                      <TableCell>{projName}</TableCell>
                      <TableCell>{studentName}</TableCell>
                      <TableCell>
                        <StatusChip status={t.priority || "medium"} />
                      </TableCell>
                      <TableCell>
                        <TextField
                          select
                          size="small"
                          value={t.status || "todo"}
                          onChange={(e) => handleStatusChange(t._id || t.id, e.target.value)}
                          sx={{ width: 130 }}
                        >
                          <MenuItem value="todo">To Do</MenuItem>
                          <MenuItem value="in_progress">In Progress</MenuItem>
                          <MenuItem value="under_review">Under Review</MenuItem>
                          <MenuItem value="completed">Completed</MenuItem>
                        </TextField>
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                          <Tooltip title="Assign Student">
                            <IconButton size="small" color="primary" onClick={() => handleOpenAssignModal(t)}>
                              <PersonAddIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Task">
                            <IconButton size="small" color="error" onClick={() => setDeleteId(t._id || t.id)}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </PageContent>

      {/* Create Task Modal */}
      <Dialog open={openCreateModal} onClose={() => setOpenCreateModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Create New Task</DialogTitle>
        <Box component="form" onSubmit={handleCreateSubmit}>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Task Title"
                  fullWidth
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Project"
                  select
                  fullWidth
                  required
                  value={formData.projectId}
                  onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                >
                  {projects.map((p) => (
                    <MenuItem key={p._id || p.id} value={p._id || p.id}>
                      {p.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Assign Student (Optional)"
                  select
                  fullWidth
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                >
                  <MenuItem value="">Unassigned</MenuItem>
                  {students.map((s) => (
                    <MenuItem key={s._id || s.id} value={s._id || s.id}>
                      {s.name || s.user?.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Priority"
                  select
                  fullWidth
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="urgent">Urgent</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Due Date"
                  type="date"
                  fullWidth
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
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
              {createSubmitting ? "Creating..." : "Create Task"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Assign Student Modal */}
      <Dialog open={openAssignModal} onClose={() => setOpenAssignModal(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Assign Task to Student</DialogTitle>
        <Box component="form" onSubmit={handleAssignSubmit}>
          <DialogContent dividers>
            <TextField
              label="Select Student"
              select
              fullWidth
              required
              value={assignStudentId}
              onChange={(e) => setAssignStudentId(e.target.value)}
            >
              {students.map((s) => (
                <MenuItem key={s._id || s.id} value={s._id || s.id}>
                  {s.name || s.user?.name} ({s.rollNumber || "No Roll #"})
                </MenuItem>
              ))}
            </TextField>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setOpenAssignModal(false)} disabled={assignSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={assignSubmitting}
              startIcon={assignSubmitting ? <CircularProgress size={16} color="inherit" /> : null}
            >
              {assignSubmitting ? "Assigning..." : "Assign Task"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete Task"
        description="Are you sure you want to delete this task? This action cannot be undone."
        loading={deleteSubmitting}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteId(null)}
      />
    </>
  );
}
