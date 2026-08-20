import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Card,
  Typography,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  CircularProgress,
  IconButton,
  Tooltip,
  MenuItem,
  TextField,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Skeleton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import DeleteIcon from "@mui/icons-material/Delete";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import GroupsIcon from "@mui/icons-material/Groups";
import { useParams, useNavigate } from "react-router-dom";

import PageHeader from "../../components/common/PageHeader";
import { PageContent } from "../../components/layout/AppLayout";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { teamApi } from "../../services/teamApi";
import { studentApi } from "../../services/studentApi";
import { useToast } from "../../context/ToastContext";

export default function AdminTeamDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [team, setTeam] = useState(null);
  const [members, setMembers] = useState([]);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add Member Modal State
  const [openAddModal, setOpenAddModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [addSubmitting, setAddSubmitting] = useState(false);

  // Remove Member State
  const [removeMemberId, setRemoveMemberId] = useState(null);
  const [removeSubmitting, setRemoveSubmitting] = useState(false);

  const fetchTeamData = useCallback(async () => {
    try {
      setLoading(true);
      const [teamRes, membersRes] = await Promise.all([
        teamApi.getTeamById(id),
        teamApi.getTeamMembers(id),
      ]);

      if (teamRes.success) setTeam(teamRes.data);
      if (membersRes.success) setMembers(Array.isArray(membersRes.data) ? membersRes.data : []);
    } catch (err) {
      showToast(err?.message || "Failed to load team details", "error");
    } finally {
      setLoading(false);
    }
  }, [id, showToast]);

  useEffect(() => {
    fetchTeamData();
  }, [fetchTeamData]);

  const handleOpenAddModal = async () => {
    try {
      const res = await studentApi.getStudents({ limit: 100 });
      if (res.success && res.data) {
        const allStudents = Array.isArray(res.data) ? res.data : res.data.students || [];
        const currentMemberIds = members.map((m) => m._id || m.id || m.user?._id);
        const unassigned = allStudents.filter((s) => !currentMemberIds.includes(s._id || s.id));
        setAvailableStudents(unassigned);
        setSelectedStudentId(unassigned.length > 0 ? unassigned[0]._id || unassigned[0].id : "");
      }
      setOpenAddModal(true);
    } catch (err) {
      showToast("Failed to fetch available students", "error");
    }
  };

  const handleAddMemberSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStudentId) return;
    setAddSubmitting(true);
    try {
      await teamApi.addMember(id, selectedStudentId);
      showToast("Student added to team successfully!", "success");
      setOpenAddModal(false);
      fetchTeamData();
    } catch (err) {
      showToast(err?.message || "Failed to add member to team", "error");
    } finally {
      setAddSubmitting(false);
    }
  };

  const handleRemoveMemberConfirm = async () => {
    if (!removeMemberId) return;
    setRemoveSubmitting(true);
    try {
      await teamApi.removeMember(id, removeMemberId);
      showToast("Member removed from team successfully!", "success");
      setRemoveMemberId(null);
      fetchTeamData();
    } catch (err) {
      showToast(err?.message || "Failed to remove member", "error");
    } finally {
      setRemoveSubmitting(false);
    }
  };

  const memberCount = members.length;

  return (
    <>
      <PageContent px={{ xs: 2, sm: 3, md: 4 }}>
        {/* Page Header */}
        <PageHeader
          breadcrumbs={[
            { label: "Home", to: "/admin/dashboard" },
            { label: "Teams", to: "/admin/teams" },
            { label: team?.name || "Team Detail" },
          ]}
          title={team?.name ? `Team: ${team.name}` : "Team Detail"}
          description={team?.description || "Manage team roster, member trainees, and project deliverables."}
          actions={
            <Stack direction="row" spacing={1.5}>
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate("/admin/teams")}
                sx={{ fontWeight: 700, borderRadius: 2, bgcolor: "#ffffff" }}
              >
                Back to Teams
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<PersonAddIcon />}
                onClick={handleOpenAddModal}
                sx={{ fontWeight: 700, borderRadius: 2, boxShadow: "none" }}
              >
                Add Member
              </Button>
            </Stack>
          }
        />

        {/* Team Detail Overview Header Banner */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            bgcolor: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: 2.5,
            mb: 3,
          }}
        >
          {loading ? (
            <Skeleton variant="rounded" height={60} />
          ) : (
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={8}>
                <Stack direction="row" spacing={2.5} alignItems="center">
                  <Avatar
                    sx={{
                      bgcolor: "#eff6ff",
                      color: "#1e40af",
                      width: 56,
                      height: 56,
                      fontSize: 22,
                      fontWeight: 800,
                      borderRadius: 2.5,
                    }}
                  >
                    {team?.name ? team.name.substring(0, 2).toUpperCase() : "TM"}
                  </Avatar>
                  <Box>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Typography variant="h5" sx={{ fontWeight: 800, color: "#0f172a" }}>
                        {team?.name}
                      </Typography>
                      {memberCount > 0 ? (
                        <Chip
                          label="Active Team"
                          size="small"
                          sx={{ bgcolor: "#f0fdf4", color: "#16a34a", fontWeight: 700, borderRadius: 1.5 }}
                        />
                      ) : (
                        <Chip
                          label="Empty Squad"
                          size="small"
                          sx={{ bgcolor: "#f8fafc", color: "#64748b", fontWeight: 700, borderRadius: 1.5 }}
                        />
                      )}
                    </Stack>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {team?.description || "No description provided for this team."}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>

              <Grid item xs={12} md={4}>
                <Stack
                  direction="row"
                  spacing={3}
                  justifyContent={{ xs: "flex-start", md: "flex-end" }}
                  alignItems="center"
                >
                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: "uppercase" }}>
                      Total Members
                    </Typography>
                    <Typography variant="h5" fontWeight={800} color="#0f172a">
                      {memberCount}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: "uppercase" }}>
                      Created By
                    </Typography>
                    <Typography variant="subtitle2" fontWeight={700} color="#0f172a">
                      {team?.createdBy?.name || "Admin"}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
            </Grid>
          )}
        </Paper>

        {/* Content Section: Members Roster & Project Info */}
        <Grid container spacing={3}>
          {/* Members Table */}
          <Grid item xs={12} lg={8}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                bgcolor: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: 2.5,
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a" }}>
                  Team Members ({memberCount})
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<PersonAddIcon />}
                  onClick={handleOpenAddModal}
                  sx={{ fontWeight: 700, borderRadius: 2 }}
                >
                  Add Trainee
                </Button>
              </Stack>

              {loading ? (
                <Skeleton variant="rounded" height={200} />
              ) : members.length === 0 ? (
                <Box sx={{ py: 6, textAlign: "center", border: "1px dashed #e2e8f0", borderRadius: 2 }}>
                  <GroupsIcon sx={{ fontSize: 40, color: "text.secondary", mb: 1 }} />
                  <Typography variant="h6" color="text.secondary" fontWeight={700}>
                    No Trainees Assigned
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Assign students to this team to build their project squad.
                  </Typography>
                  <Button variant="contained" size="small" onClick={handleOpenAddModal} sx={{ fontWeight: 700 }}>
                    Add Member
                  </Button>
                </Box>
              ) : (
                <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 2 }}>
                  <Table size="small">
                    <TableHead sx={{ bgcolor: "#f8fafc" }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Student Trainee</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Email Address</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Roll Number</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: "#475569" }} align="right">
                          Action
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {members.map((m) => {
                        const name = m.name || m.user?.name || "Student";
                        const email = m.email || m.user?.email || "N/A";
                        const roll = m.rollNumber || "N/A";
                        const mId = m._id || m.id;
                        return (
                          <TableRow key={mId} hover>
                            <TableCell>
                              <Stack direction="row" spacing={1.5} alignItems="center">
                                <Avatar sx={{ width: 32, height: 32, bgcolor: "#eff6ff", color: "#1e40af", fontSize: 13, fontWeight: 700 }}>
                                  {name.charAt(0)}
                                </Avatar>
                                <Typography variant="body2" fontWeight={700} color="#0f172a">
                                  {name}
                                </Typography>
                              </Stack>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" color="text.secondary">
                                {email}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip label={roll} size="small" variant="outlined" sx={{ fontWeight: 600, borderRadius: 1 }} />
                            </TableCell>
                            <TableCell align="right">
                              <Tooltip title="Remove from Team">
                                <IconButton size="small" color="error" onClick={() => setRemoveMemberId(mId)}>
                                  <DeleteIcon fontSize="small" />
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
            </Paper>
          </Grid>

          {/* Assigned Project Card */}
          <Grid item xs={12} lg={4}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                bgcolor: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: 2.5,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a", mb: 2 }}>
                Assigned Capstone Project
              </Typography>
              {team?.project ? (
                <Box sx={{ p: 2.5, bgcolor: "#f8fafc", borderRadius: 2, border: "1px solid #e2e8f0" }}>
                  <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                    <FolderOpenIcon sx={{ color: "#0284c7" }} />
                    <Typography variant="subtitle1" fontWeight={800} color="#0f172a">
                      {team.project.name || team.project.title}
                    </Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    {team.project.description || "Active team development project."}
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ p: 3, bgcolor: "#f8fafc", borderRadius: 2, border: "1px solid #e2e8f0", textAlign: "center" }}>
                  <FolderOpenIcon sx={{ fontSize: 36, color: "text.secondary", mb: 1 }} />
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>
                    No project assigned to this team yet.
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </PageContent>

      {/* Add Member Dialog */}
      <Dialog
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          elevation: 0,
          sx: { borderRadius: 3, border: "1px solid #e2e8f0" },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>Add Student to Team</DialogTitle>
        <Box component="form" onSubmit={handleAddMemberSubmit}>
          <DialogContent dividers>
            {availableStudents.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No unassigned students available. All active trainees are already assigned to teams.
              </Typography>
            ) : (
              <TextField
                label="Select Student"
                select
                fullWidth
                required
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              >
                {availableStudents.map((s) => (
                  <MenuItem key={s._id || s.id} value={s._id || s.id}>
                    {s.name || s.user?.name} ({s.rollNumber || "No Roll #"})
                  </MenuItem>
                ))}
              </TextField>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2.5, bgcolor: "#f8fafc" }}>
            <Button onClick={() => setOpenAddModal(false)} disabled={addSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={addSubmitting || availableStudents.length === 0}
              startIcon={addSubmitting ? <CircularProgress size={16} color="inherit" /> : null}
              sx={{ fontWeight: 700, borderRadius: 2 }}
            >
              {addSubmitting ? "Adding..." : "Add Member"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Remove Member Confirmation */}
      <ConfirmDialog
        open={Boolean(removeMemberId)}
        title="Remove Member?"
        description="Are you sure you want to remove this student from the team roster?"
        confirmText="Remove Member"
        confirmColor="error"
        loading={removeSubmitting}
        onConfirm={handleRemoveMemberConfirm}
        onClose={() => setRemoveMemberId(null)}
      />
    </>
  );
}
