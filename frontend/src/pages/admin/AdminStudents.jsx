import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  CircularProgress,
  IconButton,
  Tooltip,
  Chip,
  Avatar,
  Paper,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SchoolIcon from "@mui/icons-material/School";
import GroupsIcon from "@mui/icons-material/Groups";
import VerifiedIcon from "@mui/icons-material/Verified";
import FilterListIcon from "@mui/icons-material/FilterList";
import ClearIcon from "@mui/icons-material/Clear";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate, useOutletContext } from "react-router-dom";

import PageHeader from "../../components/common/PageHeader";
import { PageContent } from "../../components/layout/AppLayout";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import EmptyState from "../../components/common/EmptyState";
import { studentApi } from "../../services/studentApi";
import { useToast } from "../../context/ToastContext";

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [batchFilter, setBatchFilter] = useState("ALL");
  const [teamFilter, setTeamFilter] = useState("ALL");
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [totalCount, setTotalCount] = useState(0);

  // Create/Edit Dialog State
  const [openFormModal, setOpenFormModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    rollNumber: "",
    batch: "Batch 1",
    phone: "",
    address: "",
  });

  // Delete Dialog State
  const [deleteId, setDeleteId] = useState(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  const { showToast } = useToast();
  const navigate = useNavigate();
  const { onMobileNavOpen } = useOutletContext() || {};

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
        search: search || undefined,
      };
      const res = await studentApi.getStudents(params);
      if (res.success && res.data) {
        const items = Array.isArray(res.data) ? res.data : res.data.students || [];
        setStudents(items);
        setTotalCount(res.data.total || items.length);
      }
    } catch (err) {
      showToast(err?.message || "Failed to load students", "error");
    } finally {
      setLoading(false);
    }
  }, [paginationModel, search, showToast]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleOpenCreate = () => {
    setEditingStudent(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      rollNumber: `STD-${Math.floor(1000 + Math.random() * 9000)}`,
      batch: "Batch 1",
      phone: "",
      address: "",
    });
    setOpenFormModal(true);
  };

  const handleOpenEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name || student.user?.name || "",
      email: student.email || student.user?.email || "",
      password: "",
      rollNumber: student.rollNumber || "",
      batch: student.batch || "Batch 1",
      phone: student.phone || "",
      address: student.address || "",
    });
    setOpenFormModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);

    try {
      if (editingStudent) {
        const updatePayload = {
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          batch: formData.batch,
        };
        await studentApi.updateStudent(editingStudent._id || editingStudent.id, updatePayload);
        showToast("Student profile updated successfully!", "success");
      } else {
        await studentApi.createStudent(formData);
        showToast("New student registered successfully!", "success");
      }
      setOpenFormModal(false);
      fetchStudents();
    } catch (err) {
      showToast(err?.message || "Failed to save student", "error");
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setDeleteSubmitting(true);
    try {
      await studentApi.deleteStudent(deleteId);
      showToast("Student record deleted successfully!", "success");
      setDeleteId(null);
      fetchStudents();
    } catch (err) {
      showToast(err?.message || "Failed to delete student", "error");
    } finally {
      setDeleteSubmitting(false);
    }
  };

  // Filter client-side if filters are active
  const filteredStudents = students.filter((s) => {
    const matchesBatch = batchFilter === "ALL" || (s.batch || "Batch 1") === batchFilter;
    const teamName = s.team?.name || s.teamId?.name;
    const matchesTeam =
      teamFilter === "ALL"
        ? true
        : teamFilter === "ASSIGNED"
        ? Boolean(teamName)
        : !teamName;
    return matchesBatch && matchesTeam;
  });

  // Calculate Metrics
  const totalStudents = students.length;
  const assignedCount = students.filter((s) => s.team?.name || s.teamId?.name).length;
  const assignmentPercentage = totalStudents ? Math.round((assignedCount / totalStudents) * 100) : 0;

  const columns = [
    {
      field: "student",
      headerName: "Student",
      flex: 1.6,
      minWidth: 240,
      renderCell: (params) => {
        const name = params.row.name || params.row.user?.name || "N/A";
        const email = params.row.email || params.row.user?.email || "N/A";
        const avatar = params.row.user?.avatarUrl || params.row.avatarUrl || "";

        return (
          <Stack direction="row" spacing={1.75} alignItems="center" sx={{ height: "100%", py: 1 }}>
            <Avatar
              src={avatar}
              alt={name}
              sx={{
                width: 38,
                height: 38,
                bgcolor: "primary.main",
                fontWeight: 700,
                fontSize: "0.95rem",
                boxShadow: "0 2px 4px rgba(0,0,0,0.06)",
              }}
            >
              {name.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ overflow: "hidden" }}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 700, color: "#0f172a", lineHeight: 1.3, textOverflow: "ellipsis", overflow: "hidden", whitespace: "nowrap" }}
              >
                {name}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "#64748b", display: "block", textOverflow: "ellipsis", overflow: "hidden", whitespace: "nowrap" }}
              >
                {email}
              </Typography>
            </Box>
          </Stack>
        );
      },
    },
    {
      field: "rollNumber",
      headerName: "Roll Number",
      flex: 1,
      minWidth: 130,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 700, color: "#334155", fontFamily: "monospace" }}>
          {params.value || "N/A"}
        </Typography>
      ),
    },
    {
      field: "batch",
      headerName: "Batch",
      flex: 0.9,
      minWidth: 110,
      renderCell: (params) => (
        <Chip
          label={params.value || "Batch 1"}
          size="small"
          sx={{
            bgcolor: "#f1f5f9",
            color: "#475569",
            fontWeight: 700,
            fontSize: "0.75rem",
            borderRadius: 1.5,
          }}
        />
      ),
    },
    {
      field: "team",
      headerName: "Assigned Team",
      flex: 1.2,
      minWidth: 150,
      renderCell: (params) => {
        const teamName = params.row.team?.name || params.row.teamId?.name;
        return teamName ? (
          <Chip
            label={teamName}
            size="small"
            icon={<GroupsIcon style={{ fontSize: 14, color: "#1e40af" }} />}
            sx={{
              bgcolor: "#eff6ff",
              color: "#1e40af",
              fontWeight: 700,
              fontSize: "0.78rem",
              borderRadius: 1.5,
              border: "1px solid #bfdbfe",
              px: 0.5,
            }}
          />
        ) : (
          <Chip
            label="Unassigned"
            size="small"
            sx={{
              bgcolor: "#fef2f2",
              color: "#991b1b",
              fontWeight: 600,
              fontSize: "0.75rem",
              borderRadius: 1.5,
              border: "1px dashed #fca5a5",
            }}
          />
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 140,
      sortable: false,
      align: "right",
      headerAlign: "right",
      renderCell: (params) => (
        <Stack direction="row" spacing={0.5} justifyContent="flex-end" alignItems="center" sx={{ height: "100%" }}>
          <Tooltip title="View Student Profile">
            <IconButton
              size="small"
              sx={{ color: "#3b82f6", bgcolor: "#eff6ff", "&:hover": { bgcolor: "#dbeafe" } }}
              onClick={() => navigate(`/admin/students/${params.row._id || params.row.id}`)}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit Student Profile">
            <IconButton
              size="small"
              sx={{ color: "#0284c7", bgcolor: "#f0f9ff", "&:hover": { bgcolor: "#e0f2fe" } }}
              onClick={() => handleOpenEdit(params.row)}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Account">
            <IconButton
              size="small"
              sx={{ color: "#ef4444", bgcolor: "#fef2f2", "&:hover": { bgcolor: "#fee2e2" } }}
              onClick={() => setDeleteId(params.row._id || params.row.id)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <>
      <PageContent>
        <PageHeader
          title="Student Directory & Enrolment"
          description="View, register, search, and manage bootcamp student accounts and team assignments."
          actions={
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenCreate}
              sx={{ fontWeight: 700, py: 1, px: 2.5, borderRadius: 2.5 }}
            >
              Add New Student
            </Button>
          }
        />

        {/* Top Summary Metrics */}
        <Grid container spacing={2.5} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 3,
                border: "1px solid #e2e8f0",
                bgcolor: "#ffffff",
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2.5,
                  bgcolor: "#eff6ff",
                  color: "#1d4ed8",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <SchoolIcon />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>
                  Total Enrolled
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: "#0f172a" }}>
                  {totalStudents}
                </Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 3,
                border: "1px solid #e2e8f0",
                bgcolor: "#ffffff",
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2.5,
                  bgcolor: "#f0fdf4",
                  color: "#15803d",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <GroupsIcon />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>
                  Team Assignment
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: "#0f172a" }}>
                  {assignedCount} <Typography component="span" variant="caption" sx={{ color: "#16a34a", fontWeight: 700 }}>({assignmentPercentage}%)</Typography>
                </Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 3,
                border: "1px solid #e2e8f0",
                bgcolor: "#ffffff",
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2.5,
                  bgcolor: "#faf5ff",
                  color: "#7e22ce",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <VerifiedIcon />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>
                  Active Batches
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: "#0f172a" }}>
                  Batch 1
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Data Table Container */}
        <Card
          elevation={0}
          sx={{
            borderRadius: 3.5,
            border: "1px solid #e2e8f0",
            bgcolor: "#ffffff",
            overflow: "hidden",
          }}
        >
          <Box sx={{ p: 2.5, borderBottom: "1px solid #f1f5f9" }}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="space-between" alignItems="center">
              <TextField
                placeholder="Search by student name, email, roll number..."
                size="small"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{
                  width: { xs: "100%", sm: 380 },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2.5,
                    bgcolor: "#f8fafc",
                  },
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: search ? (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={() => setSearch("")}>
                          <ClearIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ) : null,
                  },
                }}
              />

              <Stack direction="row" spacing={1.5} width={{ xs: "100%", sm: "auto" }}>
                <FormControl size="small" sx={{ minWidth: 140 }}>
                  <Select
                    value={teamFilter}
                    onChange={(e) => setTeamFilter(e.target.value)}
                    displayEmpty
                    sx={{ borderRadius: 2.5, bgcolor: "#f8fafc", fontSize: "0.875rem" }}
                  >
                    <MenuItem value="ALL">All Team States</MenuItem>
                    <MenuItem value="ASSIGNED">Assigned Only</MenuItem>
                    <MenuItem value="UNASSIGNED">Unassigned Only</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </Stack>
          </Box>

          {filteredStudents.length === 0 && !loading ? (
            <Box sx={{ p: 4 }}>
              <EmptyState
                title="No student records found"
                description="No student profiles match your search criteria or filter selections."
                icon={PersonAddIcon}
                actionLabel="Add New Student"
                onAction={handleOpenCreate}
              />
            </Box>
          ) : (
            <Box sx={{ height: 540, width: "100%" }}>
              <DataGrid
                rows={filteredStudents}
                columns={columns}
                getRowId={(row) => row._id || row.id}
                loading={loading}
                rowHeight={64}
                pageSizeOptions={[10, 25, 50]}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                disableRowSelectionOnClick
                sx={{
                  border: "none",
                  "& .MuiDataGrid-cell": {
                    borderBottom: "1px solid #f1f5f9",
                    display: "flex",
                    alignItems: "center",
                  },
                  "& .MuiDataGrid-columnHeaders": {
                    bgcolor: "#f8fafc",
                    borderBottom: "1px solid #e2e8f0",
                    fontWeight: 700,
                    color: "#475569",
                  },
                  "& .MuiDataGrid-row:hover": {
                    bgcolor: "#f8fafc",
                  },
                }}
              />
            </Box>
          )}
        </Card>

        {/* Create / Edit Student Modal */}
        <Dialog
          open={openFormModal}
          onClose={() => !formSubmitting && setOpenFormModal(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 3.5, p: 1 },
          }}
        >
          <DialogTitle sx={{ fontWeight: 800, pb: 1, color: "#0f172a" }}>
            {editingStudent ? "Edit Student Account" : "Register New Student"}
          </DialogTitle>
          <Box component="form" onSubmit={handleFormSubmit}>
            <DialogContent>
              <Grid container spacing={2.5}>
                <Grid item xs={12}>
                  <TextField
                    label="Full Name"
                    required
                    fullWidth
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email Address"
                    type="email"
                    required
                    fullWidth
                    disabled={Boolean(editingStudent)}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </Grid>
                {!editingStudent && (
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Initial Password"
                      type="password"
                      required
                      fullWidth
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                  </Grid>
                )}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Roll Number"
                    required
                    fullWidth
                    disabled={Boolean(editingStudent)}
                    value={formData.rollNumber}
                    onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Batch"
                    required
                    fullWidth
                    value={formData.batch}
                    onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Phone Number"
                    fullWidth
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Address"
                    fullWidth
                    multiline
                    rows={2}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2.5 }}>
              <Button onClick={() => setOpenFormModal(false)} disabled={formSubmitting} color="inherit">
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={formSubmitting}
                startIcon={formSubmitting ? <CircularProgress size={16} color="inherit" /> : null}
              >
                {formSubmitting ? "Saving..." : editingStudent ? "Update Profile" : "Register Student"}
              </Button>
            </DialogActions>
          </Box>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          open={Boolean(deleteId)}
          title="Delete Student Record"
          description="Are you sure you want to permanently delete this student account? This action cannot be undone."
          confirmLabel="Delete Account"
          confirmColor="error"
          loading={deleteSubmitting}
          onConfirm={handleDeleteConfirm}
          onClose={() => setDeleteId(null)}
        />
      </PageContent>
    </>
  );
}
