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
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import AssessmentIcon from "@mui/icons-material/Assessment";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import AssignmentIcon from "@mui/icons-material/Assignment";
import SecurityIcon from "@mui/icons-material/Security";
import FileDownloadDoneIcon from "@mui/icons-material/FileDownloadDone";

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

      {/* Top Banner KPI Summary Cards */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card
            elevation={0}
            sx={{
              p: 3,
              background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
              color: "#fff",
              borderRadius: 3.5,
              boxShadow: "0 10px 25px -5px rgba(2, 132, 199, 0.25)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              "&:hover": { transform: "translateY(-2px)", boxShadow: "0 14px 30px -5px rgba(2, 132, 199, 0.35)" },
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "#fff", width: 52, height: 52 }}>
                <AssessmentIcon fontSize="large" />
              </Avatar>
              <Box>
                <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.85)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.03em" }}>
                  Export Engine Status
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                  Ready & Sanitized
                </Typography>
                <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.9)", display: "flex", alignItems: "center", gap: 0.5, mt: 0.5, fontWeight: 600 }}>
                  <SecurityIcon fontSize="inherit" /> CSV Injection Prevention Active
                </Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card
            elevation={0}
            sx={{
              p: 3,
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
                  Total Attendance Logs
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5, color: "#16a34a" }}>
                  {loading ? <Skeleton width={60} /> : attCount}
                </Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={500}>
                  Audited daily session entries
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: "#f0fdf4", color: "#16a34a", width: 48, height: 48 }}>
                <EventAvailableIcon />
              </Avatar>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card
            elevation={0}
            sx={{
              p: 3,
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
                  Task Deliverable Logs
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5, color: "#1e40af" }}>
                  {loading ? <Skeleton width={60} /> : assCount}
                </Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={500}>
                  Evaluated student assignments
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: "#eff6ff", color: "#1e40af", width: 48, height: 48 }}>
                <AssignmentIcon />
              </Avatar>
            </Stack>
          </Card>
        </Grid>
      </Grid>

      {/* Main Export Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Attendance Export Card */}
        <Grid item xs={12} md={6}>
          <Card
            elevation={0}
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              borderRadius: 3.5,
              bgcolor: "#ffffff",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)",
            }}
          >
            <CardContent sx={{ p: 3.5, flex: 1 }}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Avatar sx={{ bgcolor: "#f0fdf4", color: "#16a34a", width: 50, height: 50 }}>
                  <EventAvailableIcon fontSize="medium" />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a" }}>
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
                    <Box sx={{ p: 2.5, bgcolor: "#f8fafc", borderRadius: 2.5, border: "1px solid #e2e8f0" }}>
                      <Typography variant="body2" color="#0f172a" fontWeight={700}>
                        Included Data Fields:
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
                        Date, Trainee Name, Email, Roll Number, Session Status (Present, Absent, Late, Leave), & Admin Notes.
                      </Typography>
                    </Box>

                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip label="Sanitized Format" color="success" size="small" variant="soft" sx={{ fontWeight: 700, borderRadius: 1.5 }} />
                      <Chip label=".CSV Extension" size="small" variant="outlined" sx={{ fontWeight: 600, borderRadius: 1.5 }} />
                    </Stack>
                  </Stack>
                </Box>
              )}
            </CardContent>

            <Box sx={{ p: 3, bgcolor: "#f8fafc", borderTop: "1px solid #e2e8f0" }}>
              <Button
                fullWidth
                size="large"
                variant="contained"
                color="success"
                disabled={downloadingAtt}
                startIcon={downloadingAtt ? <FileDownloadDoneIcon /> : <DownloadIcon />}
                onClick={() => handleExportCsv(reportApi.exportAttendanceCsvUrl, "attendance_report.csv", setDownloadingAtt)}
                sx={{ borderRadius: 2.5, fontWeight: 800, py: 1.3, letterSpacing: "0.02em" }}
              >
                {downloadingAtt ? "Generating CSV..." : "Export Attendance Audit (.CSV)"}
              </Button>
            </Box>
          </Card>
        </Grid>

        {/* Task & Deliverables Export Card */}
        <Grid item xs={12} md={6}>
          <Card
            elevation={0}
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              borderRadius: 3.5,
              bgcolor: "#ffffff",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)",
            }}
          >
            <CardContent sx={{ p: 3.5, flex: 1 }}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Avatar sx={{ bgcolor: "#eff6ff", color: "#1e40af", width: 50, height: 50 }}>
                  <AssignmentIcon fontSize="medium" />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a" }}>
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
                    <Box sx={{ p: 2.5, bgcolor: "#f8fafc", borderRadius: 2.5, border: "1px solid #e2e8f0" }}>
                      <Typography variant="body2" color="#0f172a" fontWeight={700}>
                        Included Data Fields:
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
                        Task Title, Project Name, Priority Level, Due Date, Assigned Student, & Status (Completed, Under Review, etc.).
                      </Typography>
                    </Box>

                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip label="Sanitized Format" color="primary" size="small" variant="soft" sx={{ fontWeight: 700, borderRadius: 1.5 }} />
                      <Chip label=".CSV Extension" size="small" variant="outlined" sx={{ fontWeight: 600, borderRadius: 1.5 }} />
                    </Stack>
                  </Stack>
                </Box>
              )}
            </CardContent>

            <Box sx={{ p: 3, bgcolor: "#f8fafc", borderTop: "1px solid #e2e8f0" }}>
              <Button
                fullWidth
                size="large"
                variant="contained"
                color="primary"
                disabled={downloadingAss}
                startIcon={downloadingAss ? <FileDownloadDoneIcon /> : <DownloadIcon />}
                onClick={() => handleExportCsv(reportApi.exportAssignmentCsvUrl, "assignment_report.csv", setDownloadingAss)}
                sx={{ borderRadius: 2.5, fontWeight: 800, py: 1.3, letterSpacing: "0.02em" }}
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
