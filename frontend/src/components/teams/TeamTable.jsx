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
  AvatarGroup,
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
import GroupsIcon from "@mui/icons-material/Groups";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import DeleteIcon from "@mui/icons-material/Delete";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import PersonIcon from "@mui/icons-material/Person";

import EmptyState from "../common/EmptyState";

export default function TeamTable({
  loading,
  error,
  teams = [],
  projects = [],
  onRetry,
  onViewTeam,
  onEditTeam,
  onManageMembers,
  onDeleteTeam,
  onCreateTeam,
}) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeTeamId, setActiveTeamId] = useState(null);

  const handleOpenMenu = (event, teamId) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setActiveTeamId(teamId);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setActiveTeamId(null);
  };

  const activeTeam = teams.find((t) => (t._id || t.id) === activeTeamId);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Map project assignments
  const projectMap = {};
  projects.forEach((p) => {
    const tId = p.team?._id || p.team?.id || p.teamId?._id || p.teamId?.id || p.team || p.teamId;
    if (tId) {
      projectMap[tId] = p.name || p.title;
    }
  });

  const paginatedTeams = teams.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
          {error || "Unable to load teams. Please check your network connection and try again."}
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
        <Table sx={{ minWidth: 800 }}>
          <TableHead sx={{ bgcolor: "#f8fafc" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, color: "#475569", py: 1.8 }}>Team</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#475569", py: 1.8 }}>Leader / Creator</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#475569", py: 1.8 }}>Members</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#475569", py: 1.8 }}>Project</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#475569", py: 1.8 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#475569", py: 1.8 }}>Created Date</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#475569", py: 1.8 }} align="right">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              // Skeleton Rows Matching Columns
              Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Skeleton variant="circular" width={38} height={38} />
                      <Box>
                        <Skeleton width={120} height={20} />
                        <Skeleton width={70} height={14} />
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Skeleton variant="circular" width={28} height={28} />
                      <Skeleton width={100} height={18} />
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Skeleton width={110} height={28} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={100} height={24} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={70} height={24} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={90} height={18} />
                  </TableCell>
                  <TableCell align="right">
                    <Skeleton width={32} height={32} sx={{ ml: "auto" }} />
                  </TableCell>
                </TableRow>
              ))
            ) : teams.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} sx={{ py: 6, textAlign: "center" }}>
                  <EmptyState
                    title="No Teams Found"
                    description="There are currently no bootcamp teams matching your search criteria."
                    icon={GroupsIcon}
                    actionLabel="Create Team"
                    onAction={onCreateTeam}
                  />
                </TableCell>
              </TableRow>
            ) : (
              paginatedTeams.map((team) => {
                const teamId = team._id || team.id;
                const membersList = Array.isArray(team.members) ? team.members : [];
                const memberCount = membersList.length;
                const projectName = team.project?.name || team.project?.title || projectMap[teamId] || null;
                const creatorName = team.createdBy?.name || "Bootcamp Admin";
                const createdDate = team.createdAt
                  ? new Date(team.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "N/A";

                return (
                  <TableRow
                    key={teamId}
                    hover
                    sx={{
                      cursor: "pointer",
                      "&:hover": { bgcolor: "#f8fafc" },
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                    onClick={() => onViewTeam(teamId)}
                  >
                    {/* Team Column */}
                    <TableCell>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar
                          sx={{
                            bgcolor: "#eff6ff",
                            color: "#1e40af",
                            width: 38,
                            height: 38,
                            fontWeight: 700,
                            borderRadius: 2,
                            fontSize: "0.9rem",
                          }}
                        >
                          {team.name ? team.name.substring(0, 2).toUpperCase() : "TM"}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={700} color="#0f172a">
                            {team.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" fontWeight={500}>
                            #{teamId.substring(teamId.length - 6).toUpperCase()}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>

                    {/* Leader / Creator Column */}
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Avatar
                          sx={{
                            width: 28,
                            height: 28,
                            fontSize: "0.75rem",
                            bgcolor: "#e2e8f0",
                            color: "#334155",
                            fontWeight: 700,
                          }}
                        >
                          {creatorName.charAt(0)}
                        </Avatar>
                        <Typography variant="body2" fontWeight={600} color="#334155">
                          {creatorName}
                        </Typography>
                      </Stack>
                    </TableCell>

                    {/* Members Column */}
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        {memberCount > 0 ? (
                          <AvatarGroup
                            max={4}
                            sx={{
                              "& .MuiAvatar-root": {
                                width: 28,
                                height: 28,
                                fontSize: "0.7rem",
                                fontWeight: 700,
                                borderColor: "#ffffff",
                              },
                            }}
                          >
                            {membersList.map((m, idx) => {
                              const mName = m.name || m.user?.name || `M${idx + 1}`;
                              return (
                                <Tooltip key={m._id || m.id || idx} title={mName}>
                                  <Avatar sx={{ bgcolor: "#3b82f6" }}>{mName.charAt(0)}</Avatar>
                                </Tooltip>
                              );
                            })}
                          </AvatarGroup>
                        ) : null}
                        <Chip
                          label={`${memberCount} Member${memberCount === 1 ? "" : "s"}`}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            fontSize: "0.725rem",
                            bgcolor: memberCount > 0 ? "#f1f5f9" : "#f8fafc",
                            color: memberCount > 0 ? "#334155" : "#94a3b8",
                            borderRadius: 1.5,
                          }}
                        />
                      </Stack>
                    </TableCell>

                    {/* Project Column */}
                    <TableCell>
                      {projectName ? (
                        <Stack direction="row" spacing={0.8} alignItems="center">
                          <FolderOpenIcon sx={{ color: "#0284c7", fontSize: 18 }} />
                          <Typography variant="body2" fontWeight={600} color="#0284c7" noWrap sx={{ maxWidth: 160 }}>
                            {projectName}
                          </Typography>
                        </Stack>
                      ) : (
                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic", fontSize: "0.825rem" }}>
                          No project
                        </Typography>
                      )}
                    </TableCell>

                    {/* Status Column */}
                    <TableCell>
                      {memberCount > 0 ? (
                        <Chip
                          label="Active"
                          size="small"
                          sx={{
                            fontWeight: 700,
                            fontSize: "0.725rem",
                            bgcolor: "#f0fdf4",
                            color: "#16a34a",
                            border: "1px solid #bbf7d0",
                            borderRadius: 1.5,
                          }}
                        />
                      ) : (
                        <Chip
                          label="Empty"
                          size="small"
                          sx={{
                            fontWeight: 700,
                            fontSize: "0.725rem",
                            bgcolor: "#f8fafc",
                            color: "#64748b",
                            border: "1px solid #e2e8f0",
                            borderRadius: 1.5,
                          }}
                        />
                      )}
                    </TableCell>

                    {/* Created Date Column */}
                    <TableCell>
                      <Typography variant="body2" color="text.secondary" fontWeight={500}>
                        {createdDate}
                      </Typography>
                    </TableCell>

                    {/* Actions Column */}
                    <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                      <IconButton
                        aria-label={`Actions for ${team.name}`}
                        size="small"
                        onClick={(e) => handleOpenMenu(e, teamId)}
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
            const tId = activeTeamId;
            handleCloseMenu();
            if (tId) onViewTeam(tId);
          }}
        >
          <ListItemIcon>
            <VisibilityIcon fontSize="small" color="action" />
          </ListItemIcon>
          <ListItemText primary="View Team" primaryTypographyProps={{ variant: "body2", fontWeight: 600 }} />
        </MenuItem>

        <MenuItem
          onClick={() => {
            const teamToEdit = activeTeam;
            handleCloseMenu();
            if (teamToEdit) onEditTeam(teamToEdit);
          }}
        >
          <ListItemIcon>
            <EditIcon fontSize="small" color="action" />
          </ListItemIcon>
          <ListItemText primary="Edit Team" primaryTypographyProps={{ variant: "body2", fontWeight: 600 }} />
        </MenuItem>

        <MenuItem
          onClick={() => {
            const teamToManage = activeTeam;
            handleCloseMenu();
            if (teamToManage) onManageMembers(teamToManage);
          }}
        >
          <ListItemIcon>
            <PersonAddIcon fontSize="small" color="action" />
          </ListItemIcon>
          <ListItemText primary="Manage Members" primaryTypographyProps={{ variant: "body2", fontWeight: 600 }} />
        </MenuItem>

        <MenuItem
          onClick={() => {
            const tId = activeTeamId;
            handleCloseMenu();
            if (tId) onDeleteTeam(tId);
          }}
          sx={{ color: "error.main" }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText primary="Delete Team" primaryTypographyProps={{ variant: "body2", fontWeight: 600, color: "error.main" }} />
        </MenuItem>
      </Menu>

      {/* Pagination */}
      {!loading && teams.length > 0 && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={teams.length}
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
