import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  Typography,
  Box,
  Stack,
  LinearProgress,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TextField,
  InputAdornment,
  Avatar,
  Divider,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import FolderIcon from "@mui/icons-material/Folder";
import GroupsIcon from "@mui/icons-material/Groups";
import SearchIcon from "@mui/icons-material/Search";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import PageHeader from "../../components/common/PageHeader";
import { PageContent } from "../../components/layout/AppLayout";
import StatusChip from "../../components/common/StatusChip";
import { projectApi } from "../../services/projectApi";
import { taskApi } from "../../services/taskApi";
import { teamApi } from "../../services/teamApi";
import { useToast } from "../../context/ToastContext";

const PIE_COLORS = ["#10B981", "#3B82F6", "#F59E0B", "#6B7280"];

export default function AdminProgress() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { showToast } = useToast();

  useEffect(() => {
    let isMounted = true;
    const fetchProgressData = async () => {
      try {
        setLoading(true);
        const [projRes, tasksRes, teamsRes] = await Promise.allSettled([
          projectApi.getProjects(),
          taskApi.getTasks(),
          teamApi.getTeams(),
        ]);

        if (isMounted) {
          if (projRes.status === "fulfilled" && projRes.value.success) {
            setProjects(Array.isArray(projRes.value.data) ? projRes.value.data : []);
          }
          if (tasksRes.status === "fulfilled" && tasksRes.value.success) {
            setTasks(Array.isArray(tasksRes.value.data) ? tasksRes.value.data : []);
          }
          if (teamsRes.status === "fulfilled" && teamsRes.value.success) {
            setTeams(Array.isArray(teamsRes.value.data) ? teamsRes.value.data : []);
          }
        }
      } catch (err) {
        if (isMounted) showToast(err?.message || "Failed to load progress data", "error");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProgressData();
    return () => {
      isMounted = false;
    };
  }, [showToast]);

  const completedTasks = tasks.filter((t) => t.status === "done" || t.status === "completed").length;
  const inProgressTasks = tasks.filter((t) => t.status === "in-progress" || t.status === "in_progress").length;
  const underReviewTasks = tasks.filter((t) => t.status === "under_review").length;
  const todoTasks = tasks.filter((t) => t.status === "todo" || !t.status).length;
  const overallTaskProgress = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

  const projectChartData = projects.slice(0, 8).map((p) => {
    const title = p.title || p.name || "Untitled Project";
    return {
      name: title.length > 14 ? title.substring(0, 14) + "..." : title,
      progress: Math.round(p.progress || 0),
    };
  });

  const taskPieData = [
    { name: "Completed", value: completedTasks },
    { name: "In Progress", value: inProgressTasks },
    { name: "Under Review", value: underReviewTasks },
    { name: "To Do", value: todoTasks },
  ].filter((d) => d.value > 0);

  const filteredProjects = projects.filter((p) => {
    const title = p.title || p.name || "";
    const matchesSearch =
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.team?.name || p.teamId?.name || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getProgressColor = (prog) => {
    if (prog >= 75) return "success";
    if (prog >= 40) return "primary";
    return "warning";
  };

  return (
    <PageContent>
      <PageHeader
        title="Bootcamp Progress Overview"
        description="Monitor team project milestones, deliverable completion velocity, and task statistics across all active batches."
      />

      {/* Clean Stat Cards Row */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            elevation={0}
            sx={{
              p: 2.5,
              background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
              color: "#fff",
              borderRadius: 3.5,
              boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.15)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              "&:hover": { transform: "translateY(-2px)", boxShadow: "0 14px 30px -5px rgba(15, 23, 42, 0.22)" },
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.03em" }}>
                  Task Completion Rate
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5, letterSpacing: "-0.02em" }}>
                  {loading ? <Skeleton width={60} sx={{ bgcolor: "rgba(255,255,255,0.2)" }} /> : `${Math.round(overallTaskProgress)}%`}
                </Typography>
                <Typography variant="caption" sx={{ color: "#34d399", fontWeight: 700, display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
                  <CheckCircleIcon fontSize="inherit" /> {completedTasks} / {tasks.length} Completed
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: "rgba(16, 185, 129, 0.2)", color: "#34d399", width: 48, height: 48 }}>
                <TrendingUpIcon />
              </Avatar>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 3.5,
              bgcolor: "#ffffff",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 18px rgba(0, 0, 0, 0.03)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              "&:hover": { transform: "translateY(-2px)", boxShadow: "0 8px 24px rgba(0, 0, 0, 0.06)" },
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: "uppercase", letterSpacing: "0.03em" }}>
                  Active Projects
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5, color: "#0f172a" }}>
                  {loading ? <Skeleton width={40} /> : projects.length}
                </Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={500} sx={{ mt: 0.5, display: "block" }}>
                  Across capstone modules
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: "#eff6ff", color: "#1e40af", width: 48, height: 48 }}>
                <FolderIcon />
              </Avatar>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 3.5,
              bgcolor: "#ffffff",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 18px rgba(0, 0, 0, 0.03)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              "&:hover": { transform: "translateY(-2px)", boxShadow: "0 8px 24px rgba(0, 0, 0, 0.06)" },
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: "uppercase", letterSpacing: "0.03em" }}>
                  Total Deliverables
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5, color: "#0f172a" }}>
                  {loading ? <Skeleton width={40} /> : tasks.length}
                </Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={500} sx={{ mt: 0.5, display: "block" }}>
                  Assigned student tasks
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: "#f0fdf4", color: "#16a34a", width: 48, height: 48 }}>
                <AssignmentTurnedInIcon />
              </Avatar>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 3.5,
              bgcolor: "#ffffff",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 18px rgba(0, 0, 0, 0.03)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              "&:hover": { transform: "translateY(-2px)", boxShadow: "0 8px 24px rgba(0, 0, 0, 0.06)" },
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: "uppercase", letterSpacing: "0.03em" }}>
                  Active Teams
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5, color: "#0f172a" }}>
                  {loading ? <Skeleton width={40} /> : teams.length}
                </Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={500} sx={{ mt: 0.5, display: "block" }}>
                  Organized squads
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: "#fff7ed", color: "#ea580c", width: 48, height: 48 }}>
                <GroupsIcon />
              </Avatar>
            </Stack>
          </Card>
        </Grid>
      </Grid>

      {/* Visual Analytics Charts Section */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} lg={7}>
          <Card
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3.5,
              bgcolor: "#ffffff",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)",
              height: "100%",
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a" }}>
                  Project Completion Rates
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Percentage milestone progress for active capstone projects
                </Typography>
              </Box>
              <Chip label="Live Metrics" color="success" size="small" variant="soft" sx={{ fontWeight: 700 }} />
            </Stack>
            <Divider sx={{ mb: 3 }} />

            {loading ? (
              <Skeleton variant="rounded" height={260} />
            ) : projectChartData.length === 0 ? (
              <Box sx={{ py: 8, textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  No project data available to visualize.
                </Typography>
              </Box>
            ) : (
              <Box sx={{ width: "100%", height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={projectChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                    <RechartsTooltip
                      formatter={(val) => [`${val}%`, "Completion"]}
                      contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", borderRadius: 8, color: "#fff" }}
                      itemStyle={{ color: "#38bdf8" }}
                    />
                    <Bar dataKey="progress" fill="#0284c7" radius={[6, 6, 0, 0]} barSize={36} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            )}
          </Card>
        </Grid>

        <Grid item xs={12} lg={5}>
          <Card
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3.5,
              bgcolor: "#ffffff",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)",
              height: "100%",
            }}
          >
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a" }}>
                Task Status Distribution
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Breakdown of deliverables by execution status
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />

            {loading ? (
              <Skeleton variant="circular" width={180} height={180} sx={{ mx: "auto", my: 2 }} />
            ) : taskPieData.length === 0 ? (
              <Box sx={{ py: 8, textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  No task status data logged.
                </Typography>
              </Box>
            ) : (
              <Box sx={{ width: "100%", height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={taskPieData} innerRadius={60} outerRadius={85} paddingAngle={4} dataKey="value">
                      {taskPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", borderRadius: 8, color: "#fff" }}
                    />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            )}
          </Card>
        </Grid>
      </Grid>

      {/* Project Progress Breakdown Table Card */}
      <Card
        elevation={0}
        sx={{
          borderRadius: 3.5,
          bgcolor: "#ffffff",
          border: "1px solid #e2e8f0",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)",
          overflow: "hidden",
        }}
      >
        <Box sx={{ p: 3, bgcolor: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="space-between" alignItems={{ xs: "stretch", sm: "center" }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a" }}>
                Detailed Project Progress Breakdown
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Live team deliverables and progress tracking
              </Typography>
            </Box>

            <Stack direction="row" spacing={1.5} flexWrap="wrap">
              <TextField
                size="small"
                placeholder="Search project or team..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" sx={{ color: "text.secondary" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  bgcolor: "#ffffff",
                  borderRadius: 2,
                  minWidth: 220,
                  "& .MuiOutlinedInput-root": { borderRadius: 2 },
                }}
              />

              <Stack direction="row" spacing={0.5} sx={{ bgcolor: "#ffffff", p: 0.5, borderRadius: 2, border: "1px solid #e2e8f0" }}>
                {["all", "pending", "in-progress", "completed"].map((st) => (
                  <Chip
                    key={st}
                    label={st === "all" ? "All" : st.replace("-", " ").toUpperCase()}
                    size="small"
                    color={statusFilter === st ? "primary" : "default"}
                    variant={statusFilter === st ? "filled" : "text"}
                    onClick={() => setStatusFilter(st)}
                    sx={{ cursor: "pointer", fontWeight: 700, fontSize: 11, borderRadius: 1.5 }}
                  />
                ))}
              </Stack>
            </Stack>
          </Stack>
        </Box>

        {loading ? (
          <Box sx={{ p: 3 }}>
            <Skeleton variant="rounded" height={200} />
          </Box>
        ) : filteredProjects.length === 0 ? (
          <Box sx={{ py: 6, textAlign: "center" }}>
            <HourglassTopIcon sx={{ fontSize: 40, color: "text.secondary", mb: 1 }} />
            <Typography variant="h6" color="text.secondary" fontWeight={700}>
              No matching projects found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your search query or status filter.
            </Typography>
          </Box>
        ) : (
          <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 0 }}>
            <Table>
              <TableHead sx={{ bgcolor: "#f8fafc" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Project Title</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Assigned Team</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Progress Rate</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProjects.map((p) => {
                  const title = p.title || p.name || "Untitled Project";
                  const prog = Math.round(p.progress || 0);
                  const color = getProgressColor(prog);
                  return (
                    <TableRow key={p._id || p.id} hover sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                      <TableCell>
                        <Typography variant="body2" fontWeight={700} color="#0f172a">
                          {title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 280, display: "block" }}>
                          {p.description || "No project description provided."}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Chip
                          icon={<GroupsIcon fontSize="small" />}
                          label={p.team?.name || p.teamId?.name || "Unassigned"}
                          size="small"
                          variant="outlined"
                          sx={{ fontWeight: 600, borderRadius: 2 }}
                        />
                      </TableCell>

                      <TableCell>
                        <StatusChip status={p.status || "pending"} />
                      </TableCell>

                      <TableCell sx={{ width: 280 }}>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Box sx={{ flex: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={Math.min(100, Math.max(0, prog))}
                              color={color}
                              sx={{ height: 8, borderRadius: 4, bgcolor: "#f1f5f9" }}
                            />
                          </Box>
                          <Typography variant="body2" fontWeight={800} color={`${color}.main`}>
                            {prog}%
                          </Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>
    </PageContent>
  );
}
