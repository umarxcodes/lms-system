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
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import GroupsIcon from "@mui/icons-material/Groups";
import ChecklistIcon from "@mui/icons-material/Checklist";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CampaignIcon from "@mui/icons-material/Campaign";
import RefreshIcon from "@mui/icons-material/Refresh";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SchoolIcon from "@mui/icons-material/School";
import AssignmentIcon from "@mui/icons-material/Assignment";
import InsertChartOutlinedIcon from "@mui/icons-material/InsertChartOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useNavigate } from "react-router-dom";

import { PageContent } from "../../components/layout/AppLayout";
import StatCard from "../../components/common/StatCard";
import StatusChip from "../../components/common/StatusChip";
import { studentApi } from "../../services/studentApi";
import { notificationApi } from "../../services/notificationApi";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis } from "recharts";

const CHART_COLORS = ["#16a34a", "#dc2626", "#d97706", "#0284c7"];

export default function StudentDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
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
        studentApi.getStudentDashboard(),
        notificationApi.getUnreadCount().catch(() => ({ success: false, data: { count: 0 } })),
      ]);

      if (res?.success) {
        setData(res.data);
      } else {
        setErrorMsg(res?.message || "Failed to load student dashboard.");
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

  const profile = data?.profile || {};
  const attendance = data?.attendance || { total: 0, present: 0, absent: 0, leave: 0, late: 0 };
  const team = data?.team || null;
  const projects = data?.projects || [];
  const myTasks = data?.assignedTasks || data?.tasks || [];

  // Metrics Calculations
  const totalAtt = attendance.total || 0;
  const presentAtt = attendance.present || 0;
  const attendancePercentage = totalAtt > 0 ? Math.round((presentAtt / totalAtt) * 100) : 100;

  const pendingTasksCount = myTasks.filter((t) => t.status === "todo" || t.status === "in-progress").length;

  const totalProjects = projects.length;
  const completedProjects = projects.filter((p) => p.status === "completed").length;
  const projectProgress = totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0;

  // Chart Data
  const rawPieData = [
    { name: "Present", value: attendance.present || 0 },
    { name: "Absent", value: attendance.absent || 0 },
    { name: "Late", value: attendance.late || 0 },
    { name: "Leave", value: attendance.leave || 0 },
  ].filter((item) => item.value > 0);

  const pieData =
    rawPieData.length > 0
      ? rawPieData
      : [{ name: "Present", value: 1 }];

  const taskDistribution = [
    { name: "TODO", count: myTasks.filter((t) => t.status === "todo").length },
    { name: "IN PROGRESS", count: myTasks.filter((t) => t.status === "in-progress").length },
    { name: "COMPLETED", count: myTasks.filter((t) => t.status === "completed" || t.status === "done").length },
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
                Welcome back, {user?.name || profile.name || "Student"}!
              </Typography>
              <Chip
                icon={<SchoolIcon style={{ fontSize: 16 }} />}
                label="STUDENT"
                color="secondary"
                size="small"
                sx={{ fontWeight: 800, fontSize: "0.72rem", height: 24 }}
              />
              {profile.rollNumber && (
                <Chip
                  label={profile.rollNumber}
                  variant="outlined"
                  size="small"
                  sx={{ fontWeight: 700, fontSize: "0.72rem", height: 24 }}
                />
              )}
            </Stack>
            <Typography variant="body2" color="text.secondary">
              Track your attendance, team tasks, project milestones, and portal progress • {currentDateStr}
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
                  Portal Announcement
                </Typography>
                <Typography variant="body2" color="#0c4a6e">
                  You have <strong>{unreadCount}</strong> unread message{unreadCount > 1 ? "s" : ""} or announcement{unreadCount > 1 ? "s" : ""}.
                </Typography>
              </Box>
            </Stack>
            <Button
              size="small"
              variant="outlined"
              color="info"
              endIcon={<ChevronRightIcon />}
              onClick={() => navigate("/student/notifications")}
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
          Student Shortcuts
        </Typography>
        <Stack direction="row" flexWrap="wrap" gap={1.5}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<EventAvailableIcon />}
            onClick={() => navigate("/student/attendance")}
            sx={{ borderRadius: 2, fontWeight: 700, borderColor: "#cbd5e1", color: "#334155", textTransform: "none" }}
          >
            My Attendance
          </Button>
          <Button
            size="small"
            variant="outlined"
            startIcon={<AssignmentIcon />}
            onClick={() => navigate("/student/tasks")}
            sx={{ borderRadius: 2, fontWeight: 700, borderColor: "#cbd5e1", color: "#334155", textTransform: "none" }}
          >
            My Tasks
          </Button>
          <Button
            size="small"
            variant="outlined"
            startIcon={<GroupsIcon />}
            onClick={() => navigate("/student/team")}
            sx={{ borderRadius: 2, fontWeight: 700, borderColor: "#cbd5e1", color: "#334155", textTransform: "none" }}
          >
            My Team
          </Button>
          <Button
            size="small"
            variant="outlined"
            startIcon={<InsertChartOutlinedIcon />}
            onClick={() => navigate("/student/progress")}
            sx={{ borderRadius: 2, fontWeight: 700, borderColor: "#cbd5e1", color: "#334155", textTransform: "none" }}
          >
            My Progress
          </Button>
          <Button
            size="small"
            variant="outlined"
            startIcon={<AssessmentOutlinedIcon />}
            onClick={() => navigate("/student/reports")}
            sx={{ borderRadius: 2, fontWeight: 700, borderColor: "#cbd5e1", color: "#334155", textTransform: "none" }}
          >
            My Reports
          </Button>
        </Stack>
      </Paper>

      {/* KPI Cards Grid */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          {loading ? (
            <Skeleton variant="rounded" height={130} />
          ) : (
            <StatCard
              title="My Attendance"
              value={`${attendancePercentage}%`}
              icon={EventAvailableIcon}
              iconBgColor="#f0fdf4"
              iconColor="#16a34a"
              accentColor="#16a34a"
              progress={attendancePercentage}
              subtitle={`${presentAtt} present out of ${totalAtt || 0} sessions`}
            />
          )}
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          {loading ? (
            <Skeleton variant="rounded" height={130} />
          ) : (
            <StatCard
              title="My Team"
              value={team?.name || "Not Assigned"}
              icon={GroupsIcon}
              iconBgColor="#eff6ff"
              iconColor="#1e40af"
              accentColor="#1e40af"
              subtitle={team ? `${team.members?.length || 0} members assigned` : "Contact instructor"}
            />
          )}
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          {loading ? (
            <Skeleton variant="rounded" height={130} />
          ) : (
            <StatCard
              title="My Pending Tasks"
              value={pendingTasksCount}
              icon={ChecklistIcon}
              iconBgColor="#fff7ed"
              iconColor="#ea580c"
              accentColor="#ea580c"
              subtitle="Tasks awaiting completion"
            />
          )}
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          {loading ? (
            <Skeleton variant="rounded" height={130} />
          ) : (
            <StatCard
              title="Project Progress"
              value={`${projectProgress}%`}
              icon={TrendingUpIcon}
              iconBgColor="#faf5ff"
              iconColor="#9333ea"
              accentColor="#9333ea"
              progress={projectProgress}
              subtitle={`${completedProjects} of ${totalProjects} projects completed`}
            />
          )}
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card elevation={0} sx={{ p: 3, height: 380, border: "1px solid #e2e8f0", borderRadius: 2.5, display: "flex", flexDirection: "column" }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
              <AssessmentOutlinedIcon color="primary" fontSize="small" />
              <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a", fontSize: "1.05rem" }}>
                Attendance Breakdown
              </Typography>
            </Stack>

            {loading ? (
              <Skeleton variant="rounded" height={280} />
            ) : totalAtt === 0 ? (
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
                }}
              >
                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                  No attendance records logged yet.
                </Typography>
                <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5 }}>
                  Your attendance entries will populate here as sessions occur.
                </Typography>
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
                    <Tooltip formatter={(val, name) => [`${val} Sessions`, name]} />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            )}
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card elevation={0} sx={{ p: 3, height: 380, border: "1px solid #e2e8f0", borderRadius: 2.5, display: "flex", flexDirection: "column" }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
              <BarChartOutlinedIcon color="secondary" fontSize="small" />
              <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a", fontSize: "1.05rem" }}>
                My Task Completion Breakdown
              </Typography>
            </Stack>

            {loading ? (
              <Skeleton variant="rounded" height={280} />
            ) : (
              <Box sx={{ flex: 1, width: "100%", height: 280 }}>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={taskDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" stroke="#64748b" fontSize={11} fontWeight={600} />
                    <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
                    <Tooltip formatter={(val) => [`${val} Tasks`, "Count"]} />
                    <Bar dataKey="count" fill="#9333ea" radius={[6, 6, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            )}
          </Card>
        </Grid>
      </Grid>

      {/* Assigned Tasks & Team Section */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 2.5, height: "100%" }}>
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a", fontSize: "1.05rem" }}>
                    Tasks Assigned To You
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Your active team assignments and deliverables
                  </Typography>
                </Box>
                <Button size="small" endIcon={<ArrowForwardIcon />} onClick={() => navigate("/student/tasks")} sx={{ fontWeight: 700, textTransform: "none" }}>
                  View All Tasks
                </Button>
              </Stack>
              <Divider sx={{ mb: 2 }} />

              {loading ? (
                <Skeleton variant="rounded" height={180} />
              ) : myTasks.length === 0 ? (
                <Box sx={{ py: 4, textAlign: "center", bgcolor: "#f8fafc", borderRadius: 2 }}>
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>
                    No tasks currently assigned to you. Enjoy your study session!
                  </Typography>
                </Box>
              ) : (
                <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 2 }}>
                  <Table size="small">
                    <TableHead sx={{ bgcolor: "#f8fafc" }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Task Title</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Project</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Priority</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {myTasks.slice(0, 5).map((t) => (
                        <TableRow key={t._id || t.id} hover>
                          <TableCell sx={{ fontWeight: 600, color: "#0f172a" }}>{t.title}</TableCell>
                          <TableCell sx={{ color: "#475569" }}>{t.project?.name || t.projectId?.name || "N/A"}</TableCell>
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
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 2.5, height: "100%" }}>
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a", fontSize: "1.05rem" }}>
                    My Team Roster
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Team members & collaborators
                  </Typography>
                </Box>
                <Button size="small" endIcon={<ArrowForwardIcon />} onClick={() => navigate("/student/team")} sx={{ fontWeight: 700, textTransform: "none" }}>
                  View Team
                </Button>
              </Stack>
              <Divider sx={{ mb: 2 }} />

              {loading ? (
                <Skeleton variant="rounded" height={180} />
              ) : !team ? (
                <Box sx={{ p: 3, textAlign: "center", bgcolor: "#f8fafc", borderRadius: 2 }}>
                  <InfoOutlinedIcon color="action" sx={{ mb: 1 }} />
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>
                    You are not assigned to a project team yet.
                  </Typography>
                  <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5, display: "block" }}>
                    Contact your instructor to be added to a team.
                  </Typography>
                </Box>
              ) : (
                <Stack spacing={1.5}>
                  <Box sx={{ p: 1.5, bgcolor: "#eff6ff", borderRadius: 2, border: "1px solid #dbeafe" }}>
                    <Typography variant="subtitle2" fontWeight={800} color="#1e40af">
                      {team.name}
                    </Typography>
                    {team.description && (
                      <Typography variant="caption" color="text.secondary">
                        {team.description}
                      </Typography>
                    )}
                  </Box>

                  <Typography variant="caption" fontWeight={700} color="text.secondary">
                    Team Members ({team.members?.length || 0})
                  </Typography>

                  <Stack spacing={1}>
                    {(team.members || []).slice(0, 4).map((m) => (
                      <Stack key={m._id || m.id} direction="row" spacing={1.5} alignItems="center" sx={{ p: 1, borderRadius: 1.5, "&:hover": { bgcolor: "#f8fafc" } }}>
                        <Avatar sx={{ width: 28, height: 28, fontSize: "0.75rem", bgcolor: "#1e40af", fontWeight: 700 }}>
                          {(m.name || "M")[0].toUpperCase()}
                        </Avatar>
                        <Box sx={{ overflow: "hidden" }}>
                          <Typography variant="body2" fontWeight={600} color="#0f172a" noWrap>
                            {m.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" noWrap>
                            {m.email}
                          </Typography>
                        </Box>
                      </Stack>
                    ))}
                  </Stack>
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </PageContent>
  );
}
