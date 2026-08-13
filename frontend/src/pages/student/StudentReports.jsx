import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Box,
  Skeleton,
} from "@mui/material";
import AssessmentIcon from "@mui/icons-material/Assessment";
import { useOutletContext } from "react-router-dom";

import Header from "../../components/layout/Header";
import { PageContent } from "../../components/layout/AppLayout";
import { reportApi } from "../../services/reportApi";
import { useToast } from "../../context/ToastContext";

export default function StudentReports() {
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
      .catch((err) => showToast(err?.message || "Failed to load report card", "error"))
      .finally(() => setLoading(false));
  }, [showToast]);

  return (
    <>
      <Header
        title="My Progress Report Card"
        subtitle="Official summary of your attendance performance and milestone completions."
        onMobileNavOpen={onMobileNavOpen}
      />

      <PageContent>
        <Card sx={{ maxWidth: 640 }}>
          <CardContent sx={{ p: 4 }}>
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
                <AssessmentIcon fontSize="large" />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Bootcamp Trainee Report Card
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Computed performance metrics
                </Typography>
              </Box>
            </Stack>

            {loading ? (
              <Skeleton variant="rounded" height={120} />
            ) : (
              <Stack spacing={2}>
                <Box sx={{ p: 2, bgcolor: "grey.50", borderRadius: 2 }}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Attendance Record Percentage
                  </Typography>
                  <Typography variant="h5" fontWeight={700} color="success.main">
                    {report?.attendancePercentage ?? 100}%
                  </Typography>
                </Box>

                <Box sx={{ p: 2, bgcolor: "grey.50", borderRadius: 2 }}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Task Milestone Completion Rate
                  </Typography>
                  <Typography variant="h5" fontWeight={700} color="primary.main">
                    {Math.round(report?.taskCompletionPercentage ?? 0)}%
                  </Typography>
                </Box>
              </Stack>
            )}
          </CardContent>
        </Card>
      </PageContent>
    </>
  );
}
