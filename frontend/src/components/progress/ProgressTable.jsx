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
  Tooltip,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PersonIcon from "@mui/icons-material/Person";
import FolderIcon from "@mui/icons-material/Folder";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";

import EmptyState from "../common/EmptyState";
import ProgressBar from "./ProgressBar";

export default function ProgressTable({
  loading,
  error,
  progressData = [],
  onRetry,
  onViewProgress,
  onViewStudent,
  onViewProject,
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

  const paginatedData = progressData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
          {error || "Unable to load progress data. Please try again."}
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
            <TableRow>
              <TableCell sx={{ fontWeight: 700, color: "#475569", py: 1.8 }}>Student</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#475569", py: 1.8 }}>Team</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#475569", py: 1.8 }}>Project</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#475569", py: 1.8 }}>Tasks</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#475569", py: 1.8, width: 220 }}>Progress</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#475569", py: 1.8 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#475569", py: 1.8 }}>Last Updated</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#475569", py: 1.8 }} align="right">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              // Skeleton Loading Rows
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
                    <Skeleton width={90} height={24} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={110} height={24} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={60} height={20} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={180} height={16} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={80} height={24} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={90} height={18} />
                  </TableCell>
                  <TableCell align="right">
                    <Skeleton width={32} height={32} sx={{ ml: "auto" }} />
                  </TableCell>
                </TableRow>
              ))
            ) : progressData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} sx={{ py: 6, textAlign: "center" }}>
                  <EmptyState
                    title="No Progress Data Found"
                    description="There are currently no student progress records matching your filters."
                    icon={HourglassTopIcon}
                  />
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((item) => {
                const itemId = item.id || item._id;
                const studentName = item.studentName || "Student";
                const studentEmail = item.studentEmail || "N/A";
                const teamName = item.teamName || "No team";
                const projectName = item.projectName || "No project";
                const completedTasks = item.completedTasks || 0;
                const totalTasks = item.totalTasks || 0;
                const progressValue = item.progressPercentage || 0;
                const status = item.status || "in_progress";
                const formattedDate = item.lastUpdated
                  ? new Date(item.lastUpdated).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "Aug 15, 2026";

                const getStatusChipProps = (st) => {
                  if (st === "completed") {
                    return { label: "Completed", bgcolor: "#f0fdf4", color: "#16a34a", borderColor: "#bbf7d0" };
                  }
                  if (st === "in_progress" || st === "in-progress") {
                    return { label: "In Progress", bgcolor: "#eff6ff", color: "#1e40af", borderColor: "#bfdbfe" };
                  }
                  return { label: "Pending", bgcolor: "#f8fafc", color: "#64748b", borderColor: "#e2e8f0" };
                };

                const chipProps = getStatusChipProps(status);

                return (
                  <TableRow
                    key={itemId}
                    hover
                    sx={{
                      cursor: "pointer",
                      "&:hover": { bgcolor: "#f8fafc" },
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                    onClick={() => onViewProgress(item)}
                  >
                    {/* Student Column */}
                    <TableCell>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar
                          sx={{
                            bgcolor: "#eff6ff",
                            color: "#1e40af",
                            width: 36,
                            height: 36,
                            fontSize: "0.85rem",
                            fontWeight: 700,
                          }}
                        >
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

                    {/* Team Column */}
                    <TableCell>
                      {teamName !== "No team" ? (
                        <Chip
                          label={teamName}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            fontSize: "0.725rem",
                            bgcolor: "#f1f5f9",
                            color: "#334155",
                            borderRadius: 1.5,
                          }}
                        />
                      ) : (
                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic", fontSize: "0.825rem" }}>
                          No team
                        </Typography>
                      )}
                    </TableCell>

                    {/* Project Column */}
                    <TableCell>
                      {projectName !== "No project" ? (
                        <Chip
                          label={projectName}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            fontSize: "0.725rem",
                            bgcolor: "#f0f9ff",
                            color: "#0369a1",
                            border: "1px solid #bae6fd",
                            borderRadius: 1.5,
                          }}
                        />
                      ) : (
                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic", fontSize: "0.825rem" }}>
                          No project
                        </Typography>
                      )}
                    </TableCell>

                    {/* Tasks Column */}
                    <TableCell>
                      <Typography variant="body2" fontWeight={700} color="#334155">
                        {completedTasks} / {totalTasks}
                      </Typography>
                    </TableCell>

                    {/* Progress Column */}
                    <TableCell sx={{ width: 220 }}>
                      <ProgressBar value={progressValue} />
                    </TableCell>

                    {/* Status Column */}
                    <TableCell>
                      <Chip
                        label={chipProps.label}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          fontSize: "0.725rem",
                          bgcolor: chipProps.bgcolor,
                          color: chipProps.color,
                          border: `1px solid ${chipProps.borderColor}`,
                          borderRadius: 1.5,
                        }}
                      />
                    </TableCell>

                    {/* Last Updated Column */}
                    <TableCell>
                      <Typography variant="body2" color="text.secondary" fontWeight={500}>
                        {formattedDate}
                      </Typography>
                    </TableCell>

                    {/* Actions Column */}
                    <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                      <IconButton
                        aria-label={`Actions for ${studentName}'s progress`}
                        size="small"
                        onClick={(e) => handleOpenMenu(e, item)}
                        sx={{ color: "text.secondary", "&:hover": { bgcolor: "#f1f5f9" } }}
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
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
            if (item && onViewProgress) onViewProgress(item);
          }}
        >
          <ListItemIcon>
            <VisibilityIcon fontSize="small" color="action" />
          </ListItemIcon>
          <ListItemText primary="View Details" primaryTypographyProps={{ variant: "body2", fontWeight: 600 }} />
        </MenuItem>

        {activeItem?.studentId && (
          <MenuItem
            onClick={() => {
              const item = activeItem;
              handleCloseMenu();
              if (item && onViewStudent) onViewStudent(item.studentId);
            }}
          >
            <ListItemIcon>
              <PersonIcon fontSize="small" color="action" />
            </ListItemIcon>
            <ListItemText primary="View Student" primaryTypographyProps={{ variant: "body2", fontWeight: 600 }} />
          </MenuItem>
        )}

        {activeItem?.projectId && (
          <MenuItem
            onClick={() => {
              const item = activeItem;
              handleCloseMenu();
              if (item && onViewProject) onViewProject(item.projectId);
            }}
          >
            <ListItemIcon>
              <FolderIcon fontSize="small" color="action" />
            </ListItemIcon>
            <ListItemText primary="View Project" primaryTypographyProps={{ variant: "body2", fontWeight: 600 }} />
          </MenuItem>
        )}
      </Menu>

      {/* Pagination */}
      {!loading && progressData.length > 0 && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={progressData.length}
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
