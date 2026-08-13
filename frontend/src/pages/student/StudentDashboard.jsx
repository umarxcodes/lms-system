import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  Typography,
  Box,
  Stack,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import GroupsIcon from "@mui/icons-material/Groups";
import ChecklistIcon from "@mui/icons-material/Checklist";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CampaignIcon from "@mui/icons-material/Campaign";
import { useNavigate, useOutletContext } from "react-router-dom";

import PageHeader from "../../components/common/PageHeader";
import { PageContent } from "../../components/layout/AppLayout";
import StatCard from "../../components/common/StatCard";
import StatusChip from "../../components/common/StatusChip";
import { studentApi } from "../../services/studentApi";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const { showToast } = useToast();
  const navigate = useNavigate();
  const { onMobileNavOpen } = useOutletContext() || {};

  useEffect(() => {
    let isMounted = true;
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await studentApi.getStudentDashboard();
        if (isMounted && res.success) {
          setData(res.data);
        }
      } catch (err) {
        if (isMounted) showToast(err?.message || "Failed to load dashboard", "error");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDashboard();
    return () => {
      isMounted = false;
    };
  }, [showToast]);

  const summary = data?.summary || {};
  const myTasks = data?.assignedTasks || [];
  const announcement = data?.latestAnnouncement;

  return (
    <PageContent>
      <PageHeader
        title={`Welcome back, ${user?.name || "Student"}!`}
        description="Track your attendance, team tasks, and project milestones."
      />
        {/* Latest Announcement Banner */}
        {announcement && (
          <Card sx={{ bgcolor: "primary.50", border: "1px solid", borderColor: "primary.200", p: 2.5, mb: 3 }}>
            <Stack direction="row" spacing={2} alignItems="flex-start">
              <Box sx={{ color: "primary.main", pt: 0.5 }}>
                <CampaignIcon />
              </Box>
              <Box>
                <Typography variant="subtitle1" fontWeight={700} color="primary.main">
                  {announcement.title}
                </Typography>
                <Typography variant="body2" color="text.primary">
                  {announcement.message}
                </Typography>
              </Box>
            </Stack>
          </Card>
        )}

        {/* Stats Grid */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            {loading ? (
              <Skeleton variant="rounded" height={130} />
            ) : (
              <StatCard
                title="My Attendance"
                value={`${summary.attendancePercentage ?? 100}%`}
                icon={EventAvailableIcon}
                iconBgColor="#f0fdf4"
                iconColor="#16a34a"
                accentColor="#16a34a"
                subtitle="Overall attendance score"
              />
            )}
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            {loading ? (
              <Skeleton variant="rounded" height={130} />
            ) : (
              <StatCard
                title="My Team"
                value={summary.teamName || "Assigned"}
                icon={GroupsIcon}
                iconBgColor="#eff6ff"
                iconColor="#1e40af"
                accentColor="#1e40af"
                subtitle="Current team assignment"
              />
            )}
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            {loading ? (
              <Skeleton variant="rounded" height={130} />
            ) : (
              <StatCard
                title="My Pending Tasks"
                value={summary.pendingTasksCount || 0}
                icon={ChecklistIcon}
                iconBgColor="#fff7ed"
                iconColor="#ea580c"
                accentColor="#ea580c"
                subtitle="Assigned to you"
              />
            )}
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            {loading ? (
              <Skeleton variant="rounded" height={130} />
            ) : (
              <StatCard
                title="Project Progress"
                value={`${Math.round(summary.projectProgress ?? 0)}%`}
                icon={TrendingUpIcon}
                iconBgColor="#faf5ff"
                iconColor="#9333ea"
                accentColor="#9333ea"
                subtitle="Team milestone rate"
              />
            )}
          </Grid>
        </Grid>

        {/* Assigned Tasks */}
        <Card sx={{ p: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Tasks Assigned To You
            </Typography>
            <Button size="small" endIcon={<ArrowForwardIcon />} onClick={() => navigate("/student/tasks")}>
              View All Tasks
            </Button>
          </Stack>

          {loading ? (
            <Skeleton variant="rounded" height={180} />
          ) : myTasks.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
              No tasks currently assigned to you. Enjoy your study session!
            </Typography>
          ) : (
            <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
              <Table size="small">
                <TableHead sx={{ bgcolor: "grey.50" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Task Title</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Project</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Priority</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {myTasks.map((t) => (
                    <TableRow key={t._id || t.id} hover>
                      <TableCell sx={{ fontWeight: 600 }}>{t.title}</TableCell>
                      <TableCell>{t.project?.name || t.projectId?.name || "N/A"}</TableCell>
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
      </PageContent>
  );
}
