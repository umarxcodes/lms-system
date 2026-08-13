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
  Avatar,
  Chip,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import AssessmentIcon from "@mui/icons-material/Assessment";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import AssignmentIcon from "@mui/icons-material/Assignment";
import SecurityIcon from "@mui/icons-material/Security";
import FileDownloadDoneIcon from "@mui/icons-material/FileDownloadDone";
import DescriptionIcon from "@mui/icons-material/Description";
import { useOutletContext } from "react-router-dom";

import PageHeader from "../../components/common/PageHeader";
import { PageContent } from "../../components/layout/AppLayout";
import { reportApi } from "../../services/reportApi";
import { useToast } from "../../context/ToastContext";

export default function AdminReports() {
  const [attendanceReport, setAttendanceReport] = useState(null);
  const [assignmentReport, setAssignmentReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloadingAtt, setDownloadingAtt] = useState(false);
  const [downloadingAss, setDownloadingAss] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    let isMounted = true;
    const fetchReports = async () => {
      try {
        setLoading(true);
        const [attRes, assRes] = await Promise.allSettled([
          reportApi.getAttendanceReport(),
          reportApi.getAssignmentReport(),
        ]);

        if (isMounted) {
          if (attRes.status === "fulfilled" && attRes.value.success) {
            setAttendanceReport(attRes.value.data);
          }
          if (assRes.status === "fulfilled" && assRes.value.success) {
            setAssignmentReport(assRes.value.data);
          }
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

  const handleExportCsv = async (url, fileName, setDownloading) => {
    try {
      setDownloading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Export download failed");
      const blob = await res.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast(`${fileName} exported and downloaded successfully!`, "success");
    } catch (err) {
      showToast(err?.message || "Failed to download CSV export", "error");
    } finally {
      setDownloading(false);
    }
  };

  const attCount = attendanceReport?.totalRecords || attendanceReport?.length || 0;
  const assCount = assignmentReport?.totalTasks || assignmentReport?.length || 0;

  return (
    <PageContent>
      <PageHeader
        title="Reports & Analytics Center"
        description="Generate, audit, and export official CSV reports for student attendance logs, task deliverables, and bootcamp metrics."
      />

      {/* Top Banner KPI Summary */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              p: 3,
              background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
              color: "#fff",
              borderRadius: 3,
              boxShadow: "0 8px 24px rgba(2, 132, 199, 0.2)",
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "#fff", width: 52, height: 52 }}>
                <AssessmentIcon fontSize="large" />
              </Avatar>
              <Box>
                <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.8)", fontWeight: 600, textTransform: "uppercase" }}>
                  Export Engine Status
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                  Ready & Sanitized
                </Typography>
                <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.9)", display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
                  <SecurityIcon fontSize="inherit" /> CSV Injection Prevention Active
                </Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ p: 3, borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.05)", border: "1px solid", borderColor: "divider" }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: "uppercase" }}>
                  Total Attendance Logs
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5, color: "success.main" }}>
                  {loading ? <Skeleton width={60} /> : attCount}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Audited daily session entries
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: "success.50", color: "success.main", width: 48, height: 48 }}>
                <EventAvailableIcon />
              </Avatar>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ p: 3, borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.05)", border: "1px solid", borderColor: "divider" }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: "uppercase" }}>
                  Task Deliverable Logs
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5, color: "primary.main" }}>
                  {loading ? <Skeleton width={60} /> : assCount}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Evaluated student assignments
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: "primary.50", color: "primary.main", width: 48, height: 48 }}>
                <AssignmentIcon />
              </Avatar>
            </Stack>
          </Card>
        </Grid>
      </Grid>

      {/* Main Export Modules */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Attendance Export Card */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%", display: "flex", flexDirection: "column", borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
            <CardContent sx={{ p: 3.5, flex: 1 }}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Avatar sx={{ bgcolor: "success.50", color: "success.main", width: 50, height: 50 }}>
                  <EventAvailableIcon fontSize="medium" />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Attendance Audit Export
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Official daily record logs per student & session
                  </Typography>
                </Box>
              </Stack>
              <Divider sx={{ mb: 2.5 }} />

              {loading ? (
                <Skeleton variant="rounded" height={100} />
              ) : (
                <Box sx={{ py: 1 }}>
                  <Stack spacing={1.5}>
                    <Box sx={{ p: 2, bgcolor: "grey.50", borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
                      <Typography variant="body2" color="text.primary" fontWeight={700}>
                        Included Data Fields:
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
                        Date, Trainee Name, Email, Roll Number, Session Status (Present, Absent, Late, Leave), & Admin Notes.
                      </Typography>
                    </Box>

                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip label="Sanitized Format" color="success" size="small" variant="soft" sx={{ fontWeight: 700 }} />
                      <Chip label=".CSV Extension" size="small" variant="outlined" sx={{ fontWeight: 600 }} />
                    </Stack>
                  </Stack>
                </Box>
              )}
            </CardContent>

            <Box sx={{ p: 3, bgcolor: "grey.50", borderTop: "1px solid", borderColor: "divider" }}>
              <Button
                fullWidth
                size="large"
                variant="contained"
                color="success"
                disabled={downloadingAtt}
                startIcon={downloadingAtt ? <FileDownloadDoneIcon /> : <DownloadIcon />}
                onClick={() => handleExportCsv(reportApi.exportAttendanceCsvUrl, "attendance_report.csv", setDownloadingAtt)}
                sx={{ borderRadius: 2, fontWeight: 700, py: 1.2 }}
              >
                {downloadingAtt ? "Generating CSV..." : "Export Attendance Audit (.CSV)"}
              </Button>
            </Box>
          </Card>
        </Grid>

        {/* Task & Deliverables Export Card */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%", display: "flex", flexDirection: "column", borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
            <CardContent sx={{ p: 3.5, flex: 1 }}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Avatar sx={{ bgcolor: "primary.50", color: "primary.main", width: 50, height: 50 }}>
                  <AssignmentIcon fontSize="medium" />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Task & Deliverables Export
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Full milestone task status and completion report
                  </Typography>
                </Box>
              </Stack>
              <Divider sx={{ mb: 2.5 }} />

              {loading ? (
                <Skeleton variant="rounded" height={100} />
              ) : (
                <Box sx={{ py: 1 }}>
                  <Stack spacing={1.5}>
                    <Box sx={{ p: 2, bgcolor: "grey.50", borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
                      <Typography variant="body2" color="text.primary" fontWeight={700}>
                        Included Data Fields:
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
                        Task Title, Project Name, Priority Level, Due Date, Assigned Student, & Status (Completed, Under Review, etc.).
                      </Typography>
                    </Box>

                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip label="Sanitized Format" color="primary" size="small" variant="soft" sx={{ fontWeight: 700 }} />
                      <Chip label=".CSV Extension" size="small" variant="outlined" sx={{ fontWeight: 600 }} />
                    </Stack>
                  </Stack>
                </Box>
              )}
            </CardContent>

            <Box sx={{ p: 3, bgcolor: "grey.50", borderTop: "1px solid", borderColor: "divider" }}>
              <Button
                fullWidth
                size="large"
                variant="contained"
                color="primary"
                disabled={downloadingAss}
                startIcon={downloadingAss ? <FileDownloadDoneIcon /> : <DownloadIcon />}
                onClick={() => handleExportCsv(reportApi.exportAssignmentCsvUrl, "assignment_report.csv", setDownloadingAss)}
                sx={{ borderRadius: 2, fontWeight: 700, py: 1.2 }}
              >
                {downloadingAss ? "Generating CSV..." : "Export Deliverables Report (.CSV)"}
              </Button>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </PageContent>
  );
}
