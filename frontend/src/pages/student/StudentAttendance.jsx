import React, { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Box,
} from "@mui/material";
import EventCheckIcon from "@mui/icons-material/EventAvailable";
import { useOutletContext } from "react-router-dom";

import PageHeader from "../../components/common/PageHeader";
import { PageContent } from "../../components/layout/AppLayout";
import StatusChip from "../../components/common/StatusChip";
import EmptyState from "../../components/common/EmptyState";
import { attendanceApi } from "../../services/attendanceApi";
import { useToast } from "../../context/ToastContext";

export default function StudentAttendance() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const { onMobileNavOpen } = useOutletContext() || {};

  useEffect(() => {
    attendanceApi
      .getMyAttendance()
      .then((res) => {
        if (res.success && res.data) {
          setAttendance(Array.isArray(res.data) ? res.data : []);
        }
      })
      .catch((err) => showToast(err?.message || "Failed to load attendance", "error"))
      .finally(() => setLoading(false));
  }, [showToast]);

  return (
    <PageContent>
      <PageHeader
        title="My Attendance Logs"
        description="Read-only record of your daily attendance and instructor notes."
      />
        <Card sx={{ p: 3 }}>
          {loading ? (
            <Box sx={{ py: 6, textAlign: "center" }}>
              <CircularProgress color="primary" />
            </Box>
          ) : attendance.length === 0 ? (
            <EmptyState
              title="No attendance recorded"
              description="Your attendance logs will appear here once submitted by instructors."
              icon={EventCheckIcon}
            />
          ) : (
            <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
              <Table>
                <TableHead sx={{ bgcolor: "grey.50" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Notes</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {attendance.map((rec) => (
                    <TableRow key={rec._id || rec.id} hover>
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
      </PageContent>
  );
}
