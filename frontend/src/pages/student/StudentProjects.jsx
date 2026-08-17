import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Box,
  CircularProgress,
  LinearProgress,
  Paper,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
} from "@mui/material";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import GroupsIcon from "@mui/icons-material/GroupsOutlined";
import CalendarTodayIcon from "@mui/icons-material/CalendarTodayOutlined";
import ChecklistIcon from "@mui/icons-material/ChecklistOutlined";

import PageHeader from "../../components/common/PageHeader";
import { PageContent } from "../../components/layout/AppLayout";
import StatusChip from "../../components/common/StatusChip";
import EmptyState from "../../components/common/EmptyState";
import { projectApi } from "../../services/projectApi";
import { taskApi } from "../../services/taskApi";
import { useToast } from "../../context/ToastContext";

export default function StudentProjects() {
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    let isMounted = true;
    const fetchStudentProject = async () => {
      try {
        setLoading(true);
        const res = await projectApi.getMyProject();
        if (isMounted && res.success && res.data) {
          // getMyProject returns an array or single project doc
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

  const projTitle = project?.title || project?.name;
  const teamName = project?.team?.name || project?.teamId?.name || "My Team";
  const progress = Math.min(100, Math.max(0, project?.progress || 0));
  const completedTasks = tasks.filter((t) => t.status === "done").length;
  const totalTasks = tasks.length;

  const formattedDeadline = project?.deadline
    ? new Date(project.deadline).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <PageContent>
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", to: "/student/dashboard" },
          { label: "My Project" },
        ]}
        title="My Team Project"
        description="Track assigned capstone project deliverables, milestones, and progress."
      />

      {loading ? (
        <Box sx={{ py: 8, textAlign: "center" }}>
          <CircularProgress color="primary" />
        </Box>
      ) : !project ? (
        <EmptyState
          title="No project assigned yet"
          description="Your team has not been assigned a project deliverables package by course management."
          icon={FolderOpenIcon}
        />
      ) : (
        <Grid container spacing={3}>
          {/* Main Project Card */}
          <Grid item xs={12} lg={8}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 3,
                border: "1px solid #e2e8f0",
                bgcolor: "#ffffff",
                mb: 3,
              }}
            >
              <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: "#0f172a", mb: 1 }}>
                      {projTitle}
                    </Typography>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <StatusChip status={project.status || "pending"} />
                      <Chip
                        icon={<GroupsIcon sx={{ fontSize: "16px !important", color: "#1e40af" }} />}
                        label={teamName}
                        size="small"
                        sx={{ bgcolor: "#eff6ff", color: "#1e40af", fontWeight: 700, borderRadius: 1.5 }}
                      />
                    </Stack>
                  </Box>
                </Stack>

                <Typography variant="body1" color="#475569" sx={{ mb: 4, lineHeight: 1.6 }}>
                  {project.description || "No project description provided."}
                </Typography>

                {/* Progress Bar */}
                <Box sx={{ p: 2.5, bgcolor: "#f8fafc", borderRadius: 2, border: "1px solid #e2e8f0" }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                    <Typography variant="caption" fontWeight={700} color="#64748b" sx={{ textTransform: "uppercase" }}>
                      Team Deliverable Progress
                    </Typography>
                    <Typography variant="subtitle1" fontWeight={800} color="#1e40af">
                      {Math.round(progress)}%
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      bgcolor: "#e2e8f0",
                      mb: 1.5,
                      "& .MuiLinearProgress-bar": { borderRadius: 5, bgcolor: "#1e40af" },
                    }}
                  />
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="caption" color="text.secondary">
                      Completed: <strong>{completedTasks} tasks</strong>
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Total: <strong>{totalTasks} tasks</strong>
                    </Typography>
                  </Stack>
                </Box>
              </CardContent>
            </Card>

            {/* Tasks Table */}
            <Paper elevation={0} sx={{ p: 3, bgcolor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 2.5 }}>
              <Typography variant="h6" fontWeight={800} color="#0f172a" sx={{ mb: 2 }}>
                Team Task Milestones ({tasks.length})
              </Typography>
              {tasks.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                  No individual tasks created for this project yet.
                </Typography>
              ) : (
                <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 2 }}>
                  <Table size="small">
                    <TableHead sx={{ bgcolor: "#f8fafc" }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Task Title</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Assignee</TableCell>
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
          </Grid>

          {/* Sidebar Metadata Card */}
          <Grid item xs={12} lg={4}>
            <Card elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid #e2e8f0", bgcolor: "#ffffff" }}>
              <Typography variant="h6" fontWeight={800} color="#0f172a" sx={{ mb: 2 }}>
                Project Metadata
              </Typography>

              <Box sx={{ mb: 2.5 }}>
                <Typography variant="caption" fontWeight={700} color="#64748b" display="block" sx={{ mb: 0.5, textTransform: "uppercase" }}>
                  Assigned Team
                </Typography>
                <Typography variant="body1" fontWeight={700} color="#0f172a">
                  {teamName}
                </Typography>
              </Box>

              {formattedDeadline && (
                <Box sx={{ mb: 2.5 }}>
                  <Typography variant="caption" fontWeight={700} color="#64748b" display="block" sx={{ mb: 0.5, textTransform: "uppercase" }}>
                    Submission Deadline
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CalendarTodayIcon sx={{ fontSize: 16, color: "#1e40af" }} />
                    <Typography variant="body1" fontWeight={700} color="#0f172a">
                      {formattedDeadline}
                    </Typography>
                  </Stack>
                </Box>
              )}

              <Box sx={{ p: 2, bgcolor: "#eff6ff", borderRadius: 2, border: "1px solid #dbeafe" }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                  <ChecklistIcon sx={{ color: "#1e40af", fontSize: 18 }} />
                  <Typography variant="subtitle2" fontWeight={700} color="#1e3a8a">
                    Deliverable Tip
                  </Typography>
                </Stack>
                <Typography variant="caption" color="#1e40af" sx={{ lineHeight: 1.4, display: "block" }}>
                  Complete assigned task items in your Task Management board to automatically update your team's overall completion rate.
                </Typography>
              </Box>
            </Card>
          </Grid>
        </Grid>
      )}
    </PageContent>
  );
}
