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
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import GroupsIcon from "@mui/icons-material/Groups";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import RefreshIcon from "@mui/icons-material/Refresh";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { useNavigate } from "react-router-dom";

import { PageContent } from "../../components/layout/AppLayout";
import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/common/StatCard";
import StatusBadge from "../../components/common/StatusBadge";
import ActionButton from "../../components/common/ActionButton";
import SectionCard from "../../components/common/SectionCard";
import QuickActionCard from "../../components/common/QuickActionCard";
import { dashboardApi } from "../../services/dashboardApi";
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
const TASK_BAR_COLOR = "#2563EB";

// ─── Quick action definitions
const QUICK_ACTIONS = [
  { label: "Students", desc: "Register trainee", icon: <PeopleAltOutlinedIcon sx={{ fontSize: 18 }} />, to: "/admin/students", color: "#2563EB", bg: "#EFF6FF" },
  { label: "Teams", desc: "Build new group", icon: <GroupsIcon sx={{ fontSize: 18 }} />, to: "/admin/teams", color: "#9333EA", bg: "#FAF5FF" },
  { label: "Projects", desc: "Assign capstone", icon: <FolderOpenIcon sx={{ fontSize: 18 }} />, to: "/admin/projects", color: "#0284C7", bg: "#F0F9FF" },
  { label: "Tasks", desc: "Add deliverable", icon: <AssignmentIcon sx={{ fontSize: 18 }} />, to: "/admin/tasks?create=true", color: "#EA580C", bg: "#FFF7ED" },
  { label: "Reports", desc: "Analytics & export", icon: <AssessmentOutlinedIcon sx={{ fontSize: 18 }} />, to: "/admin/reports", color: "#16A34A", bg: "#F0FDF4" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function TaskRow({ task, onClick }) {
  const projTitle = task.project?.title || task.project?.name || task.projectId?.name || "Unassigned";
  const studentName = task.assignedTo?.name || task.assignedTo?.user?.name || "Unassigned";

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
          <Avatar sx={{ width: 34, height: 34, fontSize: "0.8rem", bgcolor: task.assignedTo ? "primary.main" : "grey.400", fontWeight: 700 }}>
            {(studentName || "U")[0].toUpperCase()}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" sx={{ fontWeight: 700, color: "text.primary", lineHeight: 1.3 }} noWrap>
              {task.title}
            </Typography>
            <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mt: 0.25 }}>
              <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }} noWrap>
                {projTitle}
              </Typography>
              <Typography variant="caption" sx={{ color: "divider" }}>•</Typography>
              <Typography variant="caption" sx={{ color: "text.disabled" }} noWrap>
                {studentName}
              </Typography>
            </Stack>
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

