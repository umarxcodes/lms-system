import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  Typography,
  Box,
  Stack,
  LinearProgress,
  Skeleton,
  Avatar,
  Chip,
  Divider,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import VerifiedIcon from "@mui/icons-material/Verified";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

import PageHeader from "../../components/common/PageHeader";
import { PageContent } from "../../components/layout/AppLayout";
import { reportApi } from "../../services/reportApi";
import { useToast } from "../../context/ToastContext";

export default function StudentProgress() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    reportApi
      .getMyReport()
      .then((res) => {
        if (res.success && res.data) setReport(res.data);
      })
      .catch((err) => showToast(err?.message || "Failed to load progress metrics", "error"))
      .finally(() => setLoading(false));
  }, [showToast]);

  const attendanceScore = report?.attendancePercentage ?? 100;
  const taskScore = report?.taskCompletionPercentage ?? 0;
  const combinedScore = Math.round((attendanceScore * 0.4) + (taskScore * 0.6));

  const getGradeInfo = (score) => {
    if (score >= 90) return { grade: "A+", label: "Exceptional", color: "#10b981", bg: "rgba(16, 185, 129, 0.1)" };
    if (score >= 80) return { grade: "A", label: "Meritorious", color: "#0284c7", bg: "rgba(2, 132, 199, 0.1)" };
    if (score >= 70) return { grade: "B", label: "Good Standing", color: "#6366f1", bg: "rgba(99, 102, 241, 0.1)" };
    if (score >= 60) return { grade: "C", label: "Satisfactory", color: "#f59e0b", bg: "rgba(245, 158, 11, 0.1)" };
    return { grade: "D", label: "Needs Focus", color: "#ef4444", bg: "rgba(239, 68, 68, 0.1)" };
  };

  const gradeInfo = getGradeInfo(combinedScore);

  return (
    <PageContent>
      <PageHeader
        title="My Progress & Trainee Dashboard"
        description="Monitor your real-time attendance rate, task completion milestone velocity, and overall bootcamp academic standing."
      />

      {/* Main Performance Showcase Card */}
      <Card
        sx={{
          p: 4,
          mb: 3,
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          color: "#fff",
          borderRadius: 3.5,
          boxShadow: "0 12px 32px rgba(15, 23, 42, 0.2)",
        }}
      >
        {loading ? (
          <Skeleton variant="rounded" height={100} sx={{ bgcolor: "rgba(255,255,255,0.1)" }} />
        ) : (
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={7}>
              <Stack direction="row" spacing={2.5} alignItems="center">
                <Avatar
                  sx={{
                    width: 72,
                    height: 72,
                    bgcolor: gradeInfo.bg,
                    color: gradeInfo.color,
                    border: `2px solid ${gradeInfo.color}`,
                    fontSize: 28,
                    fontWeight: 800,
                  }}
                >
                  {gradeInfo.grade}
                </Avatar>

                <Box>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="h5" sx={{ fontWeight: 800 }}>
                      Overall Standing: {gradeInfo.label}
                    </Typography>
                    <VerifiedIcon sx={{ color: gradeInfo.color, fontSize: 22 }} />
                  </Stack>
                  <Typography variant="body2" sx={{ color: "#94a3b8", mt: 0.5 }}>
                    Weighted metric based on 40% Attendance session log & 60% Task deliverables completion.
                  </Typography>
                </Box>
              </Stack>
            </Grid>

            <Grid item xs={12} md={5}>
              <Box
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  bgcolor: "rgba(255, 255, 255, 0.06)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                  <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 700, textTransform: "uppercase" }}>
                    Combined Score
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: gradeInfo.color }}>
                    {combinedScore}%
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={combinedScore}
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    bgcolor: "rgba(255,255,255,0.15)",
                    "& .MuiLinearProgress-bar": { backgroundColor: gradeInfo.color },
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        )}
      </Card>

      {/* Progress Breakdown Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Attendance Card */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3.5, borderRadius: 3, border: "1px solid", borderColor: "divider", height: "100%" }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
              <Avatar sx={{ width: 48, height: 48, bgcolor: "success.50", color: "success.main" }}>
                <EventAvailableIcon fontSize="medium" />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Session Attendance Metric
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Based on official logged bootcamp session presence
                </Typography>
              </Box>
            </Stack>
            <Divider sx={{ mb: 3 }} />

            {loading ? (
              <Skeleton variant="rounded" height={60} />
            ) : (
              <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                  <Typography variant="body2" fontWeight={600} color="text.secondary">
                    Attendance Percentage
                  </Typography>
                  <Typography variant="h5" fontWeight={800} color="success.main">
                    {attendanceScore}%
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(100, Math.max(0, attendanceScore))}
                  color="success"
                  sx={{ height: 10, borderRadius: 5, bgcolor: "grey.100", mb: 2 }}
                />

                <Box sx={{ p: 2, bgcolor: "grey.50", borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} display="block">
                    Punctuality Standard:
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Maintain an attendance percentage above 75% to stay eligible for capstone certification.
                  </Typography>
                </Box>
              </Box>
            )}
          </Card>
        </Grid>

        {/* Task Completion Card */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3.5, borderRadius: 3, border: "1px solid", borderColor: "divider", height: "100%" }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
              <Avatar sx={{ width: 48, height: 48, bgcolor: "primary.50", color: "primary.main" }}>
                <TrendingUpIcon fontSize="medium" />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Task Milestone Completion
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Based on your assigned project deliverables
                </Typography>
              </Box>
            </Stack>
            <Divider sx={{ mb: 3 }} />

            {loading ? (
              <Skeleton variant="rounded" height={60} />
            ) : (
              <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                  <Typography variant="body2" fontWeight={600} color="text.secondary">
                    Completed Deliverables
                  </Typography>
                  <Typography variant="h5" fontWeight={800} color="primary.main">
                    {Math.round(taskScore)}%
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(100, Math.max(0, taskScore))}
                  color="primary"
                  sx={{ height: 10, borderRadius: 5, bgcolor: "grey.100", mb: 2 }}
                />

                <Box sx={{ p: 2, bgcolor: "grey.50", borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} display="block">
                    Deliverable Velocity:
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Complete all assigned project requirements on time to boost your final evaluation.
                  </Typography>
                </Box>
              </Box>
            )}
          </Card>
        </Grid>
      </Grid>

      {/* Gamified Achievements Banner */}
      <Card sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
          <EmojiEventsIcon sx={{ color: "warning.main" }} /> Bootcamp Trainee Milestones & Badges
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Box
              sx={{
                p: 2,
                borderRadius: 2.5,
                bgcolor: attendanceScore >= 80 ? "success.50" : "grey.50",
                border: "1px solid",
                borderColor: attendanceScore >= 80 ? "success.200" : "divider",
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <Avatar sx={{ bgcolor: attendanceScore >= 80 ? "success.main" : "grey.300", color: "#fff", width: 40, height: 40 }}>
                <VerifiedIcon fontSize="small" />
              </Avatar>
              <Box>
                <Typography variant="subtitle2" fontWeight={700}>
                  Punctuality Star
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {attendanceScore >= 80 ? "Unlocked (>80% Attendance)" : "Locked (Requires >80%)"}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Box
              sx={{
                p: 2,
                borderRadius: 2.5,
                bgcolor: taskScore >= 50 ? "primary.50" : "grey.50",
                border: "1px solid",
                borderColor: taskScore >= 50 ? "primary.200" : "divider",
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <Avatar sx={{ bgcolor: taskScore >= 50 ? "primary.main" : "grey.300", color: "#fff", width: 40, height: 40 }}>
                <TaskAltIcon fontSize="small" />
              </Avatar>
              <Box>
                <Typography variant="subtitle2" fontWeight={700}>
                  Milestone Crusher
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {taskScore >= 50 ? "Unlocked (>50% Tasks Done)" : "Locked (Requires >50%)"}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Box
              sx={{
                p: 2,
                borderRadius: 2.5,
                bgcolor: combinedScore >= 85 ? "warning.50" : "grey.50",
                border: "1px solid",
                borderColor: combinedScore >= 85 ? "warning.200" : "divider",
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <Avatar sx={{ bgcolor: combinedScore >= 85 ? "warning.main" : "grey.300", color: "#fff", width: 40, height: 40 }}>
                <AutoAwesomeIcon fontSize="small" />
              </Avatar>
              <Box>
                <Typography variant="subtitle2" fontWeight={700}>
                  Top Performer
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {combinedScore >= 85 ? "Unlocked (>85% Overall)" : "Locked (Requires >85%)"}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Card>
    </PageContent>
  );
}
