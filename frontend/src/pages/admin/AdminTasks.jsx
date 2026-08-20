import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
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
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ChecklistRtlIcon from "@mui/icons-material/ChecklistRtl";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CloseIcon from "@mui/icons-material/Close";
import AssignmentIcon from "@mui/icons-material/Assignment";

import PageHeader from "../../components/common/PageHeader";
import { PageContent } from "../../components/layout/AppLayout";
import StatusChip from "../../components/common/StatusChip";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import EmptyState from "../../components/common/EmptyState";
import FilterBar from "../../components/common/FilterBar";
import { taskApi } from "../../services/taskApi";
import { projectApi } from "../../services/projectApi";
import { studentApi } from "../../services/studentApi";
import { useToast } from "../../context/ToastContext";

export default function AdminTasks() {
  const [allTasks, setAllTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");

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

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const res = await taskApi.getTasks();
      if (res.success && res.data) {
        setAllTasks(Array.isArray(res.data) ? res.data : []);
      }
    } catch (err) {
      showToast(err?.message || "Failed to load tasks", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Derived Filtered Tasks List
  const filteredTasks = allTasks.filter((t) => {
    // Search Filter
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      const title = (t.title || "").toLowerCase();
      const desc = (t.description || "").toLowerCase();
      const projTitle = (t.project?.title || t.project?.name || t.projectId?.name || "").toLowerCase();
      const studentName = (t.assignedTo?.name || t.assignedTo?.user?.name || "").toLowerCase();
      const matches = title.includes(q) || desc.includes(q) || projTitle.includes(q) || studentName.includes(q);
      if (!matches) return false;
    }

    // Status Filter
    if (selectedStatus && t.status !== selectedStatus) {
      return false;
    }

    // Project Filter
    if (selectedProjectId) {
      const pId = t.project?._id || t.project || t.projectId?._id || t.projectId;
      if (pId !== selectedProjectId) return false;
    }

    // Priority Filter
    if (selectedPriority && (t.priority || "medium") !== selectedPriority) {
      return false;
    }

    return true;
  });

  useEffect(() => {
    projectApi.getProjects().then((res) => {
      if (res.success && res.data) setProjects(Array.isArray(res.data) ? res.data : []);
    });
    studentApi.getStudents({ limit: 500 }).then((res) => {
      if (res.success && res.data) {
        const items = Array.isArray(res.data) ? res.data : res.data.students || [];
        setStudents(items);
      }
    });
  }, []);

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("create") === "true") {
      setOpenCreateModal(true);
    }
  }, [location.search]);

  const handleOpenCreateModal = useCallback(() => {
    setFormData({
      title: "",
      description: "",
      projectId: projects.length > 0 ? projects[0]._id || projects[0].id : "",
      assignedTo: "",
      priority: "medium",
      dueDate: "",
    });
    setOpenCreateModal(true);
  }, [projects]);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.projectId) {
      showToast("Please enter a task title and select a project.", "warning");
      return;
    }
    setCreateSubmitting(true);
    try {
      const payload = {
        title: formData.title.trim(),
        projectId: formData.projectId,
      };

      if (formData.description?.trim()) {
        payload.description = formData.description.trim();
      }

      if (formData.assignedTo) {
        payload.assignedTo = formData.assignedTo;
      }

      if (formData.priority) {
        payload.priority = formData.priority;
      }

      if (formData.dueDate) {
        // Parse as local noon to ensure the deadline falls solidly within the
        // chosen calendar day in any timezone (avoids UTC-midnight edge cases).
        payload.deadline = new Date(`${formData.dueDate}T12:00:00.000Z`).toISOString();
      }

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
      <PageContent>
        <PageHeader
          title="Task Management"
          description="Assign, track, and review student deliverables across projects."
          breadcrumbs={[{ label: "Home", to: "/admin/dashboard" }, { label: "Tasks" }]}
          actions={
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreateModal}>
              Create Task
            </Button>
          }
        />

        {/* Clean Enterprise Filter Bar */}
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search tasks by title, description, or assigned student..."
          filters={[
            {
              key: "status",
              label: "Status",
              value: selectedStatus,
              onChange: setSelectedStatus,
              options: [
                { value: "", label: "All Statuses" },
                { value: "todo", label: "To Do" },
                { value: "in-progress", label: "In Progress" },
                { value: "done", label: "Completed / Done" },
              ],
            },
            {
              key: "project",
              label: "Project",
              value: selectedProjectId,
              onChange: setSelectedProjectId,
              options: [
                { value: "", label: "All Projects" },
                ...projects.map((p) => ({ value: p._id || p.id, label: p.title || p.name })),
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
            setSelectedProjectId("");
            setSelectedPriority("");
          }}
        />

        {loading ? (
          <Box sx={{ py: 6, textAlign: "center" }}>
            <CircularProgress color="primary" />
          </Box>
        ) : filteredTasks.length === 0 ? (
          <EmptyState
            title="No matching tasks"
            description="No tasks match your search criteria or active filter selections."
            icon={ChecklistRtlIcon}
            actionLabel="Create Task"
            onAction={handleOpenCreateModal}
          />
        ) : (
          <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 3, overflowX: "auto" }}>
            <Table>
              <TableHead sx={{ bgcolor: "#f8fafc" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Task Title</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Project</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Assigned Student</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Priority</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#475569" }} align="right">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTasks.map((t) => {
                  const projTitle = t.project?.title || t.project?.name || t.projectId?.name || "N/A";
                  const studentName = t.assignedTo?.name || t.assignedTo?.user?.name || "Unassigned";
                  const currentStatus = t.status || "todo";

                  return (
                    <TableRow key={t._id || t.id} hover>
                      <TableCell sx={{ fontWeight: 600 }}>{t.title}</TableCell>
                      <TableCell>{projTitle}</TableCell>
                      <TableCell>{studentName}</TableCell>
                      <TableCell>
                        <StatusChip status={t.priority || "medium"} />
                      </TableCell>
                      <TableCell>
                        <TextField
                          select
                          size="small"
                          value={currentStatus}
                          onChange={(e) => handleStatusChange(t._id || t.id, e.target.value)}
                          sx={{ width: 140 }}
                        >
                          <MenuItem value="todo">To Do</MenuItem>
                          <MenuItem value="in-progress">In Progress</MenuItem>
                          <MenuItem value="done">Done</MenuItem>
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

      {/* ─── Create Task Modal ─── */}
      <Dialog
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "16px",
            bgcolor: "#FFFFFF",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <DialogTitle sx={{ p: 2.5, pb: 1.5 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "10px",
                  bgcolor: "#EFF6FF",
                  color: "#2563EB",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <AssignmentIcon sx={{ fontSize: 22 }} />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: "#0F172A", lineHeight: 1.2 }}>
                  Create New Task
                </Typography>
                <Typography variant="caption" sx={{ color: "#64748B", fontSize: "0.75rem" }}>
                  Set up deliverables, assign trainees, and define project milestones
                </Typography>
              </Box>
            </Stack>
            <IconButton
              onClick={() => setOpenCreateModal(false)}
              size="small"
              sx={{ color: "#94A3B8", "&:hover": { color: "#0F172A", bgcolor: "#F1F5F9" } }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Stack>
        </DialogTitle>

        <Divider />

        <Box component="form" onSubmit={handleCreateSubmit}>
          <DialogContent sx={{ p: 3 }}>
            <Grid container spacing={2.5}>
              <Grid item xs={12}>
                <TextField
                  label="Task Title"
                  fullWidth
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Build User Authentication REST API"
                  InputProps={{
                    sx: { borderRadius: "10px" },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Description & Instructions"
                  fullWidth
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Provide technical guidelines, acceptance criteria, or reference links..."
                  InputProps={{
                    sx: { borderRadius: "10px" },
                  }}
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
                  InputProps={{
                    sx: { borderRadius: "10px" },
                  }}
                >
                  {projects.length === 0 ? (
                    <MenuItem value="" disabled>
                      No projects available (Create a project first)
                    </MenuItem>
                  ) : (
                    projects.map((p) => (
                      <MenuItem key={p._id || p.id} value={p._id || p.id}>
                        {p.title || p.name}
                      </MenuItem>
                    ))
                  )}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Assign Student"
                  select
                  fullWidth
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                  InputProps={{
                    sx: { borderRadius: "10px" },
                  }}
                >
                  <MenuItem value="">Unassigned (Open pool)</MenuItem>
                  {students.map((s) => (
                    <MenuItem key={s.user?._id || s._id || s.id} value={s.user?._id || s._id || s.id}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {s.name || s.user?.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#64748B" }}>
                          ({s.rollNumber || "Trainee"})
                        </Typography>
                      </Stack>
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Priority Level"
                  select
                  fullWidth
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  InputProps={{
                    sx: { borderRadius: "10px" },
                  }}
                >
                  <MenuItem value="low">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#16A34A" }} />
                      <span>Low Priority</span>
                    </Stack>
                  </MenuItem>
                  <MenuItem value="medium">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#D97706" }} />
                      <span>Medium Priority</span>
                    </Stack>
                  </MenuItem>
                  <MenuItem value="high">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#DC2626" }} />
                      <span>High Priority</span>
                    </Stack>
                  </MenuItem>
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
                  InputProps={{
                    sx: { borderRadius: "10px" },
                  }}
                />
              </Grid>
            </Grid>
          </DialogContent>

          <Divider />

          <DialogActions sx={{ p: 2.5, px: 3, bgcolor: "#F8FAFC" }}>
            <Button
              onClick={() => setOpenCreateModal(false)}
              disabled={createSubmitting}
              sx={{ fontWeight: 600, color: "#64748B", borderRadius: "8px", textTransform: "none" }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={createSubmitting}
              startIcon={createSubmitting ? <CircularProgress size={16} color="inherit" /> : <AddIcon />}
              sx={{
                fontWeight: 700,
                borderRadius: "8px",
                textTransform: "none",
                bgcolor: "#2563EB",
                px: 2.5,
                boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)",
                "&:hover": { bgcolor: "#1D4ED8" },
              }}
            >
              {createSubmitting ? "Creating Task..." : "Create Task"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* ─── Assign Student Modal ─── */}
      <Dialog
        open={openAssignModal}
        onClose={() => setOpenAssignModal(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "16px",
            bgcolor: "#FFFFFF",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <DialogTitle sx={{ p: 2.5, pb: 1.5 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: "10px",
                  bgcolor: "#EFF6FF",
                  color: "#2563EB",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <PersonAddIcon sx={{ fontSize: 20 }} />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: "#0F172A", fontSize: "1.05rem" }}>
                  Assign Task
                </Typography>
                <Typography variant="caption" sx={{ color: "#64748B" }}>
                  Select student to complete deliverable
                </Typography>
              </Box>
            </Stack>
            <IconButton
              onClick={() => setOpenAssignModal(false)}
              size="small"
              sx={{ color: "#94A3B8", "&:hover": { color: "#0F172A", bgcolor: "#F1F5F9" } }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Stack>
        </DialogTitle>

        <Divider />

        <Box component="form" onSubmit={handleAssignSubmit}>
          <DialogContent sx={{ p: 3 }}>
            <TextField
              label="Select Student"
              select
              fullWidth
              required
              value={assignStudentId}
              onChange={(e) => setAssignStudentId(e.target.value)}
              InputProps={{
                sx: { borderRadius: "10px" },
              }}
            >
              {students.map((s) => (
                <MenuItem key={s.user?._id || s._id || s.id} value={s.user?._id || s._id || s.id}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="body2" sx={{ fontWeight: 700, color: "#0F172A" }}>
                      {s.name || s.user?.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#64748B" }}>
                      ({s.rollNumber || "Student"})
                    </Typography>
                  </Stack>
                </MenuItem>
              ))}
            </TextField>
          </DialogContent>

          <Divider />

          <DialogActions sx={{ p: 2.5, px: 3, bgcolor: "#F8FAFC" }}>
            <Button
              onClick={() => setOpenAssignModal(false)}
              disabled={assignSubmitting}
              sx={{ fontWeight: 600, color: "#64748B", borderRadius: "8px", textTransform: "none" }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={assignSubmitting}
              startIcon={assignSubmitting ? <CircularProgress size={16} color="inherit" /> : null}
              sx={{
                fontWeight: 700,
                borderRadius: "8px",
                textTransform: "none",
                bgcolor: "#2563EB",
                px: 2.5,
                "&:hover": { bgcolor: "#1D4ED8" },
              }}
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
