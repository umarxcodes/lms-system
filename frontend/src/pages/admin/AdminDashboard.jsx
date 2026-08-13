import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
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
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import GroupsIcon from "@mui/icons-material/Groups";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import { useNavigate } from "react-router-dom";

import PageHeader from "../../components/common/PageHeader";
import { PageContent } from "../../components/layout/AppLayout";
import StatCard from "../../components/common/StatCard";
import StatusChip from "../../components/common/StatusChip";
import { dashboardApi } from "../../services/dashboardApi";
import { useToast } from "../../context/ToastContext";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis } from "recharts";

const CHART_COLORS = ["#16a34a", "#dc2626", "#d97706", "#0284c7"];

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await dashboardApi.getAdminDashboard();
        if (isMounted && res.success) {
          setData(res.data);
        }
      } catch (err) {
        if (isMounted) showToast(err?.message || "Failed to load dashboard data", "error");
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
  const attendanceBreakdown = data?.attendanceBreakdown || {};
  const taskStatusBreakdown = data?.taskStatusBreakdown || {};
  const dueTodayTasks = data?.dueTodayTasks || [];
  const recentStudents = data?.recentStudents || [];

  const rawPieData = [
    { name: "Present", value: attendanceBreakdown.present || 0 },
    { name: "Absent", value: attendanceBreakdown.absent || 0 },
    { name: "Late", value: attendanceBreakdown.late || 0 },
    { name: "Excused", value: attendanceBreakdown.excused || 0 },
  ].filter((item) => item.value > 0);

  const pieData =
    rawPieData.length > 0
      ? rawPieData
      : [
          { name: "Present", value: summary.presentToday || 0 },
          { name: "Absent", value: summary.absentToday || 0 },
        ].filter((i) => i.value > 0);

  const rawBarData = Object.keys(taskStatusBreakdown).map((key) => ({
    name: key.replace("_", " ").toUpperCase(),
    count: taskStatusBreakdown[key],
  }));

  const barData =
    rawBarData.length > 0
      ? rawBarData
      : [
          { name: "TODO", count: 0 },
          { name: "IN PROGRESS", count: 0 },
          { name: "COMPLETED", count: 0 },
        ];

  return (
    <PageContent>
      <PageHeader
        title="Admin Dashboard"
        description="Real-time overview of bootcamp operations, attendance, teams, and tasks."
      />

      {/* Stat Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          {loading ? (
            <Skeleton variant="rounded" height={130} />
          ) : (
            <StatCard
              title="Total Students"
              value={summary.totalStudents || 0}
              icon={PeopleAltOutlinedIcon}
              iconBgColor="#eff6ff"
              iconColor="#1e40af"
              accentColor="#1e40af"
              subtitle="Active bootcamp trainees"
            />
          )}
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          {loading ? (
            <Skeleton variant="rounded" height={130} />
          ) : (
            <StatCard
              title="Present Today"
              value={summary.presentToday || 0}
              icon={EventAvailableIcon}
              iconBgColor="#f0fdf4"
              iconColor="#16a34a"
              accentColor="#16a34a"
              subtitle={`Absent: ${summary.absentToday || 0}`}
            />
          )}
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          {loading ? (
            <Skeleton variant="rounded" height={130} />
          ) : (
            <StatCard
              title="Total Teams"
              value={summary.totalTeams || 0}
              icon={GroupsIcon}
              iconBgColor="#faf5ff"
              iconColor="#9333ea"
              accentColor="#9333ea"
              subtitle="Active project teams"
            />
          )}
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          {loading ? (
            <Skeleton variant="rounded" height={130} />
          ) : (
            <StatCard
              title="Pending Tasks"
              value={summary.pendingTasks || 0}
              icon={AssignmentTurnedInIcon}
              iconBgColor="#fff7ed"
              iconColor="#ea580c"
              accentColor="#ea580c"
              subtitle="Tasks awaiting completion"
            />
          )}
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ p: 3, height: 360, display: "flex", flexDirection: "column" }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
              <AssessmentOutlinedIcon color="primary" fontSize="small" />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Today's Attendance Breakdown
              </Typography>
            </Stack>

            {loading ? (
              <Skeleton variant="rounded" height={260} />
            ) : pieData.length === 0 ? (
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "grey.50",
                  borderRadius: 2,
                  p: 3,
                }}
              >
                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                  No attendance records logged for today yet.
                </Typography>
                <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5 }}>
                  Mark attendance in the Attendance module to view live breakdown.
                </Typography>
              </Box>
            ) : (
              <Box sx={{ flex: 1, width: "100%", height: 260 }}>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            )}
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ p: 3, height: 360, display: "flex", flexDirection: "column" }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
              <BarChartOutlinedIcon color="secondary" fontSize="small" />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Task Status Distribution
              </Typography>
            </Stack>

            {loading ? (
              <Skeleton variant="rounded" height={260} />
            ) : (
              <Box sx={{ flex: 1, width: "100%", height: 260 }}>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={barData}>
                    <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#1e40af" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            )}
          </Card>
        </Grid>
      </Grid>

      {/* Data Tables */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Tasks Due Today
                </Typography>
                <Button
                  size="small"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate("/admin/tasks")}
                >
                  View All
                </Button>
              </Stack>
              {loading ? (
                <Skeleton variant="rounded" height={180} />
              ) : dueTodayTasks.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
                  No pending tasks due today. All caught up!
                </Typography>
              ) : (
                <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
                  <Table size="small">
                    <TableHead sx={{ bgcolor: "grey.50" }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700 }}>Title</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Project</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dueTodayTasks.map((t) => (
                        <TableRow key={t._id || t.id} hover>
                          <TableCell sx={{ fontWeight: 600 }}>{t.title}</TableCell>
                          <TableCell>{t.project?.name || t.projectId?.name || "N/A"}</TableCell>
                          <TableCell>
                            <StatusChip status={t.status} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Recent Students
                </Typography>
                <Button
                  size="small"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate("/admin/students")}
                >
                  Manage
                </Button>
              </Stack>
              {loading ? (
                <Skeleton variant="rounded" height={180} />
              ) : recentStudents.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
                  No recent student activity registered.
                </Typography>
              ) : (
                <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
                  <Table size="small">
                    <TableHead sx={{ bgcolor: "grey.50" }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Roll #</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recentStudents.map((s) => (
                        <TableRow
                          key={s._id || s.id}
                          hover
                          onClick={() => navigate(`/admin/students/${s._id || s.id}`)}
                          sx={{ cursor: "pointer" }}
                        >
                          <TableCell sx={{ fontWeight: 600 }}>{s.name || s.user?.name}</TableCell>
                          <TableCell>{s.rollNumber || "N/A"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </PageContent>
  );
}