function StudentRow({ student, onClick }) {
  const studentName = student.name || student.user?.name || "Student";
  const rollNo = student.rollNumber || "—";

  return (
    <Paper
      elevation={0}
      onClick={onClick}
      sx={{
        p: 1.5,
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
          <Avatar sx={{ width: 36, height: 36, fontSize: "0.85rem", bgcolor: "primary.main", fontWeight: 800, boxShadow: "0 2px 6px rgba(37,99,235,0.2)" }}>
            {studentName[0].toUpperCase()}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" sx={{ fontWeight: 700, color: "text.primary", lineHeight: 1.3 }} noWrap>
              {studentName}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }} noWrap>
              Roll: {rollNo}
            </Typography>
          </Box>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <StatusBadge status="active" label="Active" />
          <ActionButton type="view" title="View student" />
        </Stack>
      </Stack>
    </Paper>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminDashboard() {
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
          dashboardApi.getAdminDashboard(),
          notificationApi.getUnreadCount().catch(() => ({ success: false })),
        ]);

        if (dashRes?.success) {
          setData(dashRes.data);
        } else {
          setErrorMsg(dashRes?.message || "Failed to load dashboard data.");
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
  const summary = data?.summary || {};
  const attendanceBreakdown = data?.attendanceBreakdown || data?.attendance || {};
  const taskStatus = data?.taskStatusBreakdown || data?.tasks || {};
  const dueTodayTasks = data?.dueTodayTasks || [];
  const recentStudents = data?.recentStudents || data?.students || [];

  // ─── Chart data ───
  const pieData = [
    { name: "Present", value: attendanceBreakdown.present || 0 },
    { name: "Absent", value: attendanceBreakdown.absent || 0 },
    { name: "Late", value: attendanceBreakdown.late || 0 },
    { name: "Leave", value: attendanceBreakdown.leave || attendanceBreakdown.excused || 0 },
  ].filter((d) => d.value > 0);

  const finalPieData =
    pieData.length > 0
      ? pieData
      : [
          { name: "Present", value: summary.presentToday || 0 },
          { name: "Absent", value: summary.absentToday || 0 },
        ].filter((d) => d.value > 0);

  const totalAttendance = finalPieData.reduce((s, d) => s + d.value, 0);
  const presentCount = finalPieData.find((d) => d.name === "Present")?.value || 0;
  const attendanceRate = totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 0;

  const barData = [
    { name: "To Do", count: taskStatus.pending ?? taskStatus.todo ?? 0 },
    { name: "In Progress", count: taskStatus.inProgress ?? taskStatus["in-progress"] ?? 0 },
    { name: "Done", count: taskStatus.completed ?? taskStatus.done ?? 0 },
  ];

  // ─── Time greeting ───
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const dateStr = new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric" });

  return (
    <PageContent>
      {/* ─── Page Header ─── */}
      <PageHeader
        breadcrumbs={[{ label: "Home", to: "/admin/dashboard" }, { label: "Dashboard" }]}
        title={`${greeting}, ${user?.name || "Administrator"}`}
        description={`Bootcamp operations overview · ${dateStr}`}
        actions={
          <Tooltip title="Refresh dashboard">
            <IconButton
              onClick={() => fetchDashboard(true)}
              disabled={loading || refreshing}
              size="small"
              aria-label="Refresh dashboard"
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
                  "@keyframes spin": { "0%": { transform: "rotate(0deg)" }, "100%": { transform: "rotate(360deg)" } },
                }}
              />
            </IconButton>
          </Tooltip>
        }
      />

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
          action={<Button color="inherit" size="small" onClick={() => navigate("/admin/notifications")} sx={{ fontWeight: 700 }}>View</Button>}
        >
          You have <strong>{unreadCount}</strong> unread notification{unreadCount > 1 ? "s" : ""}.
        </Alert>
      )}

      {/* ─── KPI Metrics ─── */}
      <Grid container spacing={2.5}>
        {[
          { title: "Total Students", value: summary.totalStudents ?? 0, icon: PeopleAltOutlinedIcon, iconBgColor: "#EFF6FF", iconColor: "#2563EB", subtitle: "Registered trainees", accentColor: "#2563EB" },
          { title: "Present Today", value: summary.presentToday ?? 0, icon: EventAvailableIcon, iconBgColor: "#F0FDF4", iconColor: "#16A34A", subtitle: `${summary.absentToday ?? 0} absent today`, accentColor: "#16A34A" },
          { title: "Active Teams", value: summary.totalTeams ?? 0, icon: GroupsIcon, iconBgColor: "#FAF5FF", iconColor: "#9333EA", subtitle: `${summary.totalTeams ?? 0} active team${summary.totalTeams === 1 ? "" : "s"}`, accentColor: "#9333EA" },
          { title: "Pending Tasks", value: summary.pendingTasks ?? 0, icon: AssignmentTurnedInIcon, iconBgColor: "#FFF7ED", iconColor: "#EA580C", subtitle: "Awaiting completion", accentColor: "#EA580C" },
        ].map((card, i) => (
          <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
            {loading ? (
              <Skeleton variant="rounded" height={120} sx={{ borderRadius: 3 }} />
            ) : (
              <StatCard {...card} />
            )}
          </Grid>
        ))}
      </Grid>

      {/* ─── Charts ─── */}
      <Grid container spacing={2.5}>
        {/* Attendance Donut */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card elevation={0} sx={{ height: 360, display: "flex", flexDirection: "column", border: "1px solid", borderColor: "divider" }}>
            <CardContent sx={{ p: 2.5, flex: 1, display: "flex", flexDirection: "column" }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "text.primary", mb: 0.25 }}>Today's Attendance</Typography>
              <Typography variant="caption" sx={{ color: "text.secondary", mb: 2 }}>Attendance breakdown across all students</Typography>

              {loading ? (
                <Skeleton variant="rounded" height={250} sx={{ borderRadius: 2, flex: 1 }} />
              ) : finalPieData.length === 0 ? (
                <Box sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", bgcolor: "grey.50", borderRadius: 2 }}>
                  <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 600 }}>No attendance records for today.</Typography>
                  <Typography variant="caption" sx={{ color: "text.disabled", mt: 0.5 }}>Records will appear once attendance is marked.</Typography>
                  <Button size="small" onClick={() => navigate("/admin/attendance")} sx={{ mt: 1.5, fontWeight: 600 }}>Mark Attendance</Button>
                </Box>
              ) : (
                <Box sx={{ flex: 1, minHeight: 0, position: "relative" }}>
                  <Box sx={{ position: "absolute", top: "43%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center", pointerEvents: "none", zIndex: 1 }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: "text.primary", lineHeight: 1 }}>{attendanceRate}%</Typography>
                    <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, fontSize: "0.72rem" }}>Present</Typography>
                  </Box>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={finalPieData} cx="50%" cy="45%" innerRadius={65} outerRadius={90} paddingAngle={3} dataKey="value" strokeWidth={0}>
                        {finalPieData.map((_, i) => <Cell key={i} fill={ATTENDANCE_COLORS[i % ATTENDANCE_COLORS.length]} />)}
                      </Pie>
                      <RechartsTooltip formatter={(val, name) => [`${val} students`, name]} contentStyle={{ borderRadius: 8, fontSize: 13, border: "1px solid #e2e8f0", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }} />
                      <Legend verticalAlign="bottom" height={32} iconType="circle" iconSize={8} formatter={(val) => <span style={{ color: "#475569", fontSize: 12, fontWeight: 600 }}>{val}</span>} />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Task Distribution Bar */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card elevation={0} sx={{ height: 360, display: "flex", flexDirection: "column", border: "1px solid", borderColor: "divider" }}>
            <CardContent sx={{ p: 2.5, flex: 1, display: "flex", flexDirection: "column" }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "text.primary", mb: 0.25 }}>Task Distribution</Typography>
              <Typography variant="caption" sx={{ color: "text.secondary", mb: 2 }}>Current status of all bootcamp tasks</Typography>

              {loading ? (
                <Skeleton variant="rounded" height={250} sx={{ borderRadius: 2, flex: 1 }} />
              ) : (
                <Box sx={{ flex: 1, minHeight: 0 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData} margin={{ top: 22, right: 12, left: -20, bottom: 0 }}>
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
        subtitle="Frequently used management shortcuts"
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

      {/* ─── Data Sections ─── */}
      <Grid container spacing={2.5}>
        {/* Tasks Due Today */}
        <Grid size={{ xs: 12, md: 7 }}>
          <SectionCard
            icon={<EventAvailableIcon sx={{ fontSize: 18 }} />}
            iconBg="#FFF7ED"
            iconColor="#EA580C"
            title="Tasks Due Today"
            badge={
              !loading && (
                <Chip
                  label={dueTodayTasks.length > 0 ? `${dueTodayTasks.length} Due` : "Caught Up"}
                  size="small"
                  sx={{
                    bgcolor: dueTodayTasks.length > 0 ? "#FFF7ED" : "#F0FDF4",
                    color: dueTodayTasks.length > 0 ? "#C2410C" : "#15803D",
                    fontWeight: 700, fontSize: "0.7rem", height: 22, borderRadius: "6px",
                  }}
                />
              )
            }
            subtitle="Deliverables scheduled for completion today"
            action={
              <Button size="small" endIcon={<ArrowForwardIcon />} onClick={() => navigate("/admin/tasks")} sx={{ fontWeight: 700, textTransform: "none", color: "primary.main", borderRadius: 2, "&:hover": { bgcolor: "primary.50" } }}>
                All Tasks
              </Button>
            }
          >
            {loading ? (
              <Stack spacing={1.5}>
                {[1, 2, 3].map((i) => <Skeleton key={i} variant="rounded" height={60} sx={{ borderRadius: 3 }} />)}
              </Stack>
            ) : dueTodayTasks.length === 0 ? (
              <Box sx={{ py: 5, textAlign: "center", bgcolor: "grey.50", borderRadius: 3, border: "1px solid", borderColor: "divider", display: "flex", flexDirection: "column", alignItems: "center", minHeight: 220, justifyContent: "center" }}>
                <Box sx={{ width: 52, height: 52, borderRadius: "50%", bgcolor: "#F0FDF4", color: "#16A34A", display: "grid", placeItems: "center", mb: 1.5 }}>
                  <TaskAltIcon sx={{ fontSize: 26 }} />
                </Box>
                <Typography variant="body1" sx={{ fontWeight: 700, color: "text.primary" }}>All caught up for today!</Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.75, maxWidth: 280 }}>No pending tasks due. Great job keeping the bootcamp on schedule!</Typography>
                <Button size="small" variant="outlined" onClick={() => navigate("/admin/tasks")} sx={{ mt: 2.5, fontWeight: 700, borderRadius: 2.5, textTransform: "none", px: 2.5 }}>
                  Manage Tasks
                </Button>
              </Box>
            ) : (
              <Stack spacing={1.25}>
                {dueTodayTasks.slice(0, 5).map((task) => (
                  <TaskRow key={task._id || task.id} task={task} onClick={() => navigate("/admin/tasks")} />
                ))}
              </Stack>
            )}
          </SectionCard>
        </Grid>

        {/* Recent Students */}
        <Grid size={{ xs: 12, md: 5 }}>
          <SectionCard
            icon={<PeopleAltOutlinedIcon sx={{ fontSize: 18 }} />}
            iconBg="#EFF6FF"
            iconColor="#2563EB"
            title="Recent Students"
            subtitle={!loading ? `${recentStudents.length} enrolled · newly registered` : "Newly registered trainees"}
            action={
              <Button size="small" endIcon={<ArrowForwardIcon />} onClick={() => navigate("/admin/students")} sx={{ fontWeight: 700, textTransform: "none", color: "primary.main", borderRadius: 2, "&:hover": { bgcolor: "primary.50" } }}>
                All Students
              </Button>
            }
          >
            {loading ? (
              <Stack spacing={1.5}>
                {[1, 2, 3, 4].map((i) => <Skeleton key={i} variant="rounded" height={54} sx={{ borderRadius: 3 }} />)}
              </Stack>
            ) : recentStudents.length === 0 ? (
              <Box sx={{ py: 5, textAlign: "center", bgcolor: "grey.50", borderRadius: 3, border: "1px solid", borderColor: "divider", flex: 1, minHeight: 200, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <Typography variant="body2" sx={{ fontWeight: 700, color: "text.primary" }}>No students enrolled yet.</Typography>
                <Typography variant="caption" sx={{ color: "text.secondary", mt: 0.5 }}>New student registrations will appear here.</Typography>
              </Box>
            ) : (
              <Stack spacing={1.25}>
                {recentStudents.slice(0, 4).map((student) => (
                  <StudentRow
                    key={student._id || student.id}
                    student={student}
                    onClick={() => navigate(`/admin/students/${student._id || student.id}`)}
                  />
                ))}
              </Stack>
            )}
          </SectionCard>
        </Grid>
      </Grid>
    </PageContent>
  );
}
