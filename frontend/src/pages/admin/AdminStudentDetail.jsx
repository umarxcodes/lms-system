import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  Stack,
  Avatar,
  Grid,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  CircularProgress,
  Divider,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonIcon from "@mui/icons-material/Person";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import GroupsIcon from "@mui/icons-material/Groups";
import AssessmentIcon from "@mui/icons-material/Assessment";
import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import HomeIcon from "@mui/icons-material/Home";
import VerifiedIcon from "@mui/icons-material/Verified";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";

import PageHeader from "../../components/common/PageHeader";
import { PageContent } from "../../components/layout/AppLayout";
import StatusChip from "../../components/common/StatusChip";
import { studentApi } from "../../services/studentApi";
import { attendanceApi } from "../../services/attendanceApi";
import { reportApi } from "../../services/reportApi";
import { useToast } from "../../context/ToastContext";

export default function AdminStudentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { onMobileNavOpen } = useOutletContext() || {};

  const [student, setStudent] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const handleExportReport = async () => {
    try {
      setExporting(true);
      const blob = await reportApi.exportStudentCsv(id);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      const roll = student?.rollNumber || "student";
      link.setAttribute("download", `student-${roll}-report-card.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      showToast("Student report card exported successfully!", "success");
    } catch (err) {
      showToast(err?.message || "Failed to export student report card", "error");
    } finally {
      setExporting(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        const [studentRes, attendanceRes, reportRes] = await Promise.allSettled([
          studentApi.getStudentById(id),
          attendanceApi.getAttendanceByStudent(id),
          reportApi.getStudentReport(id),
        ]);

        if (isMounted) {
          if (studentRes.status === "fulfilled" && studentRes.value?.success) {
            setStudent(studentRes.value.data);
          }
          if (attendanceRes.status === "fulfilled" && attendanceRes.value?.success) {
            setAttendance(Array.isArray(attendanceRes.value.data) ? attendanceRes.value.data : []);
          }
          if (reportRes.status === "fulfilled" && reportRes.value?.success) {
            setReport(reportRes.value.data);
          }
        }
      } catch (err) {
        if (isMounted) showToast(err?.message || "Failed to load student details", "error");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchStudentData();
    return () => {
      isMounted = false;
    };
  }, [id, showToast]);

  const studentName = student?.name || student?.user?.name || "Student";
  const studentEmail = student?.email || student?.user?.email || "N/A";
  const teamName = student?.team?.name || student?.teamId?.name;

  // Print report card function
  const handlePrintReport = () => {
    window.print();
  };

  const attendanceStats = report?.attendance || {
    total: attendance.length,
    present: attendance.filter((a) => a.status === "present").length,
    absent: attendance.filter((a) => a.status === "absent").length,
    late: attendance.filter((a) => a.status === "late").length,
    leave: attendance.filter((a) => a.status === "leave").length,
  };

  const taskStats = report?.tasks || {
    total: 0,
    completed: 0,
    inProgress: 0,
    todo: 0,
  };

  return (
    <>
      {/* Global CSS to isolate printable container during window.print() */}
      <style>
        {`
          @media print {
            body {
              background-color: #ffffff !important;
              color: #0f172a !important;
              margin: 0 !important;
              padding: 0 !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .no-print, header, nav, sidebar, .MuiDrawer-root, .MuiAppBar-root {
              display: none !important;
            }
            .printable-official-transcript {
              display: block !important;
              width: 100% !important;
              padding: 0 !important;
              margin: 0 !important;
            }
            @page {
              size: A4 portrait;
              margin: 15mm;
            }
          }
        `}
      </style>

      {/* Screen Layout (Web UI) */}
      <Box className="no-print">
        <PageContent>
          <PageHeader
            title={`Student Profile: ${studentName}`}
            description={`Roll Number: ${student?.rollNumber || "N/A"} | Batch: ${student?.batch || "Batch 1"}`}
            breadcrumbs={[
              { label: "Home", to: "/admin/dashboard" },
              { label: "Students", to: "/admin/students" },
              { label: studentName },
            ]}
            actions={
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate("/admin/students")}
                variant="outlined"
                sx={{ fontWeight: 600, borderRadius: 2 }}
              >
                Back to Directory
              </Button>
            }
          />

          {loading ? (
            <Skeleton variant="rounded" height={200} sx={{ borderRadius: 3, mb: 3 }} />
          ) : (
            <Card
              elevation={0}
              sx={{
                p: { xs: 2.5, sm: 3.5 },
                borderRadius: 3.5,
                border: "1px solid #e2e8f0",
                bgcolor: "#ffffff",
                mb: 3.5,
                boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
              }}
            >
              <Stack direction={{ xs: "column", sm: "row" }} spacing={3} alignItems={{ xs: "flex-start", sm: "center" }}>
                <Avatar
                  src={student?.user?.avatarUrl || student?.avatarUrl || ""}
                  alt={studentName}
                  sx={{
                    width: 96,
                    height: 96,
                    bgcolor: "primary.main",
                    fontSize: 40,
                    fontWeight: 700,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    border: "3px solid #ffffff",
                  }}
                >
                  {studentName.charAt(0).toUpperCase()}
                </Avatar>

                <Box sx={{ flex: 1 }}>
                  <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" sx={{ mb: 1 }}>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: "#0f172a" }}>
                      {studentName}
                    </Typography>
                    <StatusChip status="Active" />
                  </Stack>

                  <Stack direction="row" spacing={2.5} flexWrap="wrap" rowGap={1} sx={{ color: "#64748b", mb: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                      <EmailIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                      <Typography variant="body2">{studentEmail}</Typography>
                    </Box>
                    {student?.phone && (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                        <PhoneIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                        <Typography variant="body2">{student.phone}</Typography>
                      </Box>
                    )}
                  </Stack>

                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    <Chip
                      label={`Roll #: ${student?.rollNumber || "N/A"}`}
                      size="small"
                      sx={{ bgcolor: "#f1f5f9", fontWeight: 700, color: "#334155", borderRadius: 1.5 }}
                    />
                    <Chip
                      label={`Batch: ${student?.batch || "Batch 1"}`}
                      size="small"
                      sx={{ bgcolor: "#f1f5f9", fontWeight: 700, color: "#334155", borderRadius: 1.5 }}
                    />
                    {teamName ? (
                      <Chip
                        label={`Team: ${teamName}`}
                        size="small"
                        icon={<GroupsIcon style={{ fontSize: 14, color: "#1e40af" }} />}
                        sx={{ bgcolor: "#eff6ff", color: "#1e40af", fontWeight: 700, borderRadius: 1.5 }}
                      />
                    ) : (
                      <Chip
                        label="Unassigned Team"
                        size="small"
                        sx={{ bgcolor: "#fef2f2", color: "#991b1b", fontWeight: 600, borderRadius: 1.5 }}
                      />
                    )}
                  </Stack>
                </Box>
              </Stack>
            </Card>
          )}

          {/* Tab Navigation */}
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
            <Tabs
              value={activeTab}
              onChange={(e, val) => setActiveTab(val)}
              sx={{
                "& .MuiTab-root": {
                  fontWeight: 700,
                  textTransform: "none",
                  fontSize: "0.95rem",
                  minHeight: 48,
                },
              }}
            >
              <Tab icon={<PersonIcon fontSize="small" />} iconPosition="start" label="Profile Overview" />
              <Tab icon={<EventAvailableIcon fontSize="small" />} iconPosition="start" label="Attendance Log" />
              <Tab icon={<GroupsIcon fontSize="small" />} iconPosition="start" label="Team & Projects" />
              <Tab icon={<AssessmentIcon fontSize="small" />} iconPosition="start" label="Performance Report" />
            </Tabs>
          </Box>

          {/* Tab Panel 0: Overview */}
          {activeTab === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid #e2e8f0", bgcolor: "#ffffff" }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: "#0f172a" }}>
                    Contact & Residential Details
                  </Typography>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>
                        Phone Number
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: "#1e293b" }}>
                        {student?.phone || "Not provided"}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>
                        Residential Address
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: "#1e293b" }}>
                        {student?.address || "Not provided"}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>
                        Assigned Team Roster
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: "#1e293b" }}>
                        {teamName || "No Team Assigned"}
                      </Typography>
                    </Box>
                  </Stack>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid #e2e8f0", bgcolor: "#ffffff" }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: "#0f172a" }}>
                    Academic Summary
                  </Typography>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>
                        Total Attendance Days
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: "#1e293b" }}>
                        {attendance.length} Days Recorded
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>
                        Attendance Rate
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 700, color: "#16a34a" }}>
                        {report?.attendancePercentage ?? 100}%
                      </Typography>
                    </Box>
                  </Stack>
                </Card>
              </Grid>
            </Grid>
          )}

          {/* Tab Panel 1: Attendance History */}
          {activeTab === 1 && (
            <Card elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid #e2e8f0", bgcolor: "#ffffff" }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5, color: "#0f172a" }}>
                Attendance History Log
              </Typography>
              {attendance.length === 0 ? (
                <Typography variant="body2" sx={{ color: "#64748b" }}>
                  No attendance logs found for this student.
                </Typography>
              ) : (
                <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 2 }}>
                  <Table size="medium">
                    <TableHead sx={{ bgcolor: "#f8fafc" }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Date</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Notes</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {attendance.map((rec) => (
                        <TableRow key={rec._id || rec.id} hover>
                          <TableCell sx={{ fontWeight: 600 }}>{rec.date}</TableCell>
                          <TableCell>
                            <StatusChip status={rec.status} />
                          </TableCell>
                          <TableCell sx={{ color: "#64748b" }}>{rec.notes || "—"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Card>
          )}

          {/* Tab Panel 2: Team */}
          {activeTab === 2 && (
            <Card elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid #e2e8f0", bgcolor: "#ffffff" }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: "#0f172a" }}>
                Team Roster & Projects
              </Typography>
              <Typography variant="body2" sx={{ color: "#64748b" }}>
                {teamName
                  ? `Currently assigned to ${teamName}.`
                  : "This student is not currently assigned to any project team."}
              </Typography>
            </Card>
          )}

          {/* Tab Panel 3: Report */}
          {activeTab === 3 && (
            <Card elevation={0} sx={{ p: 3.5, borderRadius: 3.5, border: "1px solid #e2e8f0", bgcolor: "#ffffff" }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, color: "#0f172a" }}>
                Student Performance & Transcript Export
              </Typography>
              <Typography variant="body2" sx={{ color: "#64748b", mb: 3.5 }}>
                Export the official student record card containing roll number, batch, team assignment, attendance percentages, and project deliverables summary.
              </Typography>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={exporting}
                  startIcon={exporting ? <CircularProgress size={18} color="inherit" /> : <DownloadIcon />}
                  onClick={handleExportReport}
                  sx={{ fontWeight: 700, borderRadius: 2.5, py: 1.2, px: 3 }}
                >
                  {exporting ? "Generating Export..." : "Download Report Card (CSV)"}
                </Button>

                <Button
                  variant="outlined"
                  color="inherit"
                  startIcon={<PrintIcon />}
                  onClick={handlePrintReport}
                  sx={{ fontWeight: 700, borderRadius: 2.5, py: 1.2, px: 3, borderColor: "#cbd5e1", color: "#475569" }}
                >
                  Print / Save PDF Report
                </Button>
              </Stack>
            </Card>
          )}
        </PageContent>
      </Box>

      {/* DEDICATED OFFICIAL PRINT TRANSCRIPT CONTAINER (ONLY VISIBLE ON PRINT) */}
      <Box
        className="printable-official-transcript"
        sx={{
          display: "none",
          p: 4,
          fontFamily: "'Inter', sans-serif",
          bgcolor: "#ffffff",
          color: "#0f172a",
        }}
      >
        {/* Official Letterhead Header */}
        <Box sx={{ borderBottom: "2px solid #0f172a", pb: 2, mb: 3 }}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  component="img"
                  src="https://res.cloudinary.com/dlul8f6xz/image/upload/v1786599373/logo.6lrMPvRL_phqqyj.png"
                  alt="SMIT Logo"
                  sx={{ height: 48, width: "auto" }}
                />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.02em", color: "#1e3a8a", lineHeight: 1.2 }}>
                    Saylani Mass I.T. Training Program (SMIT)
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#475569", fontWeight: 700 }}>
                    Official Academic Performance & Transcript Card
                  </Typography>
                </Box>
              </Stack>
            </Grid>

            <Grid item sx={{ textAlign: "right" }}>
              <Typography variant="caption" sx={{ display: "block", color: "#64748b", fontWeight: 700 }}>
                Date Issued: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </Typography>
              <Typography variant="caption" sx={{ display: "block", color: "#64748b", fontFamily: "monospace" }}>
                Doc Ref: SMIT-STD-{student?.rollNumber || "TRANSCRIPT"}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        {/* Student Credentials Summary Box */}
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            mb: 3,
            border: "1px solid #cbd5e1",
            bgcolor: "#f8fafc",
            borderRadius: 2,
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 800, textTransform: "uppercase", color: "#1e40af", mb: 1.5, letterSpacing: "0.05em" }}>
            Student Information Record
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 700, display: "block" }}>
                Full Student Name
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 800, color: "#0f172a" }}>
                {studentName}
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 700, display: "block" }}>
                Email Address
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 800, color: "#0f172a" }}>
                {studentEmail}
              </Typography>
            </Grid>

            <Grid item xs={3}>
              <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 700, display: "block" }}>
                Roll Number
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 800, fontFamily: "monospace", color: "#0f172a" }}>
                {student?.rollNumber || "N/A"}
              </Typography>
            </Grid>

            <Grid item xs={3}>
              <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 700, display: "block" }}>
                Bootcamp Batch
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 800, color: "#0f172a" }}>
                {student?.batch || "Batch 1"}
              </Typography>
            </Grid>

            <Grid item xs={3}>
              <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 700, display: "block" }}>
                Assigned Team
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 800, color: "#1e40af" }}>
                {teamName || "Unassigned"}
              </Typography>
            </Grid>

            <Grid item xs={3}>
              <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 700, display: "block" }}>
                Phone Number
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 800, color: "#0f172a" }}>
                {student?.phone || "N/A"}
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* Performance Metrics Table */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, textTransform: "uppercase", color: "#0f172a", mb: 1, letterSpacing: "0.05em" }}>
            Academic Metrics & Attendance Summary
          </Typography>
          <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #cbd5e1", borderRadius: 1.5 }}>
            <Table size="small">
              <TableHead sx={{ bgcolor: "#f1f5f9" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800 }}>Metric</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Present</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Absent</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Late</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Leave</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Total Days</TableCell>
                  <TableCell sx={{ fontWeight: 800, textAlign: "right" }}>Attendance Rate</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Bootcamp Sessions</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#16a34a" }}>{attendanceStats.present || 0}</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#dc2626" }}>{attendanceStats.absent || 0}</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#d97706" }}>{attendanceStats.late || 0}</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#2563eb" }}>{attendanceStats.leave || 0}</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>{attendanceStats.total || attendance.length}</TableCell>
                  <TableCell sx={{ fontWeight: 900, textAlign: "right", color: "#15803d" }}>
                    {report?.attendancePercentage ?? 100}%
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Task Deliverables Table */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, textTransform: "uppercase", color: "#0f172a", mb: 1, letterSpacing: "0.05em" }}>
            Project Deliverables & Assignments
          </Typography>
          <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #cbd5e1", borderRadius: 1.5 }}>
            <Table size="small">
              <TableHead sx={{ bgcolor: "#f1f5f9" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800 }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Assigned Tasks</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Completed</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>In-Progress</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>To-Do</TableCell>
                  <TableCell sx={{ fontWeight: 800, textAlign: "right" }}>Completion Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Bootcamp Deliverables</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>{taskStats.total || 0}</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#16a34a" }}>{taskStats.completed || 0}</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#0284c7" }}>{taskStats.inProgress || 0}</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#64748b" }}>{taskStats.todo || 0}</TableCell>
                  <TableCell sx={{ fontWeight: 900, textAlign: "right", color: "#1e40af" }}>
                    {taskStats.total ? `${Math.round(((taskStats.completed || 0) / taskStats.total) * 100)}%` : "100%"}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Official Signature Footer */}
        <Box sx={{ mt: 6, pt: 3, borderTop: "1px solid #cbd5e1" }}>
          <Grid container spacing={4} justifyContent="space-between" alignItems="flex-end">
            <Grid item xs={5}>
              <Box sx={{ borderBottom: "1px solid #0f172a", width: "100%", mb: 1, minHeight: 40 }} />
              <Typography variant="caption" sx={{ fontWeight: 800, display: "block", color: "#0f172a", textTransform: "uppercase" }}>
                Bootcamp Lead / Instructor
              </Typography>
              <Typography variant="caption" sx={{ color: "#64748b" }}>
                Saylani Mass I.T. Training Program
              </Typography>
            </Grid>

            <Grid item xs={5} sx={{ textAlign: "right" }}>
              <Box sx={{ borderBottom: "1px solid #0f172a", width: "100%", mb: 1, minHeight: 40 }} />
              <Typography variant="caption" sx={{ fontWeight: 800, display: "block", color: "#0f172a", textTransform: "uppercase" }}>
                Academic Operations Director
              </Typography>
              <Typography variant="caption" sx={{ color: "#64748b" }}>
                Official Stamp & Verification Seal
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
}
