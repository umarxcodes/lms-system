import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  Stack,
  Avatar,
  CircularProgress,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Skeleton,
} from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import FolderIcon from "@mui/icons-material/Folder";

import PageHeader from "../../components/common/PageHeader";
import { PageContent } from "../../components/layout/AppLayout";
import EmptyState from "../../components/common/EmptyState";
import { teamApi } from "../../services/teamApi";
import { useToast } from "../../context/ToastContext";

export default function StudentTeam() {
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    teamApi
      .getMyTeam()
      .then((res) => {
        if (res.success && res.data) setTeam(res.data);
      })
      .catch((err) => showToast(err?.message || "Failed to load team details", "error"))
      .finally(() => setLoading(false));
  }, [showToast]);

  const members = team?.members || [];

  return (
    <PageContent px={{ xs: 2, sm: 3, md: 4 }}>
      <PageHeader
        breadcrumbs={[{ label: "Dashboard", to: "/student/dashboard" }, { label: "My Team" }]}
        title={team?.name ? `My Team: ${team.name}` : "My Team Overview"}
        description={team?.description || "Collaborate with your teammates on assigned project deliverables."}
      />

      {loading ? (
        <Box sx={{ py: 6, textAlign: "center" }}>
          <CircularProgress color="primary" />
        </Box>
      ) : !team ? (
        <EmptyState
          title="No Team Assigned"
          description="You are currently not assigned to a project team. Please contact your bootcamp admin."
          icon={GroupsIcon}
        />
      ) : (
        <Grid container spacing={3}>
          {/* Team Roster */}
          <Grid item xs={12} lg={8}>
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
                  Team Roster ({members.length} Members)
                </Typography>
                <Chip label="Active Squad" size="small" sx={{ bgcolor: "#f0fdf4", color: "#16a34a", fontWeight: 700 }} />
              </Stack>

              <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 2 }}>
                <Table size="small">
                  <TableHead sx={{ bgcolor: "#f8fafc" }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Student Name</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Email Address</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Roll Number</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {members.map((m) => {
                      const name = m.name || m.user?.name || "Student";
                      const email = m.email || m.user?.email || "N/A";
                      const roll = m.rollNumber || "N/A";
                      return (
                        <TableRow key={m._id || m.id} hover>
                          <TableCell>
                            <Stack direction="row" spacing={1.5} alignItems="center">
                              <Avatar sx={{ width: 32, height: 32, bgcolor: "#eff6ff", color: "#1e40af", fontSize: 13, fontWeight: 700 }}>
                                {name.charAt(0)}
                              </Avatar>
                              <Typography variant="body2" fontWeight={700} color="#0f172a">
                                {name}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {email}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip label={roll} size="small" variant="outlined" sx={{ fontWeight: 600, borderRadius: 1 }} />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          {/* Assigned Project Info */}
          <Grid item xs={12} lg={4}>
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
                Assigned Project
              </Typography>
              {team.project ? (
                <Box sx={{ p: 2.5, bgcolor: "#f8fafc", borderRadius: 2, border: "1px solid #e2e8f0" }}>
                  <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                    <FolderIcon sx={{ color: "#1e40af" }} />
                    <Typography variant="subtitle1" fontWeight={800} color="#0f172a">
                      {team.project.name}
                    </Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    {team.project.description || "Active team development project."}
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ p: 3, bgcolor: "#f8fafc", borderRadius: 2, border: "1px solid #e2e8f0", textAlign: "center" }}>
                  <FolderIcon sx={{ fontSize: 36, color: "text.secondary", mb: 1 }} />
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>
                    No project assigned to your team yet.
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      )}
    </PageContent>
  );
}
