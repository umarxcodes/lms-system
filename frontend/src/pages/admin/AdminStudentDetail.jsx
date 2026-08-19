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
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonIcon from "@mui/icons-material/Person";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import GroupsIcon from "@mui/icons-material/Groups";
import AssessmentIcon from "@mui/icons-material/Assessment";
import DownloadIcon from "@mui/icons-material/Download";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import HomeIcon from "@mui/icons-material/Home";
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
  const [activeTab, setActiveTab] = useState(0);

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

  return (
    <PageContent>
      <PageHeader
        title={`Student Profile: ${studentName}`}
        description={`Roll Number: ${student?.rollNumber || "N/A"} | Batch: ${student?.batch || "Batch 1"}`}
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
        <Card elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid #e2e8f0", bgcolor: "#ffffff" }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: "#0f172a" }}>
            Student Performance Report
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748b", mb: 3 }}>
            Aggregated attendance, submission stats, and task completion metrics.
          </Typography>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={() => showToast("Exporting student report card...", "info")}
            sx={{ fontWeight: 700, borderRadius: 2 }}
          >
            Export Student Report Card
          </Button>
        </Card>
      )}
    </PageContent>
  );
}
