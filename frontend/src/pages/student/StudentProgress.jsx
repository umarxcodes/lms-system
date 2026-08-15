import React, { useState, useEffect } from "react";
import {
  Grid,
  Paper,
  Typography,
  Box,
  Stack,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Skeleton,
} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";

import PageHeader from "../../components/common/PageHeader";
import { PageContent } from "../../components/layout/AppLayout";
import ProgressBar from "../../components/progress/ProgressBar";
import EmptyState from "../../components/common/EmptyState";
import { reportApi } from "../../services/reportApi";
import { taskApi } from "../../services/taskApi";
import { projectApi } from "../../services/projectApi";
import { useToast } from "../../context/ToastContext";

export default function StudentProgress() {
  const [report, setReport] = useState(null);
  const [myProject, setMyProject] = useState(null);
  const [myTasks, setMyTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    let isMounted = true;
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        const [reportRes, projectRes, tasksRes] = await Promise.allSettled([
          reportApi.getMyReport(),
          projectApi.getMyProject(),
          taskApi.getMyAssignedTasks(),
        ]);

        if (isMounted) {
          if (reportRes.status === "fulfilled" && reportRes.value.success) {
            setReport(reportRes.value.data);
          }
          if (projectRes.status === "fulfilled" && projectRes.value.success) {
            setMyProject(projectRes.value.data);
          }
          if (tasksRes.status === "fulfilled" && tasksRes.value.success) {
            setMyTasks(Array.isArray(tasksRes.value.data) ? tasksRes.value.data : []);
          }
        }
      } catch (err) {
        if (isMounted) showToast(err?.message || "Failed to load progress data", "error");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchStudentData();
    return () => {
      isMounted = false;
    };
  }, [showToast]);

  const attendanceScore = report?.attendancePercentage ?? 100;
  const taskScore = report?.taskCompletionPercentage ?? 0;
  const overallProgress = Math.round(attendanceScore * 0.4 + taskScore * 0.6);

  const completedTasks = myTasks.filter((t) => t.status === "completed" || t.status === "done").length;
  const totalTasks = myTasks.length;

  return (
    <PageContent px={{ xs: 2, sm: 3, md: 4 }}>
      {/* Page Header */}
      <PageHeader
        breadcrumbs={[{ label: "Dashboard", to: "/student/dashboard" }, { label: "My Progress" }]}
        title="My Progress"
        description="Monitor your overall standing, capstone project velocity, and deliverable completion status."
      />

      {loading ? (
        <Box sx={{ py: 6, textAlign: "center" }}>
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <Stack spacing={3}>
          {/* My Overall Progress Card */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              bgcolor: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: 2.5,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a", mb: 2 }}>
              My Overall Progress
            </Typography>

            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={6}>
                <Box sx={{ p: 2.5, bgcolor: "#f8fafc", borderRadius: 2, border: "1px solid #e2e8f0" }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: "uppercase" }}>
                    Combined Academic Score
                  </Typography>
                  <ProgressBar value={overallProgress} height={12} labelPosition="top" />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                    Weighted metric based on 40% session attendance and 60% task deliverables completion.
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Paper elevation={0} sx={{ p: 2, border: "1px solid #e2e8f0", borderRadius: 2, bgcolor: "#f0fdf4" }}>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                        <EventAvailableIcon sx={{ color: "#16a34a", fontSize: 20 }} />
                        <Typography variant="caption" fontWeight={700} color="#16a34a" sx={{ textTransform: "uppercase" }}>
                          Attendance
                        </Typography>
                      </Stack>
                      <Typography variant="h5" fontWeight={800} color="#16a34a">
                        {attendanceScore}%
                      </Typography>
                    </Paper>
                  </Grid>

                  <Grid item xs={6}>
                    <Paper elevation={0} sx={{ p: 2, border: "1px solid #e2e8f0", borderRadius: 2, bgcolor: "#eff6ff" }}>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                        <TaskAltIcon sx={{ color: "#1e40af", fontSize: 20 }} />
                        <Typography variant="caption" fontWeight={700} color="#1e40af" sx={{ textTransform: "uppercase" }}>
                          Tasks Done
                        </Typography>
                      </Stack>
                      <Typography variant="h5" fontWeight={800} color="#1e40af">
                        {Math.round(taskScore)}%
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Paper>

          {/* Current Project Progress */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              bgcolor: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: 2.5,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a", mb: 2 }}>
              Current Project Progress
            </Typography>

            {myProject ? (
              <Box sx={{ p: 2.5, bgcolor: "#f8fafc", borderRadius: 2, border: "1px solid #e2e8f0" }}>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                  <FolderIcon sx={{ color: "#1e40af" }} />
                  <Typography variant="subtitle1" fontWeight={800} color="#0f172a">
                    {myProject.name || myProject.title}
                  </Typography>
                  <Chip
                    label={myProject.status ? myProject.status.replace("-", " ").toUpperCase() : "IN PROGRESS"}
                    size="small"
                    sx={{ bgcolor: "#eff6ff", color: "#1e40af", fontWeight: 700, borderRadius: 1.5, ml: "auto" }}
                  />
                </Stack>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {myProject.description || "Active bootcamp development project."}
                </Typography>

                <Box sx={{ maxWidth: 450 }}>
                  <ProgressBar value={myProject.progress || 0} height={10} labelPosition="top" />
                </Box>
              </Box>
            ) : (
              <Box sx={{ p: 3, bgcolor: "#f8fafc", borderRadius: 2, border: "1px solid #e2e8f0", textAlign: "center" }}>
                <FolderIcon sx={{ fontSize: 36, color: "text.secondary", mb: 1 }} />
                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                  No active project assigned to your account yet.
                </Typography>
              </Box>
            )}
          </Paper>

          {/* Assigned Tasks Deliverables */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              bgcolor: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: 2.5,
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a" }}>
                My Assigned Tasks ({totalTasks})
              </Typography>
              <Chip
                label={`${completedTasks} / ${totalTasks} Completed`}
                size="small"
                sx={{ bgcolor: "#f0fdf4", color: "#16a34a", fontWeight: 700, borderRadius: 1.5 }}
              />
            </Stack>

            {myTasks.length === 0 ? (
              <EmptyState
                title="No Tasks Assigned"
                description="You currently have no tasks assigned to your profile."
                icon={HourglassTopIcon}
              />
            ) : (
              <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 2 }}>
                <Table size="small">
                  <TableHead sx={{ bgcolor: "#f8fafc" }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Task Title</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: "#475569" }} align="right">
                        Status Rate
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {myTasks.map((t) => {
                      const tStatus = t.status || "todo";
                      const isDone = tStatus === "completed" || tStatus === "done";
                      return (
                        <TableRow key={t._id || t.id} hover>
                          <TableCell>
                            <Typography variant="body2" fontWeight={700} color="#0f172a">
                              {t.title || t.name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={isDone ? "Completed" : tStatus === "in_progress" || tStatus === "in-progress" ? "In Progress" : "Pending"}
                              size="small"
                              sx={{
                                fontWeight: 700,
                                fontSize: "0.725rem",
                                bgcolor: isDone ? "#f0fdf4" : tStatus.includes("progress") ? "#eff6ff" : "#f8fafc",
                                color: isDone ? "#16a34a" : tStatus.includes("progress") ? "#1e40af" : "#64748b",
                                borderRadius: 1.5,
                              }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight={700} color={isDone ? "success.main" : "text.secondary"}>
                              {isDone ? "100%" : tStatus.includes("progress") ? "50%" : "0%"}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Stack>
      )}
    </PageContent>
  );
}
