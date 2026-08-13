import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Card,
  CardContent,
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
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import DeleteIcon from "@mui/icons-material/Delete";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";

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
  const { onMobileNavOpen } = useOutletContext() || {};

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
        // Filter out students already in team
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

  return (
    <>
      <PageContent>
      <PageHeader
        title={`Team: ${team?.name || "Team Detail"}`}
        description={team?.description || "Manage team roster, members, and project assignments."}
        actions={
          <Stack direction="row" spacing={1}>
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/admin/teams")}>
              Back to Teams
            </Button>
            <Button variant="contained" startIcon={<PersonAddIcon />} onClick={handleOpenAddModal}>
              Add Member
            </Button>
          </Stack>
        }
      />
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Team Members ({members.length})
              </Typography>

              {loading ? (
                <Box sx={{ py: 4, textAlign: "center" }}>
                  <CircularProgress size={32} color="primary" />
                </Box>
              ) : members.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: "center" }}>
                  No students assigned to this team yet.
                </Typography>
              ) : (
                <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
                  <Table size="small">
                    <TableHead sx={{ bgcolor: "grey.50" }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700 }}>Student</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Roll #</TableCell>
                        <TableCell sx={{ fontWeight: 700 }} align="right">
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
                                <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main", fontSize: 14 }}>
                                  {name.charAt(0)}
                                </Avatar>
                                <Typography variant="body2" fontWeight={600}>
                                  {name}
                                </Typography>
                              </Stack>
                            </TableCell>
                            <TableCell>{email}</TableCell>
                            <TableCell>{roll}</TableCell>
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
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
                Assigned Project
              </Typography>
              {team?.project ? (
                <Box>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                    <FolderOpenIcon color="primary" />
                    <Typography variant="subtitle1" fontWeight={700}>
                      {team.project.name || team.project.title}
                    </Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    {team.project.description || "Project in progress."}
                  </Typography>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No project assigned to this team yet.
                </Typography>
              )}
            </Card>
          </Grid>
        </Grid>
      </PageContent>

      {/* Add Member Dialog */}
      <Dialog open={openAddModal} onClose={() => setOpenAddModal(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Add Student to Team</DialogTitle>
        <Box component="form" onSubmit={handleAddMemberSubmit}>
          <DialogContent dividers>
            {availableStudents.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No unassigned students available. All active students are already assigned to teams.
              </Typography>
            ) : (
              <TextField
                label="Select Student"
                select
                fullWidth
                required
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
              >
                {availableStudents.map((s) => (
                  <MenuItem key={s._id || s.id} value={s._id || s.id}>
                    {s.name || s.user?.name} ({s.rollNumber || "No Roll #"})
                  </MenuItem>
                ))}
              </TextField>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setOpenAddModal(false)} disabled={addSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={addSubmitting || availableStudents.length === 0}
              startIcon={addSubmitting ? <CircularProgress size={16} color="inherit" /> : null}
            >
              {addSubmitting ? "Adding..." : "Add Member"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Remove Member Confirmation */}
      <ConfirmDialog
        open={Boolean(removeMemberId)}
        title="Remove Member"
        description="Are you sure you want to remove this student from the team?"
        loading={removeSubmitting}
        onConfirm={handleRemoveMemberConfirm}
        onClose={() => setRemoveMemberId(null)}
      />
    </>
  );
}
