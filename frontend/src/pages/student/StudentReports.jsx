import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Box,
  Skeleton,
  Button,
  Avatar,
  Chip,
  Paper,
  Grid,
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import VerifiedIcon from "@mui/icons-material/Verified";

import PageHeader from "../../components/common/PageHeader";
import { PageContent } from "../../components/layout/AppLayout";
import { reportApi } from "../../services/reportApi";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

export default function StudentReports() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    reportApi
      .getMyReport()
      .then((res) => {
        if (res.success && res.data) setReport(res.data);
      })
      .catch((err) => showToast(err?.message || "Failed to load report card", "error"))
      .finally(() => setLoading(false));
  }, [showToast]);

  const handlePrint = () => {
    window.print();
  };

  const attendanceScore = report?.attendancePercentage ?? 100;
  const taskScore = Math.round(report?.taskCompletionPercentage ?? 0);
  const combinedScore = Math.round((attendanceScore * 0.4) + (taskScore * 0.6));

  const getEvaluation = (score) => {
    if (score >= 90) return { grade: "A+", status: "EXCELLENT", color: "#10b981" };
    if (score >= 80) return { grade: "A", status: "VERY GOOD", color: "#0284c7" };
    if (score >= 70) return { grade: "B", status: "GOOD", color: "#6366f1" };
    if (score >= 60) return { grade: "C", status: "SATISFACTORY", color: "#f59e0b" };
    return { grade: "D", status: "NEEDS IMPROVEMENT", color: "#ef4444" };
  };

  const evaluation = getEvaluation(combinedScore);

  return (
    <PageContent>
      <PageHeader
        title="Official Trainee Report Card"
        description="View, verify, and export your official SMIT Bootcamp performance evaluation report card."
        actions={
          <Button
            variant="contained"
            color="primary"
            startIcon={<PrintIcon />}
            onClick={handlePrint}
            sx={{ fontWeight: 800, borderRadius: 2.5, px: 2.5 }}
          >
            Print / Save PDF
          </Button>
        }
      />

      <Box sx={{ maxWidth: 800, mx: "auto" }}>
        <Card
          elevation={0}
          sx={{
            borderRadius: 3.5,
            bgcolor: "#ffffff",
            border: "1px solid #e2e8f0",
            boxShadow: "0 10px 30px -5px rgba(0,0,0,0.05), 0 4px 10px -2px rgba(0,0,0,0.02)",
            overflow: "hidden",
          }}
        >
          {/* Header Branding Banner */}
          <Box
            sx={{
              p: { xs: 3, sm: 4 },
              background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
              color: "#fff",
            }}
          >
            <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} spacing={2}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  src="https://res.cloudinary.com/dlul8f6xz/image/upload/v1786599373/logo.6lrMPvRL_phqqyj.png"
                  alt="SMIT Logo"
                  sx={{ width: 56, height: 56, bgcolor: "#ffffff", p: 0.5 }}
                />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: "-0.01em" }}>
                    SAYLANI MASS IT TRAINING (SMIT)
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 600, display: "block" }}>
                    Official Trainee Academic Progress Report
                  </Typography>
                </Box>
              </Stack>

              <Chip
                icon={<VerifiedIcon style={{ color: "#ffffff" }} />}
                label="OFFICIAL VERIFIED"
                sx={{
                  bgcolor: "rgba(16, 185, 129, 0.2)",
                  color: "#34d399",
                  fontWeight: 800,
                  fontSize: "0.725rem",
                  border: "1px solid rgba(52, 211, 153, 0.4)",
                  borderRadius: 2,
                }}
              />
            </Stack>
          </Box>

          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            {loading ? (
              <Skeleton variant="rounded" height={240} />
            ) : (
              <Stack spacing={3}>
                {/* Student Profile Info Box */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    bgcolor: "#f8fafc",
                    borderRadius: 2.5,
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary" fontWeight={700} display="block" sx={{ textTransform: "uppercase", letterSpacing: "0.03em" }}>
                        TRAINEE NAME
                      </Typography>
                      <Typography variant="subtitle1" fontWeight={800} color="#0f172a">
                        {user?.name || "Student Trainee"}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary" fontWeight={700} display="block" sx={{ textTransform: "uppercase", letterSpacing: "0.03em" }}>
                        EMAIL ADDRESS
                      </Typography>
                      <Typography variant="subtitle1" fontWeight={700} color="#0f172a">
                        {user?.email || "N/A"}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary" fontWeight={700} display="block" sx={{ textTransform: "uppercase", letterSpacing: "0.03em" }}>
                        ROLL NUMBER / ID
                      </Typography>
                      <Typography variant="subtitle1" fontWeight={700} color="#0f172a">
                        {user?.rollNum || user?._id?.substring(0, 8).toUpperCase() || "SMIT-TRAINEE"}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary" fontWeight={700} display="block" sx={{ textTransform: "uppercase", letterSpacing: "0.03em" }}>
                        REPORT ISSUE DATE
                      </Typography>
                      <Typography variant="subtitle1" fontWeight={700} color="#0f172a">
                        {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>

                {/* Score Breakdown Cards */}
                <Typography variant="h6" fontWeight={800} color="#0f172a" sx={{ mt: 1 }}>
                  Evaluated Performance Metrics
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2.5,
                        borderRadius: 2.5,
                        border: "1px solid #bbf7d0",
                        bgcolor: "#f0fdf4",
                      }}
                    >
                      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                        <EventAvailableIcon sx={{ color: "#16a34a" }} />
                        <Typography variant="subtitle2" fontWeight={800} color="#16a34a">
                          Attendance Percentage
                        </Typography>
                      </Stack>
                      <Typography variant="h4" fontWeight={800} color="#16a34a">
                        {attendanceScore}%
                      </Typography>
                      <Typography variant="caption" color="text.secondary" fontWeight={500}>
                        Logged attendance ratio
                      </Typography>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2.5,
                        borderRadius: 2.5,
                        border: "1px solid #bfdbfe",
                        bgcolor: "#eff6ff",
                      }}
                    >
                      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                        <TaskAltIcon sx={{ color: "#1e40af" }} />
                        <Typography variant="subtitle2" fontWeight={800} color="#1e40af">
                          Deliverables Completion Rate
                        </Typography>
                      </Stack>
                      <Typography variant="h4" fontWeight={800} color="#1e40af">
                        {taskScore}%
                      </Typography>
                      <Typography variant="caption" color="text.secondary" fontWeight={500}>
                        Assigned tasks completed
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>

                {/* Overall Standing Badge */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    bgcolor: "#0f172a",
                    color: "#ffffff",
                    textAlign: "center",
                  }}
                >
                  <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 700, letterSpacing: "0.06em" }}>
                    OVERALL EVALUATION GRADE
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 900, color: evaluation.color, my: 0.5 }}>
                    GRADE: {evaluation.grade}
                  </Typography>
                  <Chip
                    label={evaluation.status}
                    sx={{
                      bgcolor: evaluation.color,
                      color: "#ffffff",
                      fontWeight: 800,
                      px: 2,
                      borderRadius: 2,
                    }}
                  />
                </Paper>
              </Stack>
            )}
          </CardContent>
        </Card>
      </Box>
    </PageContent>
  );
}
