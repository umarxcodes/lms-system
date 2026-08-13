import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Box,
  CircularProgress,
  LinearProgress,
} from "@mui/material";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import GitHubIcon from "@mui/icons-material/GitHub";
import LaunchIcon from "@mui/icons-material/Launch";
import { useOutletContext } from "react-router-dom";

import PageHeader from "../../components/common/PageHeader";
import { PageContent } from "../../components/layout/AppLayout";
import StatusChip from "../../components/common/StatusChip";
import EmptyState from "../../components/common/EmptyState";
import { projectApi } from "../../services/projectApi";
import { useToast } from "../../context/ToastContext";

export default function StudentProjects() {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const { onMobileNavOpen } = useOutletContext() || {};

  useEffect(() => {
    projectApi
      .getMyProject()
      .then((res) => {
        if (res.success && res.data) setProject(res.data);
      })
      .catch((err) => showToast(err?.message || "Failed to load project", "error"))
      .finally(() => setLoading(false));
  }, [showToast]);

  const progress = project?.progress || 0;

  return (
    <PageContent>
      <PageHeader
        title="My Team Project"
        description="Track project deliverables, repository links, and live deployments."
      />
        {loading ? (
          <Box sx={{ py: 6, textAlign: "center" }}>
            <CircularProgress color="primary" />
          </Box>
        ) : !project ? (
          <EmptyState
            title="No project assigned"
            description="Your team does not have an active project assigned yet."
            icon={FolderOpenIcon}
          />
        ) : (
          <Card sx={{ maxWidth: 720 }}>
            <CardContent sx={{ p: 4 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                    {project.name}
                  </Typography>
                  <StatusChip status={project.status || "planning"} />
                </Box>

                <Stack direction="row" spacing={1}>
                  {project.repoUrl && (
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<GitHubIcon />}
                      href={project.repoUrl}
                      target="_blank"
                    >
                      Repository
                    </Button>
                  )}
                  {project.liveUrl && (
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

              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                {project.description || "No project description provided."}
              </Typography>

              <Box>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                  <Typography variant="body2" fontWeight={600} color="text.secondary">
                    Team Completion Progress
                  </Typography>
                  <Typography variant="body2" fontWeight={700} color="primary.main">
                    {Math.round(progress)}%
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(100, Math.max(0, progress))}
                  sx={{ height: 10, borderRadius: 5, bgcolor: "grey.100" }}
                />
              </Box>
            </CardContent>
          </Card>
        )}
      </PageContent>
  );
}
