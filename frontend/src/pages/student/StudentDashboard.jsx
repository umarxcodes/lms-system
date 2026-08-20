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
  Tooltip,
  Avatar,
  Divider,
} from "@mui/material";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import GroupsIcon from "@mui/icons-material/Groups";
import ChecklistIcon from "@mui/icons-material/Checklist";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import RefreshIcon from "@mui/icons-material/Refresh";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import MuiLink from "@mui/material/Link";
import { useNavigate, Link as RouterLink } from "react-router-dom";

import { PageContent } from "../../components/layout/AppLayout";
import StatCard from "../../components/common/StatCard";
import StatusChip from "../../components/common/StatusChip";
import ActionButton from "../../components/common/ActionButton";
import { studentApi } from "../../services/studentApi";
import { notificationApi } from "../../services/notificationApi";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
} from "recharts";

const ATTENDANCE_COLORS = ["#2563EB", "#EF4444", "#F59E0B", "#10B981"];
const TASK_BAR_COLOR = "#9333EA";

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchDashboard = useCallback(
    async (isRefresh = false) => {
      try {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);
        setErrorMsg("");

        const [dashRes, notifRes] = await Promise.all([
          studentApi.getStudentDashboard(),
          notificationApi.getUnreadCount().catch(() => ({ success: false })),
        ]);

        if (dashRes?.success) {
          setData(dashRes.data);
        } else {
          setErrorMsg(dashRes?.message || "Failed to load student portal data.");
        }

        if (notifRes?.success && typeof notifRes.data?.count === "number") {
          setUnreadCount(notifRes.data.count);
        }
      } catch (err) {
        const msg = err?.message || "Unable to connect to the server.";
        setErrorMsg(msg);
        showToast(msg, "error");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [showToast]
  );

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  // --- Data extraction ---
  const profile = data?.profile || {};
  const attendance = data?.attendance || { total: 0, present: 0, absent: 0, leave: 0, late: 0 };
  const team = data?.team || null;
  const projects = data?.projects || [];
  const myTasks = data?.assignedTasks || data?.tasks || [];

  // Metrics
  const totalAtt = attendance.total || 0;
  const presentAtt = attendance.present || 0;
  const attendancePercentage = totalAtt > 0 ? Math.round((presentAtt / totalAtt) * 100) : 100;
  const pendingTasksCount = myTasks.filter(
    (t) => (t.status || "").toLowerCase() === "todo" || (t.status || "").toLowerCase() === "in-progress" || (t.status || "").toLowerCase() === "in_progress"
  ).length;
  const totalTasksCount = myTasks.length;
  const completedTasksCount = myTasks.filter(
    (t) => (t.status || "").toLowerCase() === "done" || (t.status || "").toLowerCase() === "completed"
  ).length;

  const totalProjects = projects.length;
  const completedProjects = projects.filter((p) => p.status === "completed").length;
  const projectProgress = totalTasksCount > 0
    ? Math.round((completedTasksCount / totalTasksCount) * 100)
    : (totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0);

  // Chart data
  const rawPieData = [
    { name: "Present", value: attendance.present || 0 },
    { name: "Absent", value: attendance.absent || 0 },
    { name: "Late", value: attendance.late || 0 },
    { name: "Leave", value: attendance.leave || 0 },
  ].filter((item) => item.value > 0);

  const pieData = rawPieData.length > 0 ? rawPieData : [{ name: "Present", value: 1 }];

  const taskDistribution = [
    { name: "To Do", count: myTasks.filter((t) => t.status === "todo").length },
    { name: "In Progress", count: myTasks.filter((t) => t.status === "in-progress").length },
    { name: "Done", count: myTasks.filter((t) => t.status === "completed" || t.status === "done").length },
  ];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const dateStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <PageContent>
      {/* ─── Header + Breadcrumb ─── */}
      <Box>
        <Breadcrumbs
          separator={<NavigateNextIcon sx={{ fontSize: 14, color: "#94A3B8" }} />}
          aria-label="breadcrumb"
          sx={{ mb: 0.75 }}
        >
          <MuiLink
            component={RouterLink}
            to="/student/dashboard"
            underline="hover"
            sx={{ display: "flex", alignItems: "center", gap: 0.4, color: "#64748B", fontSize: "0.78rem", fontWeight: 600 }}
          >
            <HomeOutlinedIcon sx={{ fontSize: 14 }} />
            Home
          </MuiLink>
          <Typography variant="caption" sx={{ color: "#0F172A", fontWeight: 700, fontSize: "0.78rem" }}>
            Dashboard
          </Typography>
        </Breadcrumbs>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={1}
        >
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: "text.primary", mb: 0.25 }}>
              {greeting}, {user?.name || profile.name || "Student"}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Track your attendance, deliverables, and team milestones · {dateStr}
            </Typography>
          </Box>

          <Tooltip title="Refresh portal data">
            <IconButton
              onClick={() => fetchDashboard(true)}
              disabled={loading || refreshing}
              size="small"
              aria-label="Refresh student portal"
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                bgcolor: "background.paper",
                "&:hover": { bgcolor: "grey.50" },
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
          </Tooltip>
        </Stack>
      </Box>

      {/* ─── Error Alert ─── */}
      {errorMsg && (
        <Alert
          severity="error"
          sx={{ borderRadius: 3 }}
          action={
            <Button color="inherit" size="small" onClick={() => fetchDashboard(true)}>
              Retry
            </Button>
          }
        >
          {errorMsg}
        </Alert>
      )}

      {/* ─── Notifications Banner ─── */}
      {unreadCount > 0 && (
        <Alert
          severity="info"
          icon={<NotificationsNoneOutlinedIcon fontSize="small" />}
          sx={{ borderRadius: 3 }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => navigate("/student/notifications")}
              sx={{ fontWeight: 700 }}
            >
              View
            </Button>
          }
        >
          You have <strong>{unreadCount}</strong> unread announcement{unreadCount > 1 ? "s" : ""}.
        </Alert>
      )}

      {/* ─── Metrics ─── */}
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          {loading ? (
            <Skeleton variant="rounded" height={120} sx={{ borderRadius: 3 }} />
          ) : (
            <StatCard
              title="Attendance Rate"
              value={`${attendancePercentage}%`}
              icon={EventAvailableIcon}
              iconBgColor="#f0fdf4"
              iconColor="#16a34a"
              progress={attendancePercentage}
              accentColor="#16a34a"
              subtitle={`${presentAtt} of ${totalAtt} sessions attended`}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          {loading ? (
            <Skeleton variant="rounded" height={120} sx={{ borderRadius: 3 }} />
          ) : (
            <StatCard
              title="My Team"
              value={team?.name || "Unassigned"}
              icon={GroupsIcon}
              iconBgColor="#eff6ff"
              iconColor="#2563EB"
              subtitle={team ? `${team.members?.length || 0} collaborators` : "Contact instructor"}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          {loading ? (
            <Skeleton variant="rounded" height={120} sx={{ borderRadius: 3 }} />
          ) : (
            <StatCard
              title="Pending Tasks"
              value={pendingTasksCount}
              icon={ChecklistIcon}
              iconBgColor="#fff7ed"
              iconColor="#ea580c"
              subtitle="Tasks awaiting submission"
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          {loading ? (
            <Skeleton variant="rounded" height={120} sx={{ borderRadius: 3 }} />
          ) : (
            <StatCard
              title="Task Completion"
              value={`${projectProgress}%`}
              icon={TrendingUpIcon}
              iconBgColor="#faf5ff"
              iconColor="#9333ea"
              progress={projectProgress}
              accentColor="#9333ea"
              subtitle={totalTasksCount > 0 ? `${completedTasksCount} of ${totalTasksCount} tasks completed` : `${completedProjects} of ${totalProjects} finished`}
            />
          )}
        </Grid>
      </Grid>

      {/* ─── Charts ─── */}
      <Grid container spacing={2.5}>
        {/* Attendance Donut */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            elevation={0}
            sx={{
              height: 360,
              display: "flex",
              flexDirection: "column",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <CardContent sx={{ p: 2.5, flex: 1, display: "flex", flexDirection: "column" }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "text.primary", mb: 0.25 }}>
                Attendance History
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary", mb: 2 }}>
                Breakdown of session attendance records
              </Typography>

              {loading ? (
                <Skeleton variant="rounded" height={250} sx={{ borderRadius: 2, flex: 1 }} />
              ) : totalAtt === 0 ? (
                <Box
                  sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "grey.50",
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 600 }}>
                    No attendance logged yet.
                  </Typography>
                  <Typography variant="caption" sx={{ color: "text.disabled", mt: 0.5 }}>
                    Session entries will populate here over time.
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ flex: 1, minHeight: 0, position: "relative" }}>
                  {/* Centered donut label */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: "43%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      textAlign: "center",
                      pointerEvents: "none",
                      zIndex: 1,
                    }}
                  >
                    <Typography variant="h4" sx={{ fontWeight: 800, color: "#0F172A", lineHeight: 1 }}>
                      {attendancePercentage}%
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 600, fontSize: "0.72rem" }}>
                      Present
                    </Typography>
                  </Box>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="45%"
                        innerRadius={65}
                        outerRadius={90}
                        paddingAngle={3}
                        dataKey="value"
                        strokeWidth={0}
                      >
                        {pieData.map((_, i) => (
                          <Cell key={`cell-${i}`} fill={ATTENDANCE_COLORS[i % ATTENDANCE_COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip
                        formatter={(val, name) => [`${val} sessions`, name]}
                        contentStyle={{ borderRadius: 8, fontSize: 13, border: "1px solid #e2e8f0", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                      />
                      <Legend
                        verticalAlign="bottom"
                        height={32}
                        iconType="circle"
                        iconSize={8}
                        formatter={(val) => <span style={{ color: "#475569", fontSize: 12, fontWeight: 600 }}>{val}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Task Completion Bar */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            elevation={0}
            sx={{
              height: 360,
              display: "flex",
              flexDirection: "column",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <CardContent sx={{ p: 2.5, flex: 1, display: "flex", flexDirection: "column" }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "text.primary", mb: 0.25 }}>
                Task Status
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary", mb: 2 }}>
                Current state of your assigned deliverables
              </Typography>

              {loading ? (
                <Skeleton variant="rounded" height={250} sx={{ borderRadius: 2, flex: 1 }} />
              ) : (
                <Box sx={{ flex: 1, minHeight: 0 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={taskDistribution} margin={{ top: 22, right: 12, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                      <XAxis
                        dataKey="name"
                        stroke="#64748B"
                        fontSize={12}
                        fontWeight={600}
                        tickLine={false}
                        axisLine={{ stroke: "#E2E8F0" }}
                      />
                      <YAxis
                        stroke="#64748B"
                        fontSize={12}
                        fontWeight={600}
                        allowDecimals={false}
                        tickLine={false}
                        axisLine={false}
                      />
                      <RechartsTooltip
                        formatter={(val) => [`${val} tasks`, "Count"]}
                        contentStyle={{ borderRadius: 8, fontSize: 13, border: "1px solid #e2e8f0", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                      />
                      <Bar dataKey="count" fill={TASK_BAR_COLOR} radius={[6, 6, 0, 0]} barSize={44}>
                        <LabelList dataKey="count" position="top" style={{ fill: "#475569", fontSize: 12, fontWeight: 700 }} />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ─── Quick Actions / Shortcuts ─── */}
      <Card
        elevation={0}
        sx={{
          border: "1px solid #E2E8F0",
          borderRadius: "16px",
          bgcolor: "#FFFFFF",
          p: 2.5,
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.02)",
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: "8px",
              bgcolor: "#EFF6FF",
              color: "#2563EB",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FlashOnIcon sx={{ fontSize: 16 }} />
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#0F172A", lineHeight: 1.2 }}>
              Quick Actions
            </Typography>
            <Typography variant="caption" sx={{ color: "#64748B", fontSize: "0.75rem" }}>
              Direct shortcuts to your personal learning modules
            </Typography>
          </Box>
        </Stack>

        <Grid container spacing={2}>
          {[
            {
              label: "My Attendance",
              desc: "Logs & presence",
              icon: <EventAvailableIcon sx={{ fontSize: 18 }} />,
              to: "/student/attendance",
              color: "#16A34A",
              bg: "#F0FDF4",
            },
            {
              label: "My Tasks",
              desc: "View deliverables",
              icon: <ChecklistIcon sx={{ fontSize: 18 }} />,
              to: "/student/tasks",
              color: "#EA580C",
              bg: "#FFF7ED",
            },
            {
              label: "My Team",
              desc: "Collaborators",
              icon: <GroupsIcon sx={{ fontSize: 18 }} />,
              to: "/student/team",
              color: "#2563EB",
              bg: "#EFF6FF",
            },
            {
              label: "My Progress",
              desc: "Milestones & grade",
              icon: <TrendingUpIcon sx={{ fontSize: 18 }} />,
              to: "/student/progress",
              color: "#9333EA",
              bg: "#FAF5FF",
            },
            {
              label: "My Reports",
              desc: "Performance summary",
              icon: <AssessmentOutlinedIcon sx={{ fontSize: 18 }} />,
              to: "/student/reports",
              color: "#0D9488",
              bg: "#F0FDFA",
            },
          ].map((action) => (
            <Grid key={action.label} item xs={12} sm={6} md={2.4}>
              <Paper
                elevation={0}
                onClick={() => navigate(action.to)}
                sx={{
                  p: 2,
                  borderRadius: "12px",
                  border: "1px solid #E2E8F0",
                  bgcolor: "#FFFFFF",
                  cursor: "pointer",
                  transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  "&:hover": {
                    borderColor: action.color,
                    boxShadow: `0 8px 20px -4px ${action.color}1A`,
                    transform: "translateY(-2px)",
                    "& .action-arrow": {
                      transform: "translateX(3px)",
                      color: action.color,
                    },
                  },
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0 }}>
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      bgcolor: action.bg,
                      color: action.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {action.icon}
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 700, color: "#0F172A", fontSize: "0.85rem", lineHeight: 1.2 }}
                      noWrap
                    >
                      {action.label}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "#64748B", fontSize: "0.725rem", display: "block" }}
                      noWrap
                    >
                      {action.desc}
                    </Typography>
                  </Box>
                </Stack>
                <ArrowForwardIcon
                  className="action-arrow"
                  sx={{ fontSize: 16, color: "#94A3B8", transition: "all 0.2s ease", flexShrink: 0, ml: 1 }}
                />
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Card>

      {/* ─── Deliverables & Team Roster ─── */}
      <Grid container spacing={2.5}>
        {/* Assigned Tasks */}
        <Grid item xs={12} md={7}>
          <Card
            elevation={0}
            sx={{
              border: "1px solid #E2E8F0",
              borderRadius: "16px",
              height: "100%",
              bgcolor: "#FFFFFF",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
            }}
          >
            <CardContent sx={{ p: 2.5, flex: 1, display: "flex", flexDirection: "column" }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Stack direction="row" spacing={1.25} alignItems="center">
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "8px",
                      bgcolor: "#FFF7ED",
                      color: "#EA580C",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ChecklistIcon sx={{ fontSize: 18 }} />
                  </Box>
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="h6" sx={{ fontWeight: 800, color: "#0F172A", fontSize: "1.05rem" }}>
                        Assigned Tasks
                      </Typography>
                      {!loading && (
                        <Chip
                          label={myTasks.length > 0 ? `${myTasks.length} Assigned` : "All Complete"}
                          size="small"
                          sx={{
                            bgcolor: myTasks.length > 0 ? "#FFF7ED" : "#F0FDF4",
                            color: myTasks.length > 0 ? "#C2410C" : "#15803D",
                            fontWeight: 700,
                            fontSize: "0.7rem",
                            height: 22,
                            borderRadius: "6px",
                          }}
                        />
                      )}
                    </Stack>
                    <Typography variant="caption" sx={{ color: "#64748B", fontSize: "0.75rem" }}>
                      Deliverables assigned specifically to you
                    </Typography>
                  </Box>
                </Stack>
                <Button
                  size="small"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate("/student/tasks")}
                  sx={{
                    fontWeight: 700,
                    textTransform: "none",
                    color: "#2563EB",
                    borderRadius: "8px",
                    px: 1.5,
                    "&:hover": { bgcolor: "#EFF6FF" },
                  }}
                >
                  All Tasks
                </Button>
              </Stack>
              <Divider sx={{ mb: 2 }} />

              {loading ? (
                <Stack spacing={1.5}>
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} variant="rounded" height={60} sx={{ borderRadius: "12px" }} />
                  ))}
                </Stack>
              ) : myTasks.length === 0 ? (
                <Box
                  sx={{
                    py: 5,
                    px: 3,
                    textAlign: "center",
                    bgcolor: "#F8FAFC",
                    borderRadius: "12px",
                    border: "1px stroke #E2E8F0",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    flex: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      bgcolor: "#F0FDF4",
                      color: "#16A34A",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 1.5,
                    }}
                  >
                    <TaskAltIcon sx={{ fontSize: 24 }} />
                  </Box>
                  <Typography variant="body2" sx={{ color: "#0F172A", fontWeight: 700 }}>
                    You have no pending tasks assigned!
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#64748B", mt: 0.5, maxWidth: 280 }}>
                    Great job completing your deliverables. Check back when new projects are assigned.
                  </Typography>
                </Box>
              ) : (
                <Stack spacing={1.25}>
                  {myTasks.slice(0, 5).map((task) => {
                    const projTitle = task.project?.title || task.project?.name || task.projectId?.name || "Unassigned Project";

                    return (
                      <Paper
                        key={task._id || task.id}
                        elevation={0}
                        onClick={() => navigate("/student/tasks")}
                        sx={{
                          p: 1.75,
                          borderRadius: "12px",
                          border: "1px solid #E2E8F0",
                          bgcolor: "#FFFFFF",
                          cursor: "pointer",
                          transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                          "&:hover": {
                            borderColor: "#2563EB",
                            boxShadow: "0 4px 12px rgba(37, 99, 235, 0.08)",
                            transform: "translateY(-1px)",
                            bgcolor: "#F8FAFC",
                          },
                        }}
                      >
                        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0 }}>
                            <Box
                              sx={{
                                width: 34,
                                height: 34,
                                borderRadius: "50%",
                                bgcolor: task.status === "completed" || task.status === "done" ? "#F0FDF4" : "#FFF7ED",
                                color: task.status === "completed" || task.status === "done" ? "#16A34A" : "#EA580C",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                              }}
                            >
                              <ChecklistIcon sx={{ fontSize: 18 }} />
                            </Box>

                            <Box sx={{ minWidth: 0 }}>
                              <Typography variant="body2" sx={{ fontWeight: 700, color: "#0F172A", lineHeight: 1.2 }} noWrap>
                                {task.title}
                              </Typography>
                              <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 600, display: "block", mt: 0.5 }} noWrap>
                                {projTitle}
                              </Typography>
                            </Box>
                          </Stack>

                          <Stack direction="row" spacing={1} alignItems="center" sx={{ flexShrink: 0 }}>
                            <StatusChip status={task.priority || "medium"} />
                            <StatusChip status={task.status || "todo"} />
                            <ActionButton type="view" title="View task details" />
                          </Stack>
                        </Stack>
                      </Paper>
                    );
                  })}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Team Roster */}
        <Grid item xs={12} md={5}>
          <Card
            elevation={0}
            sx={{
              border: "1px solid #E2E8F0",
              borderRadius: "16px",
              height: "100%",
              bgcolor: "#FFFFFF",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
            }}
          >
            <CardContent sx={{ p: 2.5, flex: 1, display: "flex", flexDirection: "column" }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Stack direction="row" spacing={1.25} alignItems="center">
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "8px",
                      bgcolor: "#F0FDF4",
                      color: "#16A34A",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <GroupsIcon sx={{ fontSize: 18 }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: "#0F172A", fontSize: "1.05rem" }}>
                      Team Roster
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#64748B", fontSize: "0.75rem" }}>
                      Your project collaborators
                    </Typography>
                  </Box>
                </Stack>
                <Button
                  size="small"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate("/student/team")}
                  sx={{
                    fontWeight: 700,
                    textTransform: "none",
                    color: "#2563EB",
                    borderRadius: "8px",
                    px: 1.5,
                    "&:hover": { bgcolor: "#EFF6FF" },
                  }}
                >
                  View Team
                </Button>
              </Stack>
              <Divider sx={{ mb: 2 }} />

              {loading ? (
                <Stack spacing={1.5}>
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} variant="rounded" height={54} sx={{ borderRadius: "12px" }} />
                  ))}
                </Stack>
              ) : !team ? (
                <Box
                  sx={{
                    py: 5,
                    px: 3,
                    textAlign: "center",
                    bgcolor: "#F8FAFC",
                    borderRadius: "12px",
                    border: "1px stroke #E2E8F0",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    flex: 1,
                  }}
                >
                  <InfoOutlinedIcon sx={{ color: "#94A3B8", fontSize: 28, mb: 1 }} />
                  <Typography variant="body2" sx={{ color: "#0F172A", fontWeight: 700 }}>
                    Not assigned to a team yet.
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#64748B", mt: 0.5 }}>
                    Contact your instructor to join a project team.
                  </Typography>
                </Box>
              ) : (
                <Stack spacing={1.25}>
                  <Box sx={{ p: 1.75, bgcolor: "#F8FAFC", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#2563EB" }}>
                        {team.name}
                      </Typography>
                      <Chip
                        label={`${team.members?.length || 0} Members`}
                        size="small"
                        sx={{ bgcolor: "#EFF6FF", color: "#1D4ED8", fontWeight: 700, fontSize: "0.7rem", height: 20 }}
                      />
                    </Stack>
                    {team.description && (
                      <Typography variant="caption" sx={{ color: "#64748B", mt: 0.5, display: "block" }}>
                        {team.description}
                      </Typography>
                    )}
                  </Box>

                  {(team.members || []).slice(0, 4).map((m) => (
                    <Paper
                      key={m._id || m.id}
                      elevation={0}
                      sx={{
                        p: 1.25,
                        px: 1.5,
                        borderRadius: "10px",
                        border: "1px solid #E2E8F0",
                        bgcolor: "#FFFFFF",
                      }}
                    >
                      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0 }}>
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              fontSize: "0.8rem",
                              bgcolor: "#2563EB",
                              fontWeight: 700,
                            }}
                          >
                            {(m.name || "M")[0].toUpperCase()}
                          </Avatar>
                          <Box sx={{ minWidth: 0 }}>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: "#0F172A", lineHeight: 1.2 }} noWrap>
                              {m.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: "#64748B" }} noWrap>
                              {m.email}
                            </Typography>
                          </Box>
                        </Stack>
                        <ActionButton type="view" title="View teammate details" />
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </PageContent>
  );
}
