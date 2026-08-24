import React, { useState, useEffect, useCallback } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Skeleton,
  Paper,
  Button,
  Alert,
  IconButton,
  Tooltip,
  Avatar,
  Chip,
} from "@mui/material";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import GroupsIcon from "@mui/icons-material/Groups";
import ChecklistIcon from "@mui/icons-material/Checklist";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import RefreshIcon from "@mui/icons-material/Refresh";
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
import StatusBadge from "../../components/common/StatusBadge";
import ActionButton from "../../components/common/ActionButton";
import SectionCard from "../../components/common/SectionCard";
import QuickActionCard from "../../components/common/QuickActionCard";
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

// ─── Chart palette
const ATTENDANCE_COLORS = ["#2563EB", "#EF4444", "#F59E0B", "#10B981"];
const TASK_BAR_COLOR = "#9333EA";

// ─── Quick action definitions
const QUICK_ACTIONS = [
  { label: "My Attendance", desc: "Logs & presence", icon: <EventAvailableIcon sx={{ fontSize: 18 }} />, to: "/student/attendance", color: "#16A34A", bg: "#F0FDF4" },
  { label: "My Tasks", desc: "View deliverables", icon: <ChecklistIcon sx={{ fontSize: 18 }} />, to: "/student/tasks", color: "#EA580C", bg: "#FFF7ED" },
  { label: "My Team", desc: "Collaborators", icon: <GroupsIcon sx={{ fontSize: 18 }} />, to: "/student/team", color: "#2563EB", bg: "#EFF6FF" },
  { label: "My Progress", desc: "Milestones & grade", icon: <TrendingUpIcon sx={{ fontSize: 18 }} />, to: "/student/progress", color: "#9333EA", bg: "#FAF5FF" },
  { label: "My Reports", desc: "Performance summary", icon: <AssessmentOutlinedIcon sx={{ fontSize: 18 }} />, to: "/student/reports", color: "#0D9488", bg: "#F0FDFA" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function TaskRow({ task, onClick }) {
  const projTitle = task.project?.title || task.project?.name || task.projectId?.name || "Unassigned";
  const isDone = task.status === "completed" || task.status === "done";

  return (
    <Paper
      elevation={0}
      onClick={onClick}
      sx={{
        p: 1.75,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        cursor: "pointer",
        transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        "&:hover": {
          borderColor: "primary.main",
          boxShadow: "0 4px 14px rgba(37,99,235,0.08)",
          transform: "translateY(-1px)",
          bgcolor: "grey.50",
        },
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0 }}>
          <Box sx={{ width: 34, height: 34, borderRadius: "50%", bgcolor: isDone ? "#F0FDF4" : "#FFF7ED", color: isDone ? "#16A34A" : "#EA580C", display: "grid", placeItems: "center", flexShrink: 0 }}>
            <ChecklistIcon sx={{ fontSize: 18 }} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" sx={{ fontWeight: 700, color: "text.primary", lineHeight: 1.3 }} noWrap>
              {task.title}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }} noWrap>
              {projTitle}
            </Typography>
          </Box>
        </Stack>
        <Stack direction="row" spacing={0.75} alignItems="center" sx={{ flexShrink: 0 }}>
          <StatusBadge status={task.priority || "medium"} />
          <StatusBadge status={task.status || "todo"} />
          <ActionButton type="view" title="View task" />
        </Stack>
      </Stack>
    </Paper>
  );
}

