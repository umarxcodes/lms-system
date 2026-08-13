import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Card,
  Typography,
  Button,
  Stack,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  CircularProgress,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import EventCheckIcon from "@mui/icons-material/EventAvailable";
import { useOutletContext } from "react-router-dom";

import Header from "../../components/layout/Header";
import { PageContent } from "../../components/layout/AppLayout";
import StatusChip from "../../components/common/StatusChip";
import EmptyState from "../../components/common/EmptyState";
import { attendanceApi } from "../../services/attendanceApi";
import { studentApi } from "../../services/studentApi";
import { useToast } from "../../context/ToastContext";

export default function AdminAttendance() {
  const [attendanceList, setAttendanceList] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedStatus, setSelectedStatus] = useState("");

  // Mark / Edit Dialog State
  const [openModal, setOpenModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState({
    studentId: "",
    date: new Date().toISOString().split("T")[0],
    status: "present",
    notes: "",
  });

  const { showToast } = useToast();
  const { onMobileNavOpen } = useOutletContext() || {};

  // Fetch Students dropdown list
  useEffect(() => {
    studentApi.getStudents({ limit: 100 }).then((res) => {
      if (res.success && res.data) {
        const items = Array.isArray(res.data) ? res.data : res.data.students || [];
        setStudents(items);
      }
    });
  }, []);

  const fetchAttendance = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        date: selectedDate || undefined,
        status: selectedStatus || undefined,
      };
      const res = await attendanceApi.getAttendanceList(params);
      if (res.success && res.data) {
        setAttendanceList(Array.isArray(res.data) ? res.data : res.data.attendance || []);
      }
    } catch (err) {
      showToast(err?.message || "Failed to load attendance", "error");
    } finally {
      setLoading(false);
    }
  }, [selectedDate, selectedStatus, showToast]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  const handleOpenMark = () => {
    setEditingRecord(null);
    setFormError("");
    setFormData({
      studentId: students.length > 0 ? students[0]._id || students[0].id : "",
      date: new Date().toISOString().split("T")[0],
      status: "present",
      notes: "",
    });
    setOpenModal(true);
  };

  const handleOpenEdit = (rec) => {
    setEditingRecord(rec);
    setFormError("");
    setFormData({
      studentId: rec.studentId?._id || rec.studentId || rec.student?._id || "",
      date: rec.date || "",
      status: rec.status || "present",
      notes: rec.notes || "",
    });
    setOpenModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSubmitting(true);

    try {
      if (editingRecord) {
        await attendanceApi.updateAttendance(editingRecord._id || editingRecord.id, {
          status: formData.status,
          notes: formData.notes,
        });
        showToast("Attendance record updated successfully!", "success");
      } else {
        await attendanceApi.markAttendance(formData);
        showToast("Attendance marked successfully!", "success");
      }
      setOpenModal(false);
      fetchAttendance();
    } catch (err) {
      if (err?.status === 409 || err?.message?.includes("already")) {
        setFormError("Attendance has already been submitted for this student on the selected date.");
      } else {
        setFormError(err?.message || "Failed to submit attendance");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header
        title="Attendance Management"
        subtitle="Track, mark, and audit student daily attendance records."
        onMobileNavOpen={onMobileNavOpen}
        actions={
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenMark}>
            Mark Attendance
          </Button>
        }
      />

      <PageContent>
        <Card sx={{ p: 3 }}>
          <Grid container spacing={2} sx={{ mb: 3, alignItems: "center" }}>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Filter by Date"
                type="date"
                fullWidth
                size="small"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Filter by Status"
                select
                fullWidth
                size="small"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <MenuItem value="">All Statuses</MenuItem>
                <MenuItem value="present">Present</MenuItem>
                <MenuItem value="absent">Absent</MenuItem>
                <MenuItem value="late">Late</MenuItem>
                <MenuItem value="excused">Excused</MenuItem>
              </TextField>
            </Grid>
          </Grid>

          {loading ? (
            <Box sx={{ py: 6, textAlign: "center" }}>
              <CircularProgress color="primary" />
            </Box>
          ) : attendanceList.length === 0 ? (
            <EmptyState
              title="No attendance records"
              description="No attendance entries found for the selected date and filters."
              icon={EventCheckIcon}
              actionLabel="Mark Attendance"
              onAction={handleOpenMark}
            />
          ) : (
            <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
              <Table>
                <TableHead sx={{ bgcolor: "grey.50" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Student Name</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Roll #</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Notes</TableCell>
                    <TableCell sx={{ fontWeight: 700 }} align="right">
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {attendanceList.map((rec) => {
                    const sName = rec.studentId?.name || rec.studentId?.user?.name || rec.student?.name || "Student";
                    const sRoll = rec.studentId?.rollNumber || rec.student?.rollNumber || "N/A";
                    return (
                      <TableRow key={rec._id || rec.id} hover>
                        <TableCell sx={{ fontWeight: 600 }}>{sName}</TableCell>
                        <TableCell>{sRoll}</TableCell>
                        <TableCell>{rec.date}</TableCell>
                        <TableCell>
                          <StatusChip status={rec.status} />
                        </TableCell>
                        <TableCell>{rec.notes || "—"}</TableCell>
                        <TableCell align="right">
                          <Tooltip title="Edit Record">
                            <IconButton size="small" color="info" onClick={() => handleOpenEdit(rec)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Card>
      </PageContent>

      {/* Mark / Edit Dialog */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {editingRecord ? "Edit Attendance Record" : "Mark Student Attendance"}
        </DialogTitle>
        <Box component="form" onSubmit={handleSubmit}>
          <DialogContent dividers>
            <Stack spacing={2.5}>
              {formError && (
                <Typography variant="body2" color="error.main" fontWeight={600}>
                  {formError}
                </Typography>
              )}

              <TextField
                label="Student"
                select
                fullWidth
                required
                disabled={Boolean(editingRecord)}
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
              >
                {students.map((s) => (
                  <MenuItem key={s._id || s.id} value={s._id || s.id}>
                    {s.name || s.user?.name} ({s.rollNumber || "No Roll #"})
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Date"
                type="date"
                fullWidth
                required
                disabled={Boolean(editingRecord)}
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                label="Attendance Status"
                select
                fullWidth
                required
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <MenuItem value="present">Present</MenuItem>
                <MenuItem value="absent">Absent</MenuItem>
                <MenuItem value="late">Late</MenuItem>
                <MenuItem value="excused">Excused</MenuItem>
              </TextField>

              <TextField
                label="Notes / Reason"
                fullWidth
                multiline
                rows={2}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setOpenModal(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={submitting}
              startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : null}
            >
              {submitting ? "Submitting..." : editingRecord ? "Update Record" : "Save Attendance"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
}
