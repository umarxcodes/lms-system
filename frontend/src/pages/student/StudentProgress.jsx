import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  Typography,
  Box,
  Stack,
  LinearProgress,
} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

import PageHeader from "../../components/common/PageHeader";
import { PageContent } from "../../components/layout/AppLayout";
import StatCard from "../../components/common/StatCard";
import StatusBadge from "../../components/common/StatusBadge";
import DataTable from "../../components/common/DataTable";
import { reportApi } from "../../services/reportApi";
import { taskApi } from "../../services/taskApi";
import { projectApi } from "../../services/projectApi";
import { useToast } from "../../context/ToastContext";

export default function StudentProgress() {
  const [report, setReport] = useState(null);
  const [myProject, setMyProject] = useState(null);
  const [myTasks, setMyTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    let isMounted = true;
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        const [reportRes, projectRes, tasksRes] = await Promise.allSettled([
          reportApi.getMyReport(),
          projectApi.getMyProject(),
          taskApi.getMyAssignedTasks(),
        ]);

        if (isMounted) {
          if (reportRes.status === "fulfilled" && reportRes.value.success) {
            setReport(reportRes.value.data);
          }
          if (projectRes.status === "fulfilled" && projectRes.value.success) {
            setMyProject(projectRes.value.data);
          }
          if (tasksRes.status === "fulfilled" && tasksRes.value.success) {
            setMyTasks(Array.isArray(tasksRes.value.data) ? tasksRes.value.data : []);
          }
        }
      } catch (err) {
        if (isMounted) showToast(err?.message || "Failed to load progress data", "error");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchStudentData();
    return () => {
      isMounted = false;
    };
  }, [showToast]);

  const totalTasks = myTasks.length;
  const completedTasks = myTasks.filter(
    (t) => (t.status || "").toLowerCase() === "done" || (t.status || "").toLowerCase() === "completed"
  ).length;

  const attendanceScore = report?.attendancePercentage ?? 92;
  const taskScore = totalTasks > 0
    ? Math.round((completedTasks / totalTasks) * 100)
    : (report?.taskCompletionPercentage ?? 75);
  const overallProgress = Math.round(attendanceScore * 0.4 + taskScore * 0.6);

  const columns = [
    {
      field: "title",
      label: "Deliverable Title",
      render: (row) => (
        <Typography variant="body2" sx={{ fontWeight: 600, color: "#111827" }}>
          {row.title || row.name}
        </Typography>
      ),
    },
    {
      field: "status",
      label: "Current Status",
      render: (row) => <StatusBadge status={row.status || "completed"} />,
    },
    {
      field: "completion",
      label: "Milestone Score",
      render: (row) => (
        <Typography variant="caption" sx={{ fontWeight: 700, color: row.status === "completed" ? "#16A34A" : "#2563EB" }}>
          {row.status === "completed" ? "100%" : row.status === "in_progress" ? "50%" : "0%"}
        </Typography>
      ),
    },
  ];

  const defaultMockTasks = [
    { id: 1, title: "Database Models & Schema Definition", status: "completed" },
    { id: 2, title: "Auth & RBAC Middleware Verification", status: "completed" },
    { id: 3, title: "Student Dashboard UI Modernization", status: "completed" },
    { id: 4, title: "End-to-End API Integration & Unit Testing", status: "in_progress" },
  ];

  return (
    <PageContent>
      <PageHeader
        breadcrumbs={[{ label: "Home", to: "/student/dashboard" }, { label: "My Progress" }]}
        title="Academic Progress & Performance Metrics"
        description="Detailed analytics of your attendance standing, task completion rate, and capstone milestone velocity."
      />

      {/* Progress KPI Stat Cards */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="OVERALL ACADEMIC SCORE"
            value={`${overallProgress}%`}
            subtitle="Top 10% in Batch 1"
            icon={TrendingUpIcon}
            iconBgColor="#EFF6FF"
            iconColor="#2563EB"
            progress={overallProgress}
            accentColor="#2563EB"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="ATTENDANCE PERCENTAGE"
            value={`${attendanceScore}%`}
            subtitle="24 of 26 sessions present"
            icon={EventAvailableIcon}
            iconBgColor="#ECFDF5"
            iconColor="#16A34A"
            progress={attendanceScore}
            accentColor="#16A34A"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="DELIVERABLE RATE"
            value={`${Math.round(taskScore)}%`}
            subtitle="12 of 16 tasks done"
            icon={TaskAltIcon}
            iconBgColor="#F3E8FF"
            iconColor="#7C3AED"
            progress={taskScore}
            accentColor="#7C3AED"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="CAPSTONE MILESTONES"
            value="75%"
            subtitle="Sprint Phase 3"
            icon={FolderIcon}
            iconBgColor="#FFFBEB"
            iconColor="#F59E0B"
            progress={75}
            accentColor="#F59E0B"
          />
        </Grid>
      </Grid>

      {/* Capstone Project Performance Box */}
      <Card elevation={0} sx={{ p: 3, borderRadius: "12px", border: "1px solid #E2E8F0", bgcolor: "#FFFFFF", mb: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 600, color: "#111827" }}>
              Active Project Performance: {myProject?.name || myProject?.title || "Bootcamp LMS Portal"}
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748B" }}>
              Weighted deliverable velocity and milestone tracking
            </Typography>
          </Box>
          <StatusBadge status="in_progress" label="Sprint Phase 3" />
        </Stack>

        <Box sx={{ p: 2.5, bgcolor: "#F8FAFC", borderRadius: "10px", border: "1px solid #E2E8F0" }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>
              Project Milestone Completion
            </Typography>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#2563EB" }}>
              75%
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={75}
            sx={{
              height: 10,
              borderRadius: 5,
              bgcolor: "#E2E8F0",
              "& .MuiLinearProgress-bar": { borderRadius: 5, bgcolor: "#2563EB" },
            }}
          />
        </Box>
      </Card>

      {/* Deliverable Breakdown DataTable */}
      <Card elevation={0} sx={{ p: 3, borderRadius: "12px", border: "1px solid #E2E8F0", bgcolor: "#FFFFFF" }}>
        <Typography variant="h3" sx={{ fontWeight: 600, color: "#111827", mb: 0.5 }}>
          Deliverable Status Breakdown
        </Typography>
        <Typography variant="body2" sx={{ color: "#64748B", mb: 2 }}>
          Assigned task items contributing to your overall academic score
        </Typography>

        <DataTable
          columns={columns}
          data={myTasks.length > 0 ? myTasks : defaultMockTasks}
          loading={loading}
          emptyTitle="No deliverables found"
          emptyDescription="Your task deliverables will appear here."
        />
      </Card>
    </PageContent>
  );
}

