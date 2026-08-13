import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  LinearProgress,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { useOutletContext } from "react-router-dom";

import PageHeader from "../../components/common/PageHeader";
import { PageContent } from "../../components/layout/AppLayout";
import { projectApi } from "../../services/projectApi";
import { taskApi } from "../../services/taskApi";
import { useToast } from "../../context/ToastContext";

export default function AdminProgress() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const { onMobileNavOpen } = useOutletContext() || {};

  useEffect(() => {
    let isMounted = true;
    const fetchProgressData = async () => {
      try {
        setLoading(true);
        const [projRes, tasksRes] = await Promise.all([
          projectApi.getProjects(),
          taskApi.getTasks(),
        ]);

        if (isMounted) {
          if (projRes.success) setProjects(Array.isArray(projRes.data) ? projRes.data : []);
          if (tasksRes.success) setTasks(Array.isArray(tasksRes.data) ? tasksRes.data : []);
        }
      } catch (err) {
        if (isMounted) showToast(err?.message || "Failed to load progress data", "error");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProgressData();
    return () => {
      isMounted = false;
    };
  }, [showToast]);

  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const overallTaskProgress = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

  return (
    <PageContent>
      <PageHeader
        title="Bootcamp Progress Overview"
        description="Track team project completion rates and student deliverable milestones."
      />
        {/* Progress Summary Card */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3 }}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2.5,
                    bgcolor: "primary.50",
                    color: "primary.main",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <TrendingUpIcon fontSize="large" />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Overall Task Completion Rate
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {completedTasks} of {tasks.length} tasks completed across all projects
                  </Typography>
                </Box>
              </Stack>

              {loading ? (
                <Skeleton variant="rounded" height={40} />
              ) : (
                <Box sx={{ mt: 2 }}>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                    <Typography variant="body2" fontWeight={600} color="text.secondary">
                      Bootcamp Task Progress
                    </Typography>
                    <Typography variant="body2" fontWeight={700} color="primary.main">
                      {Math.round(overallTaskProgress)}%
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(100, Math.max(0, overallTaskProgress))}
                    sx={{ height: 10, borderRadius: 5, bgcolor: "grey.100" }}
                  />
                </Box>
              )}
            </Card>
          </Grid>
        </Grid>

        {/* Project Breakdown Table */}
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Project Progress Breakdown
          </Typography>

          {loading ? (
            <Skeleton variant="rounded" height={200} />
          ) : projects.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: "center" }}>
              No projects created yet.
            </Typography>
          ) : (
            <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
              <Table>
                <TableHead sx={{ bgcolor: "grey.50" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Project Title</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Team</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Completion Rate</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {projects.map((p) => {
                    const prog = p.progress || 0;
                    return (
                      <TableRow key={p._id || p.id} hover>
                        <TableCell sx={{ fontWeight: 600 }}>{p.name}</TableCell>
                        <TableCell>{p.team?.name || p.teamId?.name || "Unassigned"}</TableCell>
                        <TableCell>{p.status?.replace("_", " ").toUpperCase()}</TableCell>
                        <TableCell sx={{ width: 260 }}>
                          <Stack direction="row" spacing={1.5} alignItems="center">
                            <Box sx={{ flex: 1 }}>
                              <LinearProgress
                                variant="determinate"
                                value={Math.min(100, Math.max(0, prog))}
                                sx={{ height: 8, borderRadius: 4, bgcolor: "grey.100" }}
                              />
                            </Box>
                            <Typography variant="body2" fontWeight={700} color="primary.main">
                              {Math.round(prog)}%
                            </Typography>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Card>
      </PageContent>
  );
}
