import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
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
} from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import FolderIcon from "@mui/icons-material/Folder";
import { useOutletContext } from "react-router-dom";

import PageHeader from "../../components/common/PageHeader";
import { PageContent } from "../../components/layout/AppLayout";
import EmptyState from "../../components/common/EmptyState";
import { teamApi } from "../../services/teamApi";
import { useToast } from "../../context/ToastContext";

export default function StudentTeam() {
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const { onMobileNavOpen } = useOutletContext() || {};

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
    <PageContent>
      <PageHeader
        title={`My Team: ${team?.name || "Team Overview"}`}
        description={team?.description || "Collaborate with your teammates on project deliverables."}
      />
        {loading ? (
          <Box sx={{ py: 6, textAlign: "center" }}>
            <CircularProgress color="primary" />
          </Box>
        ) : !team ? (
          <EmptyState
            title="No team assigned"
            description="You are currently not assigned to a project team. Please contact your bootcamp admin."
            icon={GroupsIcon}
          />
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Team Roster ({members.length})
                </Typography>
                <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
                  <Table size="small">
                    <TableHead sx={{ bgcolor: "grey.50" }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700 }}>Student Name</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Roll #</TableCell>
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
                                <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main", fontSize: 14 }}>
                                  {name.charAt(0)}
                                </Avatar>
                                <Typography variant="body2" fontWeight={600}>
                                  {name}
                                </Typography>
                              </Stack>
                            </TableCell>
                            <TableCell>{email}</TableCell>
                            <TableCell>{roll}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Assigned Project
                </Typography>
                {team.project ? (
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                      <FolderIcon color="primary" />
                      <Typography variant="subtitle1" fontWeight={700}>
                        {team.project.name}
                      </Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      {team.project.description || "Active team development project."}
                    </Typography>
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No project assigned to your team yet.
                  </Typography>
                )}
              </Card>
            </Grid>
          </Grid>
        )}
      </PageContent>
  );
}
