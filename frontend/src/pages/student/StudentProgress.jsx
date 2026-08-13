import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  LinearProgress,
  Skeleton,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import { useOutletContext } from "react-router-dom";

import Header from "../../components/layout/Header";
import { PageContent } from "../../components/layout/AppLayout";
import { reportApi } from "../../services/reportApi";
import { useToast } from "../../context/ToastContext";

export default function StudentProgress() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const { onMobileNavOpen } = useOutletContext() || {};

  useEffect(() => {
    reportApi
      .getMyReport()
      .then((res) => {
        if (res.success && res.data) setReport(res.data);
      })
      .catch((err) => showToast(err?.message || "Failed to load progress report", "error"))
      .finally(() => setLoading(false));
  }, [showToast]);

  const attendanceScore = report?.attendancePercentage ?? 100;
  const taskScore = report?.taskCompletionPercentage ?? 0;

  return (
    <>
      <Header
        title="My Progress & Performance"
        subtitle="Review your overall attendance record and project deliverable metrics."
        onMobileNavOpen={onMobileNavOpen}
      />

      <PageContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 4 }}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2.5,
                    bgcolor: "success.50",
                    color: "success.main",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <EventAvailableIcon fontSize="large" />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Attendance Metric
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Based on total logged bootcamp sessions
                  </Typography>
                </Box>
              </Stack>

              {loading ? (
                <Skeleton variant="rounded" height={40} />
              ) : (
                <Box>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                    <Typography variant="body2" fontWeight={600} color="text.secondary">
                      Attendance Score
                    </Typography>
                    <Typography variant="body2" fontWeight={700} color="success.main">
                      {attendanceScore}%
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(100, Math.max(0, attendanceScore))}
                    color="success"
                    sx={{ height: 10, borderRadius: 5, bgcolor: "grey.100" }}
                  />
                </Box>
              )}
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ p: 4 }}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2.5,
                    bgcolor: "primary.50",
                    color: "primary.main",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <TrendingUpIcon fontSize="large" />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Deliverables Milestone Score
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Based on assigned task completions
                  </Typography>
                </Box>
              </Stack>

              {loading ? (
                <Skeleton variant="rounded" height={40} />
              ) : (
                <Box>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                    <Typography variant="body2" fontWeight={600} color="text.secondary">
                      Task Completion
                    </Typography>
                    <Typography variant="body2" fontWeight={700} color="primary.main">
                      {Math.round(taskScore)}%
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(100, Math.max(0, taskScore))}
                    sx={{ height: 10, borderRadius: 5, bgcolor: "grey.100" }}
                  />
                </Box>
              )}
            </Card>
          </Grid>
        </Grid>
      </PageContent>
    </>
  );
}
