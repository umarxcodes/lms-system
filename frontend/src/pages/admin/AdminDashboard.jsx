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
import { useNavigate, useOutletContext } from "react-router-dom";

import Header from "../../components/layout/Header";
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
  const { onMobileNavOpen } = useOutletContext() || {};

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

  const pieData = [
    { name: "Present", value: attendanceBreakdown.present || 0 },
    { name: "Absent", value: attendanceBreakdown.absent || 0 },
    { name: "Late", value: attendanceBreakdown.late || 0 },
    { name: "Excused", value: attendanceBreakdown.excused || 0 },
  ].filter((item) => item.value > 0);

  const barData = Object.keys(taskStatusBreakdown).map((key) => ({
    name: key.replace("_", " ").toUpperCase(),
    count: taskStatusBreakdown[key],
  }));

  return (
    <>
      <Header
        title="Admin Dashboard"
        subtitle="Real-time overview of bootcamp operations, attendance, teams, and tasks."
        onMobileNavOpen={onMobileNavOpen}
      />

      <PageContent>
        {/* Stat Summary Cards */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            {loading ? (
              <Skeleton variant="rounded" height={130} />
            ) : (
              <StatCard
                title="Total Students"
                value={summary.totalStudents || 0}
                icon={PeopleAltOutlinedIcon}
                iconBgColor="#eff6ff"
                iconColor="#1d4ed8"
                subtitle="Active bootcamp trainees"
              />
            )}
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            {loading ? (
              <Skeleton variant="rounded" height={130} />
            ) : (
              <StatCard
                title="Present Today"
                value={summary.presentToday || 0}
                icon={EventAvailableIcon}
                iconBgColor="#f0fdf4"
                iconColor="#16a34a"
                subtitle={`Absent: ${summary.absentToday || 0}`}
              />
            )}
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            {loading ? (
              <Skeleton variant="rounded" height={130} />
            ) : (
              <StatCard
                title="Total Teams"
                value={summary.totalTeams || 0}
                icon={GroupsIcon}
                iconBgColor="#faf5ff"
                iconColor="#9333ea"
                subtitle="Active project teams"
              />
            )}
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            {loading ? (
              <Skeleton variant="rounded" height={130} />
            ) : (
              <StatCard
                title="Pending Tasks"
                value={summary.pendingTasks || 0}
                icon={AssignmentTurnedInIcon}
                iconBgColor="#fff7ed"
                iconColor="#ea580c"
                subtitle="Tasks awaiting completion"
              />
            )}
          </Grid>
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3, height: 360, display: "flex", flexDirection: "column" }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Today's Attendance Breakdown
              </Typography>
              {loading ? (
                <Skeleton variant="rounded" height={260} />
              ) : pieData.length === 0 ? (
                <Box sx={{ flex: 1, display: "grid", placeItems: "center" }}>
                  <Typography variant="body2" color="text.secondary">
                    No attendance records submitted for today.
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

          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3, height: 360, display: "flex", flexDirection: "column" }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Task Status Distribution
              </Typography>
              {loading ? (
                <Skeleton variant="rounded" height={260} />
              ) : barData.length === 0 ? (
                <Box sx={{ flex: 1, display: "grid", placeItems: "center" }}>
                  <Typography variant="body2" color="text.secondary">
                    No task data available.
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ flex: 1, width: "100%", height: 260 }}>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={barData}>
                      <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                      <YAxis stroke="#64748b" fontSize={12} allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#1d4ed8" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              )}
            </Card>
          </Grid>
        </Grid>

        {/* Data Tables */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <Card>
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
                  <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: "center" }}>
                    No tasks are due today.
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

          <Grid item xs={12} md={5}>
            <Card>
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
                  <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: "center" }}>
                    No students registered yet.
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
    </>
  );
}
