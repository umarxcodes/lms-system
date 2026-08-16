import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Grid,
  Skeleton,
  LinearProgress,
  Chip,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import GitHubIcon from "@mui/icons-material/GitHub";
import LaunchIcon from "@mui/icons-material/Launch";
import FolderIcon from "@mui/icons-material/Folder";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";

import PageHeader from "../../components/common/PageHeader";
import { PageContent } from "../../components/layout/AppLayout";
import StatusChip from "../../components/common/StatusChip";
import { projectApi } from "../../services/projectApi";
import { taskApi } from "../../services/taskApi";
import { useToast } from "../../context/ToastContext";

export default function AdminProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { onMobileNavOpen } = useOutletContext() || {};

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchProjectDetails = async () => {
      try {
        setLoading(true);
        const [projRes, tasksRes] = await Promise.all([
          projectApi.getProjectById(id),
          taskApi.getTasks(),
        ]);

        if (isMounted) {
          if (projRes.success) setProject(projRes.data);
          if (tasksRes.success && Array.isArray(tasksRes.data)) {
            // Filter tasks belonging to this project
            const projTasks = tasksRes.data.filter(
              (t) => t.project?._id === id || t.projectId === id || t.projectId?._id === id
            );
            setTasks(projTasks);
          }
        }
      } catch (err) {
        if (isMounted) showToast(err?.message || "Failed to load project details", "error");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProjectDetails();
    return () => {
      isMounted = false;
    };
  }, [id, showToast]);

  const teamName = project?.team?.name || project?.teamId?.name || "Unassigned Team";
  const progress = project?.progress || 0;

  return (
    <PageContent>
      <PageHeader
        title={`Project: ${project?.title || project?.name || "Project Detail"}`}
        description={`Assigned Team: ${teamName}`}
        actions={
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/admin/projects")}>
            Back to Projects
          </Button>
        }
      />
        {loading ? (
          <Skeleton variant="rounded" height={200} />
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card sx={{ p: 3, mb: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                      {project?.title || project?.name}
                    </Typography>
                    <StatusChip status={project?.status || "planning"} />
                  </Box>

                  <Stack direction="row" spacing={1}>
                    {project?.repoUrl && (
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<GitHubIcon />}
                        href={project.repoUrl}
                        target="_blank"
                      >
                        Repo
                      </Button>
                    )}
                    {project?.liveUrl && (
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<LaunchIcon />}
                        href={project.liveUrl}
                        target="_blank"
                      >
                        Live Demo
                      </Button>
                    )}
                  </Stack>
                </Stack>

                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  {project?.description || "No project description provided."}
                </Typography>

                <Box sx={{ mt: 2 }}>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                    <Typography variant="body2" fontWeight={600} color="text.secondary">
                      Overall Progress
                    </Typography>
                    <Typography variant="body2" fontWeight={700} color="primary.main">
                      {Math.round(progress)}%
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(100, Math.max(0, progress))}
                    sx={{ height: 8, borderRadius: 4, bgcolor: "grey.100" }}
                  />
                </Box>
              </Card>

              {/* Tasks List */}
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Project Tasks ({tasks.length})
                </Typography>
                {tasks.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                    No tasks created for this project yet.
                  </Typography>
                ) : (
                  <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
                    <Table size="small">
                      <TableHead sx={{ bgcolor: "grey.50" }}>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 700 }}>Task Title</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Assigned To</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Priority</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {tasks.map((t) => (
                          <TableRow key={t._id || t.id}>
                            <TableCell sx={{ fontWeight: 600 }}>{t.title}</TableCell>
                            <TableCell>{t.assignedTo?.name || t.assignedTo?.user?.name || "Unassigned"}</TableCell>
                            <TableCell>
                              <StatusChip status={t.priority || "medium"} />
                            </TableCell>
                            <TableCell>
                              <StatusChip status={t.status || "todo"} />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Team Overview
                </Typography>
                <Typography variant="subtitle1" fontWeight={700} color="primary.main" sx={{ mb: 1 }}>
                  {teamName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Members work together on completing task milestones to drive project progress.
                </Typography>
              </Card>
            </Grid>
          </Grid>
        )}
      </PageContent>
  );
}
