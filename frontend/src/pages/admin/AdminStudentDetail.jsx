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
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonIcon from "@mui/icons-material/Person";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import GroupsIcon from "@mui/icons-material/Groups";
import ChecklistIcon from "@mui/icons-material/Checklist";
import AssessmentIcon from "@mui/icons-material/Assessment";
import DownloadIcon from "@mui/icons-material/Download";
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
          if (studentRes.status === "fulfilled" && studentRes.value.success) {
            setStudent(studentRes.value.data);
          }
          if (attendanceRes.status === "fulfilled" && attendanceRes.value.success) {
            setAttendance(Array.isArray(attendanceRes.value.data) ? attendanceRes.value.data : []);
          }
          if (reportRes.status === "fulfilled" && reportRes.value.success) {
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

  return (
    <PageContent>
      <PageHeader
        title={`Student Profile: ${studentName}`}
        description={`Roll Number: ${student?.rollNumber || "N/A"} | Batch: ${student?.batch || "Batch 1"}`}
        actions={
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/admin/students")}>
            Back to List
          </Button>
        }
      />
        {loading ? (
          <Skeleton variant="rounded" height={220} />
        ) : (
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={3} alignItems="center">
                <Avatar
                  src={student?.user?.avatarUrl || student?.avatarUrl || ""}
                  alt={studentName}
                  sx={{ width: 88, height: 88, bgcolor: "primary.main", fontSize: 36, fontWeight: 700 }}
                >
                  {studentName.charAt(0).toUpperCase()}
                </Avatar>

                <Box sx={{ flex: 1 }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {studentName}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary", mb: 1.5 }}>
                    {studentEmail}
                  </Typography>

                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    <StatusChip status="Active" />
                    <Typography variant="caption" sx={{ py: 0.5, px: 1, bgcolor: "grey.100", borderRadius: 1, fontWeight: 600 }}>
                      Roll #: {student?.rollNumber || "N/A"}
                    </Typography>
                    <Typography variant="caption" sx={{ py: 0.5, px: 1, bgcolor: "grey.100", borderRadius: 1, fontWeight: 600 }}>
                      Batch: {student?.batch || "Batch 1"}
                    </Typography>
                  </Stack>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        )}

        {/* Tab Navigation */}
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={activeTab} onChange={(e, val) => setActiveTab(val)}>
            <Tab icon={<PersonIcon fontSize="small" />} iconPosition="start" label="Overview" />
            <Tab icon={<EventAvailableIcon fontSize="small" />} iconPosition="start" label="Attendance" />
            <Tab icon={<GroupsIcon fontSize="small" />} iconPosition="start" label="Team & Projects" />
            <Tab icon={<AssessmentIcon fontSize="small" />} iconPosition="start" label="Report" />
          </Tabs>
        </Box>

        {/* Tab Panel 0: Overview */}
        {activeTab === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                    Contact Information
                  </Typography>
                  <Stack spacing={1.5}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Phone Number
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {student?.phone || "Not provided"}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Address
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {student?.address || "Not provided"}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Assigned Team
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {student?.team?.name || student?.teamId?.name || "No Team Assigned"}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                    Progress Summary
                  </Typography>
                  <Stack spacing={1.5}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Total Attendance Recorded
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {attendance.length} Days
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Overall Percentage
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {report?.attendancePercentage ?? 100}%
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Tab Panel 1: Attendance History */}
        {activeTab === 1 && (
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Attendance Records
            </Typography>
            {attendance.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No attendance logs found for this student.
              </Typography>
            ) : (
              <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
                <Table size="small">
                  <TableHead sx={{ bgcolor: "grey.50" }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Notes</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {attendance.map((rec) => (
                      <TableRow key={rec._id || rec.id}>
                        <TableCell sx={{ fontWeight: 600 }}>{rec.date}</TableCell>
                        <TableCell>
                          <StatusChip status={rec.status} />
                        </TableCell>
                        <TableCell>{rec.notes || "—"}</TableCell>
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
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
              Team Assignment
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {student?.team?.name || student?.teamId?.name
                ? `Currently assigned to ${student.team?.name || student.teamId?.name}`
                : "This student is not assigned to any project team."}
            </Typography>
          </Card>
        )}

        {/* Tab Panel 3: Report */}
        {activeTab === 3 && (
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Student Progress & Performance Report
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Aggregated attendance and assignment statistics computed by backend services.
            </Typography>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={() => showToast("Exporting student report card...", "info")}
            >
              Export Report Card
            </Button>
          </Card>
        )}
      </PageContent>
  );
}
