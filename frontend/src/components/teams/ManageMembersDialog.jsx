import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Typography,
  Box,
  Avatar,
  IconButton,
  Tooltip,
  TextField,
  MenuItem,
  CircularProgress,
  Divider,
  Paper,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonIcon from "@mui/icons-material/Person";

import { teamApi } from "../../services/teamApi";
import { studentApi } from "../../services/studentApi";
import { useToast } from "../../context/ToastContext";

export default function ManageMembersDialog({ open, onClose, team, onRosterUpdated }) {
  const [members, setMembers] = useState([]);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [addSubmitting, setAddSubmitting] = useState(false);
  const [removingMemberId, setRemovingMemberId] = useState(null);

  const { showToast } = useToast();
  const teamId = team?._id || team?.id;

  const fetchRosterData = useCallback(async () => {
    if (!teamId) return;
    try {
      setLoadingMembers(true);
      const [membersRes, studentsRes] = await Promise.all([
        teamApi.getTeamMembers(teamId),
        studentApi.getStudents({ limit: 100 }),
      ]);

      let currentMembers = [];
      if (membersRes.success) {
        currentMembers = Array.isArray(membersRes.data) ? membersRes.data : [];
        setMembers(currentMembers);
      }

      if (studentsRes.success && studentsRes.data) {
        const allStudents = Array.isArray(studentsRes.data)
          ? studentsRes.data
          : studentsRes.data.students || [];
        const memberIds = currentMembers.map((m) => m._id || m.id || m.user?._id);
        const unassigned = allStudents.filter((s) => !memberIds.includes(s._id || s.id));
        setAvailableStudents(unassigned);
        setSelectedStudentId(unassigned.length > 0 ? unassigned[0]._id || unassigned[0].id : "");
      }
    } catch (err) {
      showToast(err?.message || "Failed to load team roster data", "error");
    } finally {
      setLoadingMembers(false);
    }
  }, [teamId, showToast]);

  useEffect(() => {
    if (open && teamId) {
      fetchRosterData();
    }
  }, [open, teamId, fetchRosterData]);

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!selectedStudentId || !teamId) return;
    setAddSubmitting(true);
    try {
      await teamApi.addMember(teamId, selectedStudentId);
      showToast("Student added to team successfully!", "success");
      fetchRosterData();
      if (onRosterUpdated) onRosterUpdated();
    } catch (err) {
      showToast(err?.message || "Failed to add member to team", "error");
    } finally {
      setAddSubmitting(false);
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!teamId || !memberId) return;
    setRemovingMemberId(memberId);
    try {
      await teamApi.removeMember(teamId, memberId);
      showToast("Member removed from team successfully!", "success");
      fetchRosterData();
      if (onRosterUpdated) onRosterUpdated();
    } catch (err) {
      showToast(err?.message || "Failed to remove member", "error");
    } finally {
      setRemovingMemberId(null);
    }
  };

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
        Manage Team Members — {team?.name || "Team"}
      </DialogTitle>

      <DialogContent dividers sx={{ borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0", py: 3 }}>
        <Stack spacing={3}>
          {/* Add Student Section */}
          <Box component="form" onSubmit={handleAddMember}>
            <Typography variant="subtitle2" fontWeight={700} color="#0f172a" sx={{ mb: 1 }}>
              Add Student Trainee
            </Typography>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <TextField
                select
                size="small"
                fullWidth
                label="Select Available Student"
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                disabled={loadingMembers || availableStudents.length === 0 || addSubmitting}
                sx={{ flexGrow: 1, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              >
                {availableStudents.length === 0 ? (
                  <MenuItem value="" disabled>
                    No unassigned students available
                  </MenuItem>
                ) : (
                  availableStudents.map((s) => (
                    <MenuItem key={s._id || s.id} value={s._id || s.id}>
                      {s.name || s.user?.name} ({s.rollNumber || "No Roll #"})
                    </MenuItem>
                  ))
                )}
              </TextField>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loadingMembers || availableStudents.length === 0 || !selectedStudentId || addSubmitting}
                startIcon={addSubmitting ? <CircularProgress size={16} color="inherit" /> : <PersonAddIcon />}
                sx={{ fontWeight: 700, borderRadius: 2, whiteSpace: "nowrap", py: 1 }}
              >
                {addSubmitting ? "Adding..." : "Add Member"}
              </Button>
            </Stack>
          </Box>

          <Divider />

          {/* Current Roster List */}
          <Box>
            <Typography variant="subtitle2" fontWeight={700} color="#0f172a" sx={{ mb: 1.5 }}>
              Current Roster ({members.length} Trainees)
            </Typography>

            {loadingMembers ? (
              <Box sx={{ py: 3, textAlign: "center" }}>
                <CircularProgress size={24} color="primary" />
              </Box>
            ) : members.length === 0 ? (
              <Paper elevation={0} sx={{ p: 2.5, bgcolor: "#f8fafc", borderRadius: 2, border: "1px solid #e2e8f0", textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  No students currently assigned to this team.
                </Typography>
              </Paper>
            ) : (
              <Stack spacing={1} sx={{ maxHeight: 280, overflowY: "auto", pr: 0.5 }}>
                {members.map((m) => {
                  const mId = m._id || m.id;
                  const name = m.name || m.user?.name || "Student";
                  const email = m.email || m.user?.email || "N/A";
                  const isRemoving = removingMemberId === mId;

                  return (
                    <Paper
                      key={mId}
                      elevation={0}
                      sx={{
                        p: 1.5,
                        px: 2,
                        borderRadius: 2,
                        border: "1px solid #e2e8f0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        bgcolor: "#ffffff",
                      }}
                    >
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar sx={{ width: 34, height: 34, bgcolor: "#eff6ff", color: "#1e40af", fontWeight: 700, fontSize: "0.825rem" }}>
                          {name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={700} color="#0f172a">
                            {name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {email}
                          </Typography>
                        </Box>
                      </Stack>

                      <Tooltip title="Remove Member">
                        <IconButton
                          size="small"
                          color="error"
                          disabled={isRemoving}
                          onClick={() => handleRemoveMember(mId)}
                          sx={{ "&:hover": { bgcolor: "#fee2e2" } }}
                        >
                          {isRemoving ? <CircularProgress size={16} color="error" /> : <DeleteIcon fontSize="small" />}
                        </IconButton>
                      </Tooltip>
                    </Paper>
                  );
                })}
              </Stack>
            )}
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2.5, bgcolor: "#f8fafc" }}>
        <Button onClick={onClose} variant="contained" sx={{ fontWeight: 700, borderRadius: 2, px: 3 }}>
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
}