function TeamMemberRow({ member }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 1.25,
        borderRadius: 2.5,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0 }}>
          <Avatar sx={{ width: 32, height: 32, fontSize: "0.8rem", bgcolor: "primary.main", fontWeight: 700 }}>
            {(member.name || "M")[0].toUpperCase()}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" sx={{ fontWeight: 700, color: "text.primary", lineHeight: 1.3 }} noWrap>
              {member.name}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }} noWrap>
              {member.email}
            </Typography>
          </Box>
        </Stack>
        <ActionButton type="view" title="View teammate" />
      </Stack>
    </Paper>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

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

  // ─── Data extraction ───
  const profile = data?.profile || {};
  const attendance = data?.attendance || { total: 0, present: 0, absent: 0, leave: 0, late: 0 };
  const team = data?.team || null;
  const projects = data?.projects || [];
  const myTasks = data?.assignedTasks || data?.tasks || [];

  const totalAtt = attendance.total || 0;
  const presentAtt = attendance.present || 0;
  const attendancePercentage = totalAtt > 0 ? Math.round((presentAtt / totalAtt) * 100) : 100;
  const pendingTasksCount = myTasks.filter((t) => ["todo", "in-progress", "in_progress"].includes((t.status || "").toLowerCase())).length;
  const totalTasksCount = myTasks.length;
  const completedTasksCount = myTasks.filter((t) => ["done", "completed"].includes((t.status || "").toLowerCase())).length;
  const totalProjects = projects.length;
  const completedProjects = projects.filter((p) => p.status === "completed").length;
  const projectProgress =
    totalTasksCount > 0
      ? Math.round((completedTasksCount / totalTasksCount) * 100)
      : totalProjects > 0
      ? Math.round((completedProjects / totalProjects) * 100)
      : 0;

  // ─── Chart data ───
  const rawPieData = [
    { name: "Present", value: attendance.present || 0 },
    { name: "Absent", value: attendance.absent || 0 },
    { name: "Late", value: attendance.late || 0 },
    { name: "Leave", value: attendance.leave || 0 },
  ].filter((d) => d.value > 0);

  const pieData = rawPieData.length > 0 ? rawPieData : [{ name: "Present", value: 1 }];

  const taskDistribution = [
    { name: "To Do", count: myTasks.filter((t) => t.status === "todo").length },
    { name: "In Progress", count: myTasks.filter((t) => t.status === "in-progress").length },
    { name: "Done", count: myTasks.filter((t) => t.status === "completed" || t.status === "done").length },
  ];

  // ─── Time greeting ───
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const dateStr = new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric" });

  return (
    <PageContent>
      {/* ─── Header ─── */}
      <Box>
        <Breadcrumbs separator={<NavigateNextIcon sx={{ fontSize: 14, color: "text.disabled" }} />} aria-label="breadcrumb" sx={{ mb: 0.75 }}>
          <MuiLink component={RouterLink} to="/student/dashboard" underline="hover" sx={{ display: "flex", alignItems: "center", gap: 0.4, color: "text.secondary", fontSize: "0.78rem", fontWeight: 600 }}>
            <HomeOutlinedIcon sx={{ fontSize: 14 }} />
            Home
          </MuiLink>
          <Typography variant="caption" sx={{ color: "text.primary", fontWeight: 700, fontSize: "0.78rem" }}>Dashboard</Typography>
        </Breadcrumbs>

        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} spacing={1}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: "text.primary", mb: 0.25 }}>
              {greeting}, {user?.name || profile.name || "Student"}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Track your attendance, deliverables & milestones · {dateStr}
            </Typography>
          </Box>
          <Tooltip title="Refresh portal data">
            <IconButton
              onClick={() => fetchDashboard(true)}
              disabled={loading || refreshing}
              size="small"
              aria-label="Refresh student portal"
              sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, bgcolor: "background.paper", "&:hover": { bgcolor: "grey.50" } }}
            >
              <RefreshIcon
                fontSize="small"
                sx={{
                  animation: refreshing ? "spin 1s linear infinite" : "none",
                  "@keyframes spin": { "0%": { transform: "rotate(0deg)" }, "100%": { transform: "rotate(360deg)" } },
                }}
              />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>

      {/* ─── Alerts ─── */}
      {errorMsg && (
        <Alert severity="error" action={<Button color="inherit" size="small" onClick={() => fetchDashboard(true)}>Retry</Button>}>
          {errorMsg}
        </Alert>
      )}
      {unreadCount > 0 && (
        <Alert
          severity="info"
          icon={<NotificationsNoneOutlinedIcon fontSize="small" />}
          action={<Button color="inherit" size="small" onClick={() => navigate("/student/notifications")} sx={{ fontWeight: 700 }}>View</Button>}
        >
          You have <strong>{unreadCount}</strong> unread announcement{unreadCount > 1 ? "s" : ""}.
        </Alert>
      )}

      {/* ─── KPI Metrics ─── */}
      <Grid container spacing={2.5}>
        {[
          { title: "Attendance Rate", value: `${attendancePercentage}%`, icon: EventAvailableIcon, iconBgColor: "#F0FDF4", iconColor: "#16A34A", progress: attendancePercentage, accentColor: "#16A34A", subtitle: `${presentAtt} of ${totalAtt} sessions attended` },
          { title: "My Team", value: team?.name || "Unassigned", icon: GroupsIcon, iconBgColor: "#EFF6FF", iconColor: "#2563EB", accentColor: "#2563EB", subtitle: team ? `${team.members?.length || 0} collaborators` : "Contact instructor" },
          { title: "Pending Tasks", value: pendingTasksCount, icon: ChecklistIcon, iconBgColor: "#FFF7ED", iconColor: "#EA580C", accentColor: "#EA580C", subtitle: "Tasks awaiting submission" },
          { title: "Task Completion", value: `${projectProgress}%`, icon: TrendingUpIcon, iconBgColor: "#FAF5FF", iconColor: "#9333EA", progress: projectProgress, accentColor: "#9333EA", subtitle: totalTasksCount > 0 ? `${completedTasksCount} of ${totalTasksCount} tasks done` : `${completedProjects} of ${totalProjects} finished` },
        ].map((card, i) => (
          <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
            {loading ? <Skeleton variant="rounded" height={120} sx={{ borderRadius: 3 }} /> : <StatCard {...card} />}
          </Grid>
        ))}
      </Grid>

      {/* ─── Charts ─── */}
      <Grid container spacing={2.5}>
        {/* Attendance Donut */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card elevation={0} sx={{ height: 360, display: "flex", flexDirection: "column", border: "1px solid", borderColor: "divider" }}>
            <CardContent sx={{ p: 2.5, flex: 1, display: "flex", flexDirection: "column" }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "text.primary", mb: 0.25 }}>Attendance History</Typography>
              <Typography variant="caption" sx={{ color: "text.secondary", mb: 2 }}>Breakdown of session attendance records</Typography>

              {loading ? (
                <Skeleton variant="rounded" height={250} sx={{ borderRadius: 2, flex: 1 }} />
              ) : totalAtt === 0 ? (
                <Box sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", bgcolor: "grey.50", borderRadius: 2 }}>
                  <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 600 }}>No attendance logged yet.</Typography>
                  <Typography variant="caption" sx={{ color: "text.disabled", mt: 0.5 }}>Session entries will populate here over time.</Typography>
                </Box>
              ) : (
                <Box sx={{ flex: 1, minHeight: 0, position: "relative" }}>
                  <Box sx={{ position: "absolute", top: "43%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center", pointerEvents: "none", zIndex: 1 }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: "text.primary", lineHeight: 1 }}>{attendancePercentage}%</Typography>
                    <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, fontSize: "0.72rem" }}>Present</Typography>
                  </Box>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="45%" innerRadius={65} outerRadius={90} paddingAngle={3} dataKey="value" strokeWidth={0}>
                        {pieData.map((_, i) => <Cell key={i} fill={ATTENDANCE_COLORS[i % ATTENDANCE_COLORS.length]} />)}
                      </Pie>
                      <RechartsTooltip formatter={(val, name) => [`${val} sessions`, name]} contentStyle={{ borderRadius: 8, fontSize: 13, border: "1px solid #e2e8f0", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }} />
                      <Legend verticalAlign="bottom" height={32} iconType="circle" iconSize={8} formatter={(val) => <span style={{ color: "#475569", fontSize: 12, fontWeight: 600 }}>{val}</span>} />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Task Status Bar */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card elevation={0} sx={{ height: 360, display: "flex", flexDirection: "column", border: "1px solid", borderColor: "divider" }}>
            <CardContent sx={{ p: 2.5, flex: 1, display: "flex", flexDirection: "column" }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "text.primary", mb: 0.25 }}>Task Status</Typography>
              <Typography variant="caption" sx={{ color: "text.secondary", mb: 2 }}>Current state of your assigned deliverables</Typography>

              {loading ? (
                <Skeleton variant="rounded" height={250} sx={{ borderRadius: 2, flex: 1 }} />
              ) : (
                <Box sx={{ flex: 1, minHeight: 0 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={taskDistribution} margin={{ top: 22, right: 12, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                      <XAxis dataKey="name" stroke="#64748B" fontSize={12} fontWeight={600} tickLine={false} axisLine={{ stroke: "#E2E8F0" }} />
                      <YAxis stroke="#64748B" fontSize={12} fontWeight={600} allowDecimals={false} tickLine={false} axisLine={false} />
                      <RechartsTooltip formatter={(val) => [`${val} tasks`, "Count"]} contentStyle={{ borderRadius: 8, fontSize: 13, border: "1px solid #e2e8f0", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }} />
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

      {/* ─── Quick Actions ─── */}
      <SectionCard
        icon={<FlashOnIcon sx={{ fontSize: 18 }} />}
        iconBg="#EFF6FF"
        iconColor="#2563EB"
        title="Quick Actions"
        subtitle="Direct shortcuts to your personal learning modules"
        noDivider
      >
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          {QUICK_ACTIONS.map((action) => (
            <Grid key={action.label} size={{ xs: 12, sm: 6, md: 2.4 }}>
              <QuickActionCard {...action} />
            </Grid>
          ))}
        </Grid>
      </SectionCard>

      {/* ─── Tasks & Team ─── */}
      <Grid container spacing={2.5}>
        {/* Assigned Tasks */}
        <Grid size={{ xs: 12, md: 7 }}>
          <SectionCard
            icon={<ChecklistIcon sx={{ fontSize: 18 }} />}
            iconBg="#FFF7ED"
            iconColor="#EA580C"
            title="Assigned Tasks"
            badge={
              !loading && (
                <Chip
                  label={myTasks.length > 0 ? `${myTasks.length} Assigned` : "All Complete"}
                  size="small"
                  sx={{ bgcolor: myTasks.length > 0 ? "#FFF7ED" : "#F0FDF4", color: myTasks.length > 0 ? "#C2410C" : "#15803D", fontWeight: 700, fontSize: "0.7rem", height: 22, borderRadius: "6px" }}
                />
              )
            }
            subtitle="Deliverables assigned specifically to you"
            action={
              <Button size="small" endIcon={<ArrowForwardIcon />} onClick={() => navigate("/student/tasks")} sx={{ fontWeight: 700, textTransform: "none", color: "primary.main", borderRadius: 2, "&:hover": { bgcolor: "primary.50" } }}>
                All Tasks
              </Button>
            }
          >
            {loading ? (
              <Stack spacing={1.5}>
                {[1, 2, 3].map((i) => <Skeleton key={i} variant="rounded" height={60} sx={{ borderRadius: 3 }} />)}
              </Stack>
            ) : myTasks.length === 0 ? (
              <Box sx={{ py: 5, textAlign: "center", bgcolor: "grey.50", borderRadius: 3, border: "1px solid", borderColor: "divider", display: "flex", flexDirection: "column", alignItems: "center", flex: 1, minHeight: 200, justifyContent: "center" }}>
                <Box sx={{ width: 44, height: 44, borderRadius: "50%", bgcolor: "#F0FDF4", color: "#16A34A", display: "grid", placeItems: "center", mb: 1.5 }}>
                  <TaskAltIcon sx={{ fontSize: 24 }} />
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 700, color: "text.primary" }}>No pending tasks assigned!</Typography>
                <Typography variant="caption" sx={{ color: "text.secondary", mt: 0.5, maxWidth: 280, display: "block" }}>Great job! Check back when new projects are assigned.</Typography>
              </Box>
            ) : (
              <Stack spacing={1.25}>
                {myTasks.slice(0, 5).map((task) => (
                  <TaskRow key={task._id || task.id} task={task} onClick={() => navigate("/student/tasks")} />
                ))}
              </Stack>
            )}
          </SectionCard>
        </Grid>

        {/* Team Roster */}
        <Grid size={{ xs: 12, md: 5 }}>
          <SectionCard
            icon={<GroupsIcon sx={{ fontSize: 18 }} />}
            iconBg="#F0FDF4"
            iconColor="#16A34A"
            title="Team Roster"
            subtitle="Your project collaborators"
            action={
              <Button size="small" endIcon={<ArrowForwardIcon />} onClick={() => navigate("/student/team")} sx={{ fontWeight: 700, textTransform: "none", color: "primary.main", borderRadius: 2, "&:hover": { bgcolor: "primary.50" } }}>
                View Team
              </Button>
            }
          >
            {loading ? (
              <Stack spacing={1.5}>
                {[1, 2, 3].map((i) => <Skeleton key={i} variant="rounded" height={54} sx={{ borderRadius: 3 }} />)}
              </Stack>
            ) : !team ? (
              <Box sx={{ py: 5, textAlign: "center", bgcolor: "grey.50", borderRadius: 3, border: "1px solid", borderColor: "divider", flex: 1, minHeight: 200, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <InfoOutlinedIcon sx={{ color: "text.disabled", fontSize: 28, mb: 1 }} />
                <Typography variant="body2" sx={{ fontWeight: 700, color: "text.primary" }}>Not assigned to a team yet.</Typography>
                <Typography variant="caption" sx={{ color: "text.secondary", mt: 0.5 }}>Contact your instructor to join a project team.</Typography>
              </Box>
            ) : (
              <Stack spacing={1.25}>
                {/* Team name banner */}
                <Box sx={{ p: 1.75, bgcolor: "primary.50", borderRadius: 2.5, border: "1px solid", borderColor: "primary.100" }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "primary.dark" }}>{team.name}</Typography>
                    <Chip label={`${team.members?.length || 0} Members`} size="small" sx={{ bgcolor: "primary.100", color: "primary.dark", fontWeight: 700, fontSize: "0.7rem", height: 20 }} />
                  </Stack>
                  {team.description && (
                    <Typography variant="caption" sx={{ color: "text.secondary", mt: 0.5, display: "block" }}>{team.description}</Typography>
                  )}
                </Box>

                {(team.members || []).slice(0, 4).map((m) => (
                  <TeamMemberRow key={m._id || m.id} member={m} />
                ))}
              </Stack>
            )}
          </SectionCard>
        </Grid>
      </Grid>
    </PageContent>
  );
}
