import React, { useState, useEffect, useCallback } from "react";
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
  Alert,
  IconButton,
  Tooltip as MuiTooltip,
  Chip,
  Avatar,
  Divider,
} from "@mui/material";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import GroupsIcon from "@mui/icons-material/Groups";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import AssignmentIcon from "@mui/icons-material/Assignment";
import InsertChartOutlinedIcon from "@mui/icons-material/InsertChartOutlined";
import CampaignIcon from "@mui/icons-material/Campaign";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { useNavigate } from "react-router-dom";

import PageHeader from "../../components/common/PageHeader";
import { PageContent } from "../../components/layout/AppLayout";
import StatCard from "../../components/common/StatCard";
import StatusChip from "../../components/common/StatusChip";
import { dashboardApi } from "../../services/dashboardApi";
import { notificationApi } from "../../services/notificationApi";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis } from "recharts";

const CHART_COLORS = ["#16a34a", "#dc2626", "#d97706", "#0284c7"];

export default function AdminDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const { showToast } = useToast();
  const navigate = useNavigate();

  const fetchDashboard = useCallback(async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) setRefreshing(true);
      else setLoading(true);
      setErrorMsg("");

      const [res, unreadRes] = await Promise.all([
        dashboardApi.getAdminDashboard(),
        notificationApi.getUnreadCount().catch(() => ({ success: false, data: { count: 0 } })),
      ]);

      if (res?.success) {
        setData(res.data);
      } else {
        setErrorMsg(res?.message || "Failed to load dashboard data.");
      }

      if (unreadRes?.success && typeof unreadRes.data?.count === "number") {
        setUnreadCount(unreadRes.data.count);
      }
    } catch (err) {
      const msg = err?.message || "Failed to connect to dashboard API";
      setErrorMsg(msg);
      showToast(msg, "error");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const summary = data?.summary || {};
  const attendanceBreakdown = data?.attendanceBreakdown || data?.attendance || {};
  const taskStatusBreakdown = data?.taskStatusBreakdown || data?.tasks || {};
  const dueTodayTasks = data?.dueTodayTasks || [];
  const recentStudents = data?.recentStudents || data?.students || [];

  const rawPieData = [
    { name: "Present", value: attendanceBreakdown.present || 0 },
    { name: "Absent", value: attendanceBreakdown.absent || 0 },
    { name: "Late", value: attendanceBreakdown.late || 0 },
    { name: "Leave", value: attendanceBreakdown.leave || attendanceBreakdown.excused || 0 },
  ].filter((item) => item.value > 0);

  const pieData =
    rawPieData.length > 0
      ? rawPieData
      : [
          { name: "Present", value: summary.presentToday || 0 },
          { name: "Absent", value: summary.absentToday || 0 },
        ].filter((i) => i.value > 0);

  const rawBarData = [
    { name: "TODO", count: taskStatusBreakdown.pending ?? taskStatusBreakdown.todo ?? 0 },
    { name: "IN PROGRESS", count: taskStatusBreakdown.inProgress ?? taskStatusBreakdown["in-progress"] ?? 0 },
    { name: "COMPLETED", count: taskStatusBreakdown.completed ?? taskStatusBreakdown.done ?? 0 },
  ];

  const currentDateStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <PageContent>
      {/* Header & Role Bar */}
      <Box sx={{ mb: 3 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={2}
        >
          <Box>
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 0.5 }}>
              <Typography variant="h5" fontWeight={800} color="#0f172a">
                Welcome back, {user?.name || "Administrator"}!
              </Typography>
              <Chip
                icon={<AdminPanelSettingsIcon style={{ fontSize: 16 }} />}
                label="ADMIN"
                color="primary"
                size="small"
                sx={{ fontWeight: 800, fontSize: "0.72rem", height: 24 }}
              />
            </Stack>
            <Typography variant="body2" color="text.secondary">
              Real-time overview of bootcamp operations, attendance, teams, and active projects • {currentDateStr}
            </Typography>
          </Box>

          <Stack direction="row" spacing={1.5} alignItems="center">
            <MuiTooltip title="Refresh Dashboard Data">
              <IconButton
                onClick={() => fetchDashboard(true)}
                disabled={loading || refreshing}
                sx={{
                  bgcolor: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: 2,
                  "&:hover": { bgcolor: "#f8fafc" },
                }}
              >
                <RefreshIcon
                  fontSize="small"
                  sx={{
                    animation: refreshing ? "spin 1s linear infinite" : "none",
                    "@keyframes spin": {
                      "0%": { transform: "rotate(0deg)" },
                      "100%": { transform: "rotate(360deg)" },
                    },
                  }}
                />
              </IconButton>
            </MuiTooltip>
          </Stack>
        </Stack>
      </Box>

      {/* Error Alert */}
      {errorMsg && (
        <Alert
          severity="error"
          sx={{ mb: 3, borderRadius: 2 }}
          action={
            <Button color="inherit" size="small" onClick={() => fetchDashboard(true)}>
              Retry
            </Button>
          }
        >
          {errorMsg}
        </Alert>
      )}

      {/* Unread Notifications Banner */}
      {unreadCount > 0 && (
        <Card
          elevation={0}
          sx={{
            bgcolor: "#f0f9ff",
            border: "1px solid #bae6fd",
            borderRadius: 2.5,
            p: 2,
            mb: 3,
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 2,
                  bgcolor: "#0284c7",
                  color: "#ffffff",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <CampaignIcon fontSize="small" />
              </Box>
              <Box>
                <Typography variant="subtitle2" fontWeight={700} color="#0369a1">
                  System Notifications Alert
                </Typography>
                <Typography variant="body2" color="#0c4a6e">
                  You have <strong>{unreadCount}</strong> unread notification{unreadCount > 1 ? "s" : ""} requiring attention.
                </Typography>
              </Box>
            </Stack>
            <Button
              size="small"
              variant="outlined"
              color="info"
              endIcon={<ChevronRightIcon />}
              onClick={() => navigate("/admin/notifications")}
              sx={{ fontWeight: 700, borderRadius: 2, textTransform: "none" }}
            >
              View Notifications
            </Button>
          </Stack>
        </Card>
      )}

      {/* Quick Actions Panel */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          bgcolor: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: 2.5,
        }}
      >
        <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: 0.8, display: "block", mb: 1.5 }}>
          Quick Operational Shortcuts
        </Typography>
        <Stack direction="row" flexWrap="wrap" gap={1.5}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => navigate("/admin/students")}
            sx={{ borderRadius: 2, fontWeight: 700, borderColor: "#cbd5e1", color: "#334155", textTransform: "none" }}
          >
            Add Student
          </Button>
          <Button
            size="small"
            variant="outlined"
            startIcon={<GroupsIcon />}
            onClick={() => navigate("/admin/teams")}
            sx={{ borderRadius: 2, fontWeight: 700, borderColor: "#cbd5e1", color: "#334155", textTransform: "none" }}
          >
            Create Team
          </Button>
          <Button
            size="small"
            variant="outlined"
            startIcon={<FolderOpenIcon />}
            onClick={() => navigate("/admin/projects")}
            sx={{ borderRadius: 2, fontWeight: 700, borderColor: "#cbd5e1", color: "#334155", textTransform: "none" }}
          >
            Create Project
          </Button>
          <Button
            size="small"
            variant="outlined"
            startIcon={<AssignmentIcon />}
            onClick={() => navigate("/admin/tasks")}
            sx={{ borderRadius: 2, fontWeight: 700, borderColor: "#cbd5e1", color: "#334155", textTransform: "none" }}
          >
            Create Task
          </Button>
          <Button
            size="small"
            variant="outlined"
            startIcon={<InsertChartOutlinedIcon />}
            onClick={() => navigate("/admin/reports")}
            sx={{ borderRadius: 2, fontWeight: 700, borderColor: "#cbd5e1", color: "#334155", textTransform: "none" }}
          >
            View Reports
          </Button>
        </Stack>
      </Paper>

      {/* Stat Summary KPI Cards */}
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
              subtitle={`Absent Today: ${summary.absentToday || 0}`}
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

      {/* Analytics Charts Section */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card elevation={0} sx={{ p: 3, height: 380, border: "1px solid #e2e8f0", borderRadius: 2.5, display: "flex", flexDirection: "column" }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <AssessmentOutlinedIcon color="primary" fontSize="small" />
                <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a", fontSize: "1.05rem" }}>
                  Today's Attendance Breakdown
                </Typography>
              </Stack>
            </Stack>

            {loading ? (
              <Skeleton variant="rounded" height={280} />
            ) : pieData.length === 0 ? (
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "#f8fafc",
                  borderRadius: 2,
                  p: 3,
                  border: "1px stroke #f1f5f9",
                }}
              >
                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                  No attendance records logged for today yet.
                </Typography>
                <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5 }}>
                  Mark attendance in the Attendance module to populate live chart statistics.
                </Typography>
                <Button
                  size="small"
                  variant="text"
                  onClick={() => navigate("/admin/attendance")}
                  sx={{ mt: 1.5, fontWeight: 700, textTransform: "none" }}
                >
                  Go to Attendance Module
                </Button>
              </Box>
            ) : (
              <Box sx={{ flex: 1, width: "100%", height: 280 }}>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={95}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val, name) => [`${val} Students`, name]} />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            )}
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card elevation={0} sx={{ p: 3, height: 380, border: "1px solid #e2e8f0", borderRadius: 2.5, display: "flex", flexDirection: "column" }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <BarChartOutlinedIcon color="secondary" fontSize="small" />
                <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a", fontSize: "1.05rem" }}>
                  Task Status Distribution
                </Typography>
              </Stack>
            </Stack>

            {loading ? (
              <Skeleton variant="rounded" height={280} />
            ) : (
              <Box sx={{ flex: 1, width: "100%", height: 280 }}>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={rawBarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" stroke="#64748b" fontSize={11} fontWeight={600} />
                    <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
                    <Tooltip formatter={(val) => [`${val} Tasks`, "Count"]} />
                    <Bar dataKey="count" fill="#1e40af" radius={[6, 6, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            )}
          </Card>
        </Grid>
      </Grid>

      {/* Data Tables Section */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 2.5, height: "100%" }}>
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a", fontSize: "1.05rem" }}>
                    Tasks Due Today
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Urgent tasks scheduled for completion today
                  </Typography>
                </Box>
                <Button
                  size="small"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate("/admin/tasks")}
                  sx={{ fontWeight: 700, textTransform: "none" }}
                >
                  View All Tasks
                </Button>
              </Stack>
              <Divider sx={{ mb: 2 }} />

              {loading ? (
                <Skeleton variant="rounded" height={180} />
              ) : dueTodayTasks.length === 0 ? (
                <Box sx={{ py: 4, textAlign: "center", bgcolor: "#f8fafc", borderRadius: 2 }}>
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>
                    No pending tasks due today. All caught up!
                  </Typography>
                </Box>
              ) : (
                <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 2 }}>
                  <Table size="small">
                    <TableHead sx={{ bgcolor: "#f8fafc" }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Title</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Project</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dueTodayTasks.map((t) => (
                        <TableRow key={t._id || t.id} hover>
                          <TableCell sx={{ fontWeight: 600, color: "#0f172a" }}>{t.title}</TableCell>
                          <TableCell sx={{ color: "#475569" }}>{t.project?.name || t.projectId?.name || "N/A"}</TableCell>
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
          <Card elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 2.5, height: "100%" }}>
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a", fontSize: "1.05rem" }}>
                    Recent Students
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Newly enrolled trainees
                  </Typography>
                </Box>
                <Button
                  size="small"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate("/admin/students")}
                  sx={{ fontWeight: 700, textTransform: "none" }}
                >
                  Manage Students
                </Button>
              </Stack>
              <Divider sx={{ mb: 2 }} />

              {loading ? (
                <Skeleton variant="rounded" height={180} />
              ) : recentStudents.length === 0 ? (
                <Box sx={{ py: 4, textAlign: "center", bgcolor: "#f8fafc", borderRadius: 2 }}>
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>
                    No recent student activity registered.
                  </Typography>
                </Box>
              ) : (
                <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 2 }}>
                  <Table size="small">
                    <TableHead sx={{ bgcolor: "#f8fafc" }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Student</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Roll #</TableCell>
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
                          <TableCell>
                            <Stack direction="row" spacing={1.5} alignItems="center">
                              <Avatar sx={{ width: 28, height: 28, fontSize: "0.75rem", bgcolor: "#1e40af", fontWeight: 700 }}>
                                {(s.name || s.user?.name || "S")[0].toUpperCase()}
                              </Avatar>
                              <Typography variant="body2" fontWeight={600} color="#0f172a">
                                {s.name || s.user?.name}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell sx={{ color: "#475569", fontWeight: 600 }}>{s.rollNumber || "N/A"}</TableCell>
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
