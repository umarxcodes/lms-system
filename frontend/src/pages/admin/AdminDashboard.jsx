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
  Chip,
  Avatar,
  Divider,
} from "@mui/material";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import GroupsIcon from "@mui/icons-material/Groups";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { useNavigate } from "react-router-dom";

import { PageContent } from "../../components/layout/AppLayout";
import StatCard from "../../components/common/StatCard";
import StatusChip from "../../components/common/StatusChip";
import ActionButton from "../../components/common/ActionButton";
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
} from "recharts";

// Semantic status colors aligned with theme palette
const ATTENDANCE_COLORS = ["#16a34a", "#dc2626", "#d97706", "#0284c7"];
const TASK_BAR_COLOR = "#1e40af";

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

  // --- Data extraction with safe defaults ---
  const summary = data?.summary || {};
  const attendanceBreakdown = data?.attendanceBreakdown || data?.attendance || {};
  const taskStatus = data?.taskStatusBreakdown || data?.tasks || {};
  const dueTodayTasks = data?.dueTodayTasks || [];
  const recentStudents = data?.recentStudents || data?.students || [];

  // --- Chart data ---
  const pieData = [
    { name: "Present", value: attendanceBreakdown.present || 0 },
    { name: "Absent", value: attendanceBreakdown.absent || 0 },
    { name: "Late", value: attendanceBreakdown.late || 0 },
    { name: "Leave", value: attendanceBreakdown.leave || attendanceBreakdown.excused || 0 },
  ].filter((d) => d.value > 0);

  // Fallback to summary-level data if breakdown is empty
  const finalPieData =
    pieData.length > 0
      ? pieData
      : [
          { name: "Present", value: summary.presentToday || 0 },
          { name: "Absent", value: summary.absentToday || 0 },
        ].filter((d) => d.value > 0);

  const barData = [
    { name: "To Do", count: taskStatus.pending ?? taskStatus.todo ?? 0 },
    { name: "In Progress", count: taskStatus.inProgress ?? taskStatus["in-progress"] ?? 0 },
    { name: "Done", count: taskStatus.completed ?? taskStatus.done ?? 0 },
  ];

  // --- Time-aware greeting ---
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
      {/* ─── Page Header ─── */}
      <Box>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={1}
        >
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: "text.primary", mb: 0.25 }}>
              {greeting}, {user?.name || "Administrator"}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Here's an overview of your bootcamp operations · {dateStr}
            </Typography>
          </Box>

          <Tooltip title="Refresh data">
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

      {/* ─── Error State ─── */}
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

      {/* ─── Notification Banner (only when unread) ─── */}
      {unreadCount > 0 && (
        <Alert
          severity="info"
          icon={<NotificationsNoneOutlinedIcon fontSize="small" />}
          sx={{ borderRadius: 3 }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => navigate("/admin/notifications")}
              sx={{ fontWeight: 700 }}
            >
              View
            </Button>
          }
        >
          You have <strong>{unreadCount}</strong> unread notification{unreadCount > 1 ? "s" : ""}.
        </Alert>
      )}

      {/* ─── KPI Metrics ─── */}
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          {loading ? (
            <Skeleton variant="rounded" height={120} sx={{ borderRadius: 3 }} />
          ) : (
            <StatCard
              title="Total Students"
              value={summary.totalStudents ?? 0}
              icon={PeopleAltOutlinedIcon}
              iconBgColor="#eff6ff"
              iconColor="#1e40af"
              subtitle="Registered bootcamp trainees"
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          {loading ? (
            <Skeleton variant="rounded" height={120} sx={{ borderRadius: 3 }} />
          ) : (
            <StatCard
              title="Present Today"
              value={summary.presentToday ?? 0}
              icon={EventAvailableIcon}
              iconBgColor="#f0fdf4"
              iconColor="#16a34a"
              subtitle={`${summary.absentToday ?? 0} absent today`}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          {loading ? (
            <Skeleton variant="rounded" height={120} sx={{ borderRadius: 3 }} />
          ) : (
            <StatCard
              title="Teams"
              value={summary.totalTeams ?? 0}
              icon={GroupsIcon}
              iconBgColor="#faf5ff"
              iconColor="#9333ea"
              subtitle="Active project teams"
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          {loading ? (
            <Skeleton variant="rounded" height={120} sx={{ borderRadius: 3 }} />
          ) : (
            <StatCard
              title="Pending Tasks"
              value={summary.pendingTasks ?? 0}
              icon={AssignmentTurnedInIcon}
              iconBgColor="#fff7ed"
              iconColor="#ea580c"
              subtitle="Awaiting completion"
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
                Today's Attendance
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary", mb: 2 }}>
                Student attendance breakdown for today
              </Typography>

              {loading ? (
                <Skeleton variant="rounded" height={250} sx={{ borderRadius: 2, flex: 1 }} />
              ) : finalPieData.length === 0 ? (
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
                    No attendance records for today.
                  </Typography>
                  <Typography variant="caption" sx={{ color: "text.disabled", mt: 0.5 }}>
                    Records will appear here once attendance is marked.
                  </Typography>
                  <Button
                    size="small"
                    onClick={() => navigate("/admin/attendance")}
                    sx={{ mt: 1.5, fontWeight: 600 }}
                  >
                    Mark Attendance
                  </Button>
                </Box>
              ) : (
                <Box sx={{ flex: 1, minHeight: 0 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={finalPieData}
                        cx="50%"
                        cy="45%"
                        innerRadius={60}
                        outerRadius={88}
                        paddingAngle={3}
                        dataKey="value"
                        strokeWidth={0}
                      >
                        {finalPieData.map((_, i) => (
                          <Cell key={`cell-${i}`} fill={ATTENDANCE_COLORS[i % ATTENDANCE_COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip
                        formatter={(val, name) => [`${val} students`, name]}
                        contentStyle={{ borderRadius: 8, fontSize: 13, border: "1px solid #e2e8f0" }}
                      />
                      <Legend
                        verticalAlign="bottom"
                        height={32}
                        iconType="circle"
                        iconSize={8}
                        formatter={(val) => <span style={{ color: "#64748b", fontSize: 12 }}>{val}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Task Distribution Bar */}
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
                Task Distribution
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary", mb: 2 }}>
                Current status of all bootcamp tasks
              </Typography>

              {loading ? (
                <Skeleton variant="rounded" height={250} sx={{ borderRadius: 2, flex: 1 }} />
              ) : (
                <Box sx={{ flex: 1, minHeight: 0 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
                      <XAxis
                        dataKey="name"
                        stroke="#94a3b8"
                        fontSize={12}
                        tickLine={false}
                        axisLine={{ stroke: "#e2e8f0" }}
                      />
                      <YAxis
                        stroke="#94a3b8"
                        fontSize={12}
                        allowDecimals={false}
                        tickLine={false}
                        axisLine={false}
                      />
                      <RechartsTooltip
                        formatter={(val) => [`${val} tasks`, "Count"]}
                        contentStyle={{ borderRadius: 8, fontSize: 13, border: "1px solid #e2e8f0" }}
                      />
                      <Bar dataKey="count" fill={TASK_BAR_COLOR} radius={[4, 4, 0, 0]} barSize={36} />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ─── Quick Actions ─── */}
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
              Frequently used management shortcuts & operations
            </Typography>
          </Box>
        </Stack>

        <Grid container spacing={2}>
          {[
            {
              label: "Add Student",
              desc: "Register trainee",
              icon: <PeopleAltOutlinedIcon sx={{ fontSize: 18 }} />,
              to: "/admin/students",
              color: "#2563EB",
              bg: "#EFF6FF",
            },
            {
              label: "Create Team",
              desc: "Build new group",
              icon: <GroupsIcon sx={{ fontSize: 18 }} />,
              to: "/admin/teams",
              color: "#9333EA",
              bg: "#FAF5FF",
            },
            {
              label: "Create Project",
              desc: "Assign capstone",
              icon: <FolderOpenIcon sx={{ fontSize: 18 }} />,
              to: "/admin/projects",
              color: "#0284C7",
              bg: "#F0F9FF",
            },
            {
              label: "Create Task",
              desc: "Add deliverable",
              icon: <AssignmentIcon sx={{ fontSize: 18 }} />,
              to: "/admin/tasks?create=true",
              color: "#EA580C",
              bg: "#FFF7ED",
            },
            {
              label: "View Reports",
              desc: "Analytics & export",
              icon: <AssessmentOutlinedIcon sx={{ fontSize: 18 }} />,
              to: "/admin/reports",
              color: "#16A34A",
              bg: "#F0FDF4",
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

      {/* ─── Data Tables ─── */}
      <Grid container spacing={2.5}>
        {/* Tasks Due Today */}
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
                    <EventAvailableIcon sx={{ fontSize: 18 }} />
                  </Box>
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="h6" sx={{ fontWeight: 800, color: "#0F172A", fontSize: "1.05rem" }}>
                        Tasks Due Today
                      </Typography>
                      {!loading && (
                        <Chip
                          label={dueTodayTasks.length > 0 ? `${dueTodayTasks.length} Due` : "Caught Up"}
                          size="small"
                          sx={{
                            bgcolor: dueTodayTasks.length > 0 ? "#FFF7ED" : "#F0FDF4",
                            color: dueTodayTasks.length > 0 ? "#C2410C" : "#15803D",
                            fontWeight: 700,
                            fontSize: "0.7rem",
                            height: 22,
                            borderRadius: "6px",
                          }}
                        />
                      )}
                    </Stack>
                    <Typography variant="caption" sx={{ color: "#64748B", fontSize: "0.75rem" }}>
                      Deliverables scheduled for completion today
                    </Typography>
                  </Box>
                </Stack>
                <Button
                  size="small"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate("/admin/tasks")}
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
              ) : dueTodayTasks.length === 0 ? (
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
                    All deliverables for today are completed!
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#64748B", mt: 0.5, maxWidth: 280 }}>
                    No pending tasks due today. Great job keeping your bootcamp on schedule!
                  </Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => navigate("/admin/tasks")}
                    sx={{ mt: 2, fontWeight: 700, borderRadius: "8px", textTransform: "none" }}
                  >
                    Manage Tasks
                  </Button>
                </Box>
              ) : (
                <Stack spacing={1.25}>
                  {dueTodayTasks.slice(0, 5).map((task) => {
                    const projTitle = task.project?.title || task.project?.name || task.projectId?.name || "Unassigned Project";
                    const studentName = task.assignedTo?.name || task.assignedTo?.user?.name || "Unassigned";

                    return (
                      <Paper
                        key={task._id || task.id}
                        elevation={0}
                        onClick={() => navigate("/admin/tasks")}
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
                            <Avatar
                              sx={{
                                width: 34,
                                height: 34,
                                fontSize: "0.8rem",
                                bgcolor: task.assignedTo ? "#2563EB" : "#94A3B8",
                                fontWeight: 700,
                              }}
                            >
                              {(studentName || "U")[0].toUpperCase()}
                            </Avatar>

                            <Box sx={{ minWidth: 0 }}>
                              <Typography variant="body2" sx={{ fontWeight: 700, color: "#0F172A", lineHeight: 1.2 }} noWrap>
                                {task.title}
                              </Typography>
                              <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                                <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 600 }} noWrap>
                                  {projTitle}
                                </Typography>
                                <Typography variant="caption" sx={{ color: "#CBD5E1" }}>
                                  •
                                </Typography>
                                <Typography variant="caption" sx={{ color: "#475569" }} noWrap>
                                  Assigned to {studentName}
                                </Typography>
                              </Stack>
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

        {/* Recent Students */}
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
                      bgcolor: "#EFF6FF",
                      color: "#2563EB",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <PeopleAltOutlinedIcon sx={{ fontSize: 18 }} />
                  </Box>
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="h6" sx={{ fontWeight: 800, color: "#0F172A", fontSize: "1.05rem" }}>
                        Recent Students
                      </Typography>
                      {!loading && (
                        <Chip
                          label={`${recentStudents.length} Enrolled`}
                          size="small"
                          sx={{
                            bgcolor: "#EFF6FF",
                            color: "#1D4ED8",
                            fontWeight: 700,
                            fontSize: "0.7rem",
                            height: 22,
                            borderRadius: "6px",
                          }}
                        />
                      )}
                    </Stack>
                    <Typography variant="caption" sx={{ color: "#64748B", fontSize: "0.75rem" }}>
                      Newly registered bootcamp trainees
                    </Typography>
                  </Box>
                </Stack>
                <Button
                  size="small"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate("/admin/students")}
                  sx={{
                    fontWeight: 700,
                    textTransform: "none",
                    color: "#2563EB",
                    borderRadius: "8px",
                    px: 1.5,
                    "&:hover": { bgcolor: "#EFF6FF" },
                  }}
                >
                  All Students
                </Button>
              </Stack>
              <Divider sx={{ mb: 2 }} />

              {loading ? (
                <Stack spacing={1.5}>
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} variant="rounded" height={54} sx={{ borderRadius: "12px" }} />
                  ))}
                </Stack>
              ) : recentStudents.length === 0 ? (
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
                  <Typography variant="body2" sx={{ color: "#0F172A", fontWeight: 700 }}>
                    No students enrolled yet.
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#64748B", mt: 0.5 }}>
                    New student registrations will appear here.
                  </Typography>
                </Box>
              ) : (
                <Stack spacing={1.25}>
                  {recentStudents.slice(0, 5).map((student) => {
                    const studentName = student.name || student.user?.name || "Student";
                    const rollNo = student.rollNumber || "No Roll Number";

                    return (
                      <Paper
                        key={student._id || student.id}
                        elevation={0}
                        onClick={() => navigate(`/admin/students/${student._id || student.id}`)}
                        sx={{
                          p: 1.5,
                          px: 1.75,
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
                            <Avatar
                              sx={{
                                width: 36,
                                height: 36,
                                fontSize: "0.85rem",
                                bgcolor: "#2563EB",
                                color: "#FFFFFF",
                                fontWeight: 800,
                                boxShadow: "0 2px 4px rgba(37, 99, 235, 0.2)",
                              }}
                            >
                              {studentName[0].toUpperCase()}
                            </Avatar>

                            <Box sx={{ minWidth: 0 }}>
                              <Typography variant="body2" sx={{ fontWeight: 700, color: "#0F172A", lineHeight: 1.2 }} noWrap>
                                {studentName}
                              </Typography>
                              <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 600, display: "block", mt: 0.25 }} noWrap>
                                Roll: {rollNo}
                              </Typography>
                            </Box>
                          </Stack>

                          <Stack direction="row" spacing={1} alignItems="center">
                            <Chip
                              label="Active"
                              size="small"
                              sx={{
                                bgcolor: "#F0FDF4",
                                color: "#16A34A",
                                fontWeight: 700,
                                fontSize: "0.7rem",
                                height: 22,
                                borderRadius: "6px",
                              }}
                            />
                            <ActionButton type="view" title="View student profile" />
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
      </Grid>
    </PageContent>
  );
}
