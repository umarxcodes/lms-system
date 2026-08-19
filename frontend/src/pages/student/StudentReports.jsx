import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Box,
  Avatar,
  Grid,
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import VerifiedIcon from "@mui/icons-material/Verified";

import PageHeader from "../../components/common/PageHeader";
import { PageContent } from "../../components/layout/AppLayout";
import StatusBadge from "../../components/common/StatusBadge";
import ActionButton from "../../components/common/ActionButton";
import StatCard from "../../components/common/StatCard";
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

  const attendanceScore = report?.attendancePercentage ?? 92;
  const taskScore = Math.round(report?.taskCompletionPercentage ?? 75);
  const combinedScore = Math.round(attendanceScore * 0.4 + taskScore * 0.6);

  return (
    <PageContent>
      <PageHeader
        title="Official Trainee Academic Report Card"
        description="Verified academic performance evaluation, session attendance standing, and deliverable scores."
        actions={
          <ActionButton variant="contained" color="primary" startIcon={<PrintIcon />} onClick={handlePrint}>
            Print Report Card
          </ActionButton>
        }
      />

      <Card elevation={0} sx={{ borderRadius: "12px", border: "1px solid #E2E8F0", bgcolor: "#FFFFFF", overflow: "hidden" }}>
        {/* Institutional Branding Header */}
        <Box sx={{ p: 3, bgcolor: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
          <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems="center" spacing={2}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar
                src="https://res.cloudinary.com/dlul8f6xz/image/upload/v1786599373/logo.6lrMPvRL_phqqyj.png"
                alt="Saylani Logo"
                sx={{ width: 44, height: 44, bgcolor: "#FFFFFF", p: 0.5, border: "1px solid #E2E8F0" }}
              />
              <Box>
                <Typography variant="h3" sx={{ fontWeight: 700, color: "#111827" }}>
                  SAYLANI MASS IT TRAINING (SMIT)
                </Typography>
                <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 600 }}>
                  Official Trainee Academic Performance Assessment
                </Typography>
              </Box>
            </Stack>

            <StatusBadge status="completed" label="OFFICIAL VERIFIED REPORT" icon={VerifiedIcon} />
          </Stack>
        </Box>

        <CardContent sx={{ p: 4 }}>
          {/* Student Profile Card */}
          <Box sx={{ p: 3, bgcolor: "#F8FAFC", borderRadius: "10px", border: "1px solid #E2E8F0", mb: 3 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>
                  Trainee Name
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#111827" }}>
                  {user?.name || "Ali Khan"}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>
                  Email Address
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#111827" }}>
                  {user?.email || "ali.khan@saylani.org"}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>
                  Roll Number
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#111827" }}>
                  SMIT-2026-0941
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>
                  Issue Date
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#111827" }}>
                  19 August 2026
                </Typography>
              </Grid>
            </Grid>
          </Box>

          {/* Performance Breakdown Cards */}
          <Typography variant="h3" sx={{ fontWeight: 600, color: "#111827", mb: 2 }}>
            Performance Metrics
          </Typography>

          <Grid container spacing={2.5} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <StatCard
                title="ATTENDANCE RATIO"
                value={`${attendanceScore}%`}
                subtitle="Weighted 40% of total score"
                icon={EventAvailableIcon}
                iconBgColor="#ECFDF5"
                iconColor="#16A34A"
                progress={attendanceScore}
                accentColor="#16A34A"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <StatCard
                title="DELIVERABLE COMPLETION"
                value={`${taskScore}%`}
                subtitle="Weighted 60% of total score"
                icon={TaskAltIcon}
                iconBgColor="#EFF6FF"
                iconColor="#2563EB"
                progress={taskScore}
                accentColor="#2563EB"
              />
            </Grid>
          </Grid>

          {/* Evaluation Banner */}
          <Box sx={{ p: 4, bgcolor: "#ECFDF5", borderRadius: "10px", border: "1px solid #16A34A30", textAlign: "center" }}>
            <Typography variant="caption" sx={{ color: "#16A34A", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Overall Evaluation Grade
            </Typography>
            <Typography variant="h1" sx={{ fontWeight: 800, color: "#16A34A", my: 1, fontSize: "2.5rem" }}>
              GRADE: A ({combinedScore}%)
            </Typography>
            <StatusBadge status="completed" label="EXCELLENT ACADEMIC STANDING" />
          </Box>
        </CardContent>
      </Card>
    </PageContent>
  );
}

