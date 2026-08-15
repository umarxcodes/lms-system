import React, { useState } from "react";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  Box,
  Typography,
  Stack,
  Avatar,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Skeleton,
  Alert,
  Button,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PersonIcon from "@mui/icons-material/Person";
import AssessmentIcon from "@mui/icons-material/Assessment";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";

import EmptyState from "../common/EmptyState";

export default function ReportTable({
  loading,
  error,
  reportType = "attendance",
  reportData = [],
  onRetry,
  onViewDetails,
  onViewStudent,
}) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeItem, setActiveItem] = useState(null);

  const handleOpenMenu = (event, item) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setActiveItem(item);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setActiveItem(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedData = reportData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  if (error) {
    return (
      <Paper elevation={0} sx={{ p: 3, border: "1px solid #fee2e2", borderRadius: 2.5, bgcolor: "#fff5f5" }}>
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={onRetry} sx={{ fontWeight: 700 }}>
              Try Again
            </Button>
          }
        >
          {error || "Unable to load report records. Please try again."}
        </Alert>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        border: "1px solid #e2e8f0",
        borderRadius: 2.5,
        overflow: "hidden",
        bgcolor: "#ffffff",
      }}
    >
      <TableContainer sx={{ width: "100%", overflowX: "auto" }}>
        <Table sx={{ minWidth: 850 }}>
          <TableHead sx={{ bgcolor: "#f8fafc" }}>
            {reportType === "attendance" ? (
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: "#475569", py: 1.8 }}>Trainee</TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#475569", py: 1.8 }}>Date / Session</TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#475569", py: 1.8 }}>Session Status</TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#475569", py: 1.8 }}>Remarks / Notes</TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#475569", py: 1.8 }} align="right">
                  Actions
                </TableCell>
              </TableRow>
            ) : (
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: "#475569", py: 1.8 }}>Task Deliverable</TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#475569", py: 1.8 }}>Assigned Trainee</TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#475569", py: 1.8 }}>Project / Team</TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#475569", py: 1.8 }}>Due Date</TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#475569", py: 1.8 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#475569", py: 1.8 }} align="right">
                  Actions
                </TableCell>
              </TableRow>
            )}
          </TableHead>

          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Skeleton variant="circular" width={36} height={36} />
                      <Box>
                        <Skeleton width={110} height={18} />
                        <Skeleton width={140} height={14} />
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Skeleton width={100} height={20} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={80} height={24} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={140} height={18} />
                  </TableCell>
                  <TableCell align="right">
                    <Skeleton width={32} height={32} sx={{ ml: "auto" }} />
                  </TableCell>
                </TableRow>
              ))
            ) : reportData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} sx={{ py: 6, textAlign: "center" }}>
                  <EmptyState
                    title="No Report Records Found"
                    description="No attendance or assignment records match the selected filters."
                    icon={HourglassTopIcon}
                  />
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((item, index) => {
                const itemId = item._id || item.id || index;

                if (reportType === "attendance") {
                  const student = item.student || item.studentId || {};
                  const studentName = student.name || item.studentName || "Trainee";
                  const studentEmail = student.email || item.studentEmail || "student@saylani.com";
                  const dateStr = item.date
                    ? new Date(item.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
                    : "Aug 15, 2026";
                  const status = (item.status || "present").toLowerCase();
                  const notes = item.notes || item.remarks || "Regular session logging.";

                  const getAttChip = (st) => {
                    if (st === "present") return { label: "PRESENT", bgcolor: "#f0fdf4", color: "#16a34a", borderColor: "#bbf7d0" };
                    if (st === "absent") return { label: "ABSENT", bgcolor: "#fef2f2", color: "#dc2626", borderColor: "#fecaca" };
                    if (st === "late") return { label: "LATE", bgcolor: "#fffbebe", color: "#d97706", borderColor: "#fde68a" };
                    return { label: "LEAVE", bgcolor: "#eff6ff", color: "#1e40af", borderColor: "#bfdbfe" };
                  };

                  const chip = getAttChip(status);

                  return (
                    <TableRow
                      key={itemId}
                      hover
                      sx={{
                        cursor: "pointer",
                        "&:hover": { bgcolor: "#f8fafc" },
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                      onClick={() => onViewDetails(item)}
                    >
                      <TableCell>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Avatar sx={{ bgcolor: "#eff6ff", color: "#1e40af", width: 36, height: 36, fontSize: "0.85rem", fontWeight: 700 }}>
                            {studentName.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={700} color="#0f172a">
                              {studentName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" fontWeight={500}>
                              {studentEmail}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2" fontWeight={600} color="#334155">
                          {dateStr}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={chip.label}
                          size="small"
                          sx={{
                            fontWeight: 800,
                            fontSize: "0.7rem",
                            bgcolor: chip.bgcolor,
                            color: chip.color,
                            border: `1px solid ${chip.borderColor}`,
                            borderRadius: 1.5,
                          }}
                        />
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 220 }}>
                          {notes}
                        </Typography>
                      </TableCell>

                      <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                        <IconButton
                          aria-label={`Actions for ${studentName}'s attendance report`}
                          size="small"
                          onClick={(e) => handleOpenMenu(e, item)}
                          sx={{ color: "text.secondary", "&:hover": { bgcolor: "#f1f5f9" } }}
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                } else {
                  // Assignment / Task Deliverable Report
                  const taskTitle = item.title || item.name || "Task Deliverable";
                  const assignedTo = item.assignedTo?.name || item.studentName || "Unassigned";
                  const projectTeam = item.project?.name || item.team?.name || "General Bootcamp";
                  const dueDateStr = item.dueDate
                    ? new Date(item.dueDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
                    : "Aug 20, 2026";
                  const status = (item.status || "pending").toLowerCase();

                  const isDone = status === "completed" || status === "done";
                  const isProgress = status === "in_progress" || status === "in-progress";

                  return (
                    <TableRow
                      key={itemId}
                      hover
                      sx={{
                        cursor: "pointer",
                        "&:hover": { bgcolor: "#f8fafc" },
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                      onClick={() => onViewDetails(item)}
                    >
                      <TableCell>
                        <Typography variant="body2" fontWeight={700} color="#0f172a">
                          {taskTitle}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2" fontWeight={600} color="#334155">
                          {assignedTo}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={projectTeam}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            fontSize: "0.725rem",
                            bgcolor: "#f0f9ff",
                            color: "#0369a1",
                            borderRadius: 1.5,
                          }}
                        />
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2" color="text.secondary" fontWeight={500}>
                          {dueDateStr}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={isDone ? "COMPLETED" : isProgress ? "IN PROGRESS" : "PENDING"}
                          size="small"
                          sx={{
                            fontWeight: 800,
                            fontSize: "0.7rem",
                            bgcolor: isDone ? "#f0fdf4" : isProgress ? "#eff6ff" : "#f8fafc",
                            color: isDone ? "#16a34a" : isProgress ? "#1e40af" : "#64748b",
                            border: `1px solid ${isDone ? "#bbf7d0" : isProgress ? "#bfdbfe" : "#e2e8f0"}`,
                            borderRadius: 1.5,
                          }}
                        />
                      </TableCell>

                      <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                        <IconButton
                          aria-label={`Actions for deliverable ${taskTitle}`}
                          size="small"
                          onClick={(e) => handleOpenMenu(e, item)}
                          sx={{ color: "text.secondary", "&:hover": { bgcolor: "#f1f5f9" } }}
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                }
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Row Action Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        PaperProps={{
          elevation: 2,
          sx: {
            minWidth: 170,
            borderRadius: 2,
            border: "1px solid #e2e8f0",
            py: 0.5,
          },
        }}
      >
        <MenuItem
          onClick={() => {
            const item = activeItem;
            handleCloseMenu();
            if (item && onViewDetails) onViewDetails(item);
          }}
        >
          <ListItemIcon>
            <VisibilityIcon fontSize="small" color="action" />
          </ListItemIcon>
          <ListItemText primary="View Record Details" primaryTypographyProps={{ variant: "body2", fontWeight: 600 }} />
        </MenuItem>

        {activeItem?.student?._id && (
          <MenuItem
            onClick={() => {
              const item = activeItem;
              handleCloseMenu();
              if (item && onViewStudent) onViewStudent(item.student._id);
            }}
          >
            <ListItemIcon>
              <PersonIcon fontSize="small" color="action" />
            </ListItemIcon>
            <ListItemText primary="View Trainee Profile" primaryTypographyProps={{ variant: "body2", fontWeight: 600 }} />
          </MenuItem>
        )}
      </Menu>

      {/* Pagination */}
      {!loading && reportData.length > 0 && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={reportData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ borderTop: "1px solid #e2e8f0" }}
        />
      )}
    </Paper>
  );
}
