import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Typography,
  Box,
  Paper,
  Chip,
  Grid,
} from "@mui/material";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import AssignmentIcon from "@mui/icons-material/Assignment";

export default function ReportDetailsDialog({ open, onClose, reportItem, reportType }) {
  if (!reportItem) return null;

  const isAttendance = reportType === "attendance";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        elevation: 0,
        sx: {
          borderRadius: 3,
          border: "1px solid #e2e8f0",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 800, color: "#0f172a", pt: 3, pb: 1 }}>
        {isAttendance ? "Attendance Audit Record" : "Deliverable Record Details"}
      </DialogTitle>

      <DialogContent dividers sx={{ borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0", py: 3 }}>
        <Stack spacing={2.5}>
          {/* Header Summary Box */}
          <Paper elevation={0} sx={{ p: 2.5, bgcolor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 2.5 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              {isAttendance ? (
                <EventAvailableIcon sx={{ color: "#16a34a", fontSize: 32 }} />
              ) : (
                <AssignmentIcon sx={{ color: "#1e40af", fontSize: 32 }} />
              )}
              <Box>
                <Typography variant="subtitle1" fontWeight={800} color="#0f172a">
                  {isAttendance
                    ? reportItem.student?.name || reportItem.studentName || "Trainee Attendance"
                    : reportItem.title || reportItem.name || "Task Deliverable"}
                </Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  {isAttendance
                    ? reportItem.student?.email || reportItem.studentEmail || "Official Session Record"
                    : reportItem.project?.name || "Bootcamp Deliverable Log"}
                </Typography>
              </Box>
            </Stack>
          </Paper>

          {/* Key Metric Fields */}
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary" fontWeight={700} display="block" sx={{ textTransform: "uppercase" }}>
                {isAttendance ? "Log Date" : "Due Date"}
              </Typography>
              <Typography variant="body2" fontWeight={700} color="#0f172a">
                {isAttendance
                  ? reportItem.date
                    ? new Date(reportItem.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
                    : "Aug 15, 2026"
                  : reportItem.dueDate
                  ? new Date(reportItem.dueDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
                  : "Aug 20, 2026"}
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary" fontWeight={700} display="block" sx={{ textTransform: "uppercase" }}>
                Status
              </Typography>
              <Chip
                label={(reportItem.status || "COMPLETED").toUpperCase()}
                size="small"
                sx={{
                  fontWeight: 800,
                  borderRadius: 1.5,
                  mt: 0.25,
                  bgcolor: reportItem.status === "absent" ? "#fef2f2" : "#f0fdf4",
                  color: reportItem.status === "absent" ? "#dc2626" : "#16a34a",
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="caption" color="text.secondary" fontWeight={700} display="block" sx={{ textTransform: "uppercase" }}>
                {isAttendance ? "Remarks / Admin Notes" : "Task Description"}
              </Typography>
              <Paper elevation={0} sx={{ p: 2, mt: 0.5, bgcolor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 2 }}>
                <Typography variant="body2" color="#334155">
                  {reportItem.notes || reportItem.remarks || reportItem.description || "No additional remarks provided."}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2.5, bgcolor: "#f8fafc" }}>
        <Button onClick={onClose} variant="contained" sx={{ fontWeight: 700, borderRadius: 2, px: 3 }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
