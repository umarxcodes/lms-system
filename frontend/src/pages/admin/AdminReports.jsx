import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Skeleton,
  Box,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import AssessmentIcon from "@mui/icons-material/Assessment";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { useOutletContext } from "react-router-dom";

import Header from "../../components/layout/Header";
import { PageContent } from "../../components/layout/AppLayout";
import { reportApi } from "../../services/reportApi";
import { useToast } from "../../context/ToastContext";

export default function AdminReports() {
  const [attendanceReport, setAttendanceReport] = useState(null);
  const [assignmentReport, setAssignmentReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const { onMobileNavOpen } = useOutletContext() || {};

  useEffect(() => {
    let isMounted = true;
    const fetchReports = async () => {
      try {
        setLoading(true);
        const [attRes, assRes] = await Promise.all([
          reportApi.getAttendanceReport(),
          reportApi.getAssignmentReport(),
        ]);

        if (isMounted) {
          if (attRes.success) setAttendanceReport(attRes.data);
          if (assRes.success) setAssignmentReport(assRes.data);
        }
      } catch (err) {
        if (isMounted) showToast(err?.message || "Failed to load reports", "error");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchReports();
    return () => {
      isMounted = false;
    };
  }, [showToast]);

  const handleExportCsv = (url, fileName) => {
    const token = localStorage.getItem("token");
    fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.blob())
      .then((blob) => {
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
        showToast("CSV export downloaded successfully!", "success");
      })
      .catch((err) => showToast("Failed to download CSV export", "error"));
  };

  return (
    <>
      <Header
        title="Reports & Analytics"
        subtitle="Generate and export comprehensive attendance and assignment performance reports."
        onMobileNavOpen={onMobileNavOpen}
      />

      <PageContent>
        <Grid container spacing={3}>
          {/* Attendance Report Card */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
              <CardContent sx={{ p: 4, flex: 1 }}>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
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
                      Attendance Audit Report
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Comprehensive daily student attendance records and logs.
                    </Typography>
                  </Box>
                </Stack>

                {loading ? (
                  <Skeleton variant="rounded" height={100} />
                ) : (
                  <Box sx={{ py: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Total Attendance Records Logged:{" "}
                      <strong>{attendanceReport?.totalRecords || attendanceReport?.length || 0}</strong>
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Includes Date, Student Name, Email, Roll #, Status, and Admin Notes. CSV sanitization is enforced to prevent formula injection.
                    </Typography>
                  </Box>
                )}
              </CardContent>

              <Box sx={{ p: 2.5, bgcolor: "grey.50", borderTop: "1px solid", borderColor: "divider" }}>
                <Button
                  fullWidth
                  variant="contained"
                  color="success"
                  startIcon={<DownloadIcon />}
                  onClick={() => handleExportCsv(reportApi.exportAttendanceCsvUrl, "attendance_report.csv")}
                >
                  Export Attendance CSV
                </Button>
              </Box>
            </Card>
          </Grid>

          {/* Assignment Report Card */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
              <CardContent sx={{ p: 4, flex: 1 }}>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
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
                    <AssignmentIcon fontSize="large" />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Task & Deliverables Report
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Audit task statuses, priorities, assigned students, and project deadlines.
                    </Typography>
                  </Box>
                </Stack>

                {loading ? (
                  <Skeleton variant="rounded" height={100} />
                ) : (
                  <Box sx={{ py: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Total Task Deliverables Logged:{" "}
                      <strong>{assignmentReport?.totalTasks || assignmentReport?.length || 0}</strong>
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Includes Task Title, Project Name, Priority, Due Date, Assigned Student, and Completion Status.
                    </Typography>
                  </Box>
                )}
              </CardContent>

              <Box sx={{ p: 2.5, bgcolor: "grey.50", borderTop: "1px solid", borderColor: "divider" }}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  startIcon={<DownloadIcon />}
                  onClick={() => handleExportCsv(reportApi.exportAssignmentCsvUrl, "assignment_report.csv")}
                >
                  Export Assignments CSV
                </Button>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </PageContent>
    </>
  );
}
