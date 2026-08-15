import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Typography,
  Box,
  Avatar,
  Paper,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
} from "@mui/material";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import GroupsIcon from "@mui/icons-material/Groups";
import TaskAltIcon from "@mui/icons-material/TaskAlt";

import ProgressBar from "./ProgressBar";

export default function ProgressDetailsDialog({ open, onClose, progressItem }) {
  if (!progressItem) return null;

  const {
    studentName = "Student",
    studentEmail = "N/A",
    teamName = "No team",
    projectName = "No project",
    projectDescription = "No project description provided.",
    completedTasks = 0,
    totalTasks = 0,
    progressPercentage = 0,
    status = "in_progress",
    taskList = [],
  } = progressItem;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        elevation: 0,
        sx: {
          borderRadius: 3,
          border: "1px solid #e2e8f0",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 800, color: "#0f172a", pt: 3, pb: 1 }}>
        Progress Details — {studentName}
      </DialogTitle>

      <DialogContent dividers sx={{ borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0", py: 3 }}>
        <Stack spacing={3}>
          {/* Student Header Summary Banner */}
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              bgcolor: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: 2.5,
            }}
          >
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="space-between" alignItems="center">
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  sx={{
                    bgcolor: "#eff6ff",
                    color: "#1e40af",
                    width: 52,
                    height: 52,
                    fontSize: 20,
                    fontWeight: 800,
                  }}
                >
                  {studentName.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight={800} color="#0f172a">
                    {studentName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {studentEmail}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                    <Chip
                      icon={<GroupsIcon fontSize="small" />}
                      label={teamName}
                      size="small"
                      variant="outlined"
                      sx={{ fontWeight: 600, borderRadius: 1.5 }}
                    />
                  </Stack>
                </Box>
              </Stack>

              <Box sx={{ minWidth: 200, width: { xs: "100%", sm: "auto" } }}>
                <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: "uppercase" }}>
                  Overall Progress
                </Typography>
                <ProgressBar value={progressPercentage} height={10} labelPosition="right" />
              </Box>
            </Stack>
          </Paper>

          {/* Project Progress Section */}
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              bgcolor: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: 2.5,
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
              <FolderOpenIcon sx={{ color: "#0284c7" }} />
              <Typography variant="subtitle1" fontWeight={800} color="#0f172a">
                Assigned Project: {projectName}
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {projectDescription}
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="space-between" alignItems="center">
              <Box sx={{ flexGrow: 1, width: "100%" }}>
                <ProgressBar value={progressPercentage} height={8} labelPosition="top" />
              </Box>
              <Chip
                icon={<TaskAltIcon fontSize="small" />}
                label={`${completedTasks} / ${totalTasks} Tasks Completed`}
                size="small"
                sx={{ bgcolor: "#f0fdf4", color: "#16a34a", fontWeight: 700, borderRadius: 1.5 }}
              />
            </Stack>
          </Paper>

          {/* Task Progress Breakdown */}
          <Box>
            <Typography variant="subtitle1" fontWeight={800} color="#0f172a" sx={{ mb: 1.5 }}>
              Task Deliverables Breakdown
            </Typography>
            {taskList.length === 0 ? (
              <Paper elevation={0} sx={{ p: 2.5, bgcolor: "#f8fafc", borderRadius: 2, border: "1px solid #e2e8f0", textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  No individual tasks logged for this student.
                </Typography>
              </Paper>
            ) : (
              <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 2 }}>
                <Table size="small">
                  <TableHead sx={{ bgcolor: "#f8fafc" }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Task Title</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: "#475569" }} align="right">
                        Completion
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {taskList.map((task, idx) => {
                      const tStatus = task.status || "pending";
                      const isDone = tStatus === "completed" || tStatus === "done";
                      return (
                        <TableRow key={task._id || task.id || idx} hover>
                          <TableCell>
                            <Typography variant="body2" fontWeight={600} color="#0f172a">
                              {task.title || task.name || `Task #${idx + 1}`}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={isDone ? "Completed" : tStatus === "in_progress" ? "In Progress" : "Pending"}
                              size="small"
                              sx={{
                                fontWeight: 700,
                                fontSize: "0.7rem",
                                bgcolor: isDone ? "#f0fdf4" : tStatus === "in_progress" ? "#eff6ff" : "#f8fafc",
                                color: isDone ? "#16a34a" : tStatus === "in_progress" ? "#1e40af" : "#64748b",
                                borderRadius: 1.5,
                              }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight={700} color={isDone ? "success.main" : "text.secondary"}>
                              {isDone ? "100%" : tStatus === "in_progress" ? "50%" : "0%"}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2.5, bgcolor: "#f8fafc" }}>
        <Button onClick={onClose} variant="contained" sx={{ fontWeight: 700, borderRadius: 2, px: 3 }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
