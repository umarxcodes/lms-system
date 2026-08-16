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
import { useNavigate } from "react-router-dom";

import { PageContent } from "../../components/layout/AppLayout";
import StatCard from "../../components/common/StatCard";
import StatusChip from "../../components/common/StatusChip";
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
      <Box>
        <Typography
          variant="caption"
          sx={{
            display: "block",
            fontWeight: 700,
            color: "text.disabled",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            mb: 1.5,
          }}
        >
          Quick Actions
        </Typography>
        <Stack direction="row" flexWrap="wrap" gap={1}>
          {[
            { label: "Add Student", icon: <AddIcon fontSize="small" />, to: "/admin/students" },
            { label: "Create Team", icon: <GroupsIcon fontSize="small" />, to: "/admin/teams" },
            { label: "Create Project", icon: <FolderOpenIcon fontSize="small" />, to: "/admin/projects" },
            { label: "Create Task", icon: <AssignmentIcon fontSize="small" />, to: "/admin/tasks" },
            { label: "View Reports", icon: <AssessmentOutlinedIcon fontSize="small" />, to: "/admin/reports" },
          ].map((action) => (
            <Button
              key={action.label}
              size="small"
              variant="outlined"
              startIcon={action.icon}
              onClick={() => navigate(action.to)}
              sx={{
                borderColor: "divider",
                color: "text.secondary",
                fontWeight: 600,
                fontSize: "0.8rem",
                px: 1.5,
                "&:hover": {
                  borderColor: "primary.main",
                  color: "primary.main",
                  bgcolor: "primary.50",
                },
              }}
            >
              {action.label}
            </Button>
          ))}
        </Stack>
      </Box>

      {/* ─── Data Tables ─── */}
      <Grid container spacing={2.5}>
        {/* Tasks Due Today */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider", height: "100%" }}>
            <CardContent sx={{ p: 2.5 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: "text.primary" }}>
                    Tasks Due Today
                  </Typography>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    Tasks scheduled for completion today
                  </Typography>
                </Box>
                <Button
                  size="small"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate("/admin/tasks")}
                  sx={{ fontWeight: 600 }}
                >
                  All Tasks
                </Button>
              </Stack>
              <Divider sx={{ mb: 2 }} />

              {loading ? (
                <Stack spacing={1.5}>
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} variant="rounded" height={40} sx={{ borderRadius: 1.5 }} />
                  ))}
                </Stack>
              ) : dueTodayTasks.length === 0 ? (
                <Box sx={{ py: 4, textAlign: "center" }}>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    No tasks due today — all caught up.
                  </Typography>
                </Box>
              ) : (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Title</TableCell>
                        <TableCell>Project</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dueTodayTasks.slice(0, 5).map((t) => (
                        <TableRow key={t._id || t.id}>
                          <TableCell sx={{ fontWeight: 600 }}>{t.title}</TableCell>
                          <TableCell>{t.project?.name || t.projectId?.name || "—"}</TableCell>
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

        {/* Recent Students */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider", height: "100%" }}>
            <CardContent sx={{ p: 2.5 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: "text.primary" }}>
                    Recent Students
                  </Typography>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    Newly enrolled trainees
                  </Typography>
                </Box>
                <Button
                  size="small"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate("/admin/students")}
                  sx={{ fontWeight: 600 }}
                >
                  All Students
                </Button>
              </Stack>
              <Divider sx={{ mb: 2 }} />

              {loading ? (
                <Stack spacing={1.5}>
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} variant="rounded" height={40} sx={{ borderRadius: 1.5 }} />
                  ))}
                </Stack>
              ) : recentStudents.length === 0 ? (
                <Box sx={{ py: 4, textAlign: "center" }}>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    No students enrolled yet.
                  </Typography>
                </Box>
              ) : (
                <Stack spacing={0.5}>
                  {recentStudents.slice(0, 5).map((s) => (
                    <Stack
                      key={s._id || s.id}
                      direction="row"
                      spacing={1.5}
                      alignItems="center"
                      onClick={() => navigate(`/admin/students/${s._id || s.id}`)}
                      sx={{
                        p: 1,
                        borderRadius: 2,
                        cursor: "pointer",
                        transition: "background-color 0.15s ease",
                        "&:hover": { bgcolor: "grey.50" },
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          fontSize: "0.8rem",
                          bgcolor: "primary.main",
                          fontWeight: 700,
                        }}
                      >
                        {(s.name || s.user?.name || "S")[0].toUpperCase()}
                      </Avatar>
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary" }} noWrap>
                          {s.name || s.user?.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "text.disabled" }}>
                          {s.rollNumber || "No roll number"}
                        </Typography>
                      </Box>
                    </Stack>
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
