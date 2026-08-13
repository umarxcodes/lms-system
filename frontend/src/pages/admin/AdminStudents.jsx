import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Card,
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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate, useOutletContext } from "react-router-dom";

import Header from "../../components/layout/Header";
import { PageContent } from "../../components/layout/AppLayout";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import EmptyState from "../../components/common/EmptyState";
import { studentApi } from "../../services/studentApi";
import { useToast } from "../../context/ToastContext";

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
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
        // Support array response or paginated object response
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
        showToast("Student updated successfully!", "success");
      } else {
        await studentApi.createStudent(formData);
        showToast("Student account created successfully!", "success");
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
      showToast("Student account deleted successfully!", "success");
      setDeleteId(null);
      fetchStudents();
    } catch (err) {
      showToast(err?.message || "Failed to delete student", "error");
    } finally {
      setDeleteSubmitting(false);
    }
  };

  const columns = [
    {
      field: "name",
      headerName: "Name",
      flex: 1.2,
      minWidth: 160,
      valueGetter: (value, row) => row.name || row.user?.name || "N/A",
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1.5,
      minWidth: 200,
      valueGetter: (value, row) => row.email || row.user?.email || "N/A",
    },
    {
      field: "rollNumber",
      headerName: "Roll Number",
      flex: 1,
      minWidth: 130,
    },
    {
      field: "batch",
      headerName: "Batch",
      flex: 0.9,
      minWidth: 110,
    },
    {
      field: "team",
      headerName: "Team",
      flex: 1,
      minWidth: 130,
      valueGetter: (value, row) => row.team?.name || row.teamId?.name || "Unassigned",
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 140,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={0.5}>
          <Tooltip title="View Profile">
            <IconButton
              size="small"
              color="primary"
              onClick={() => navigate(`/admin/students/${params.row._id || params.row.id}`)}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit Student">
            <IconButton size="small" color="info" onClick={() => handleOpenEdit(params.row)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Student">
            <IconButton
              size="small"
              color="error"
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
      <Header
        title="Student Management"
        subtitle="Manage bootcamp student accounts, batch allocations, profiles, and teams."
        onMobileNavOpen={onMobileNavOpen}
        actions={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCreate}
            sx={{ fontWeight: 600 }}
          >
            Create Student
          </Button>
        }
      />

      <PageContent>
        <Card sx={{ p: 3 }}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 3 }} justifyContent="space-between">
            <TextField
              placeholder="Search students by name, email, or roll #..."
              size="small"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ width: { xs: "100%", sm: 360 } }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Stack>

          {students.length === 0 && !loading ? (
            <EmptyState
              title="No students found"
              description="Get started by creating a new student account for the bootcamp."
              icon={PersonAddIcon}
              actionLabel="Create Student"
              onAction={handleOpenCreate}
            />
          ) : (
            <Box sx={{ height: 500, width: "100%" }}>
              <DataGrid
                rows={students}
                columns={columns}
                getRowId={(row) => row._id || row.id}
                loading={loading}
                rowCount={totalCount}
                paginationMode="server"
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                pageSizeOptions={[5, 10, 25]}
                disableRowSelectionOnClick
                sx={{
                  border: "none",
                  "& .MuiDataGrid-columnHeaders": {
                    bgcolor: "grey.50",
                    fontWeight: 700,
                  },
                }}
              />
            </Box>
          )}
        </Card>
      </PageContent>

      {/* Create / Edit Student Dialog */}
      <Dialog open={openFormModal} onClose={() => setOpenFormModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {editingStudent ? "Edit Student Profile" : "Create New Student Account"}
        </DialogTitle>
        <Box component="form" onSubmit={handleFormSubmit}>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Full Name"
                  fullWidth
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email Address"
                  type="email"
                  fullWidth
                  required
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
                    fullWidth
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </Grid>
              )}

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Roll Number"
                  fullWidth
                  required
                  value={formData.rollNumber}
                  onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Batch Name"
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
                  label="Residential Address"
                  fullWidth
                  multiline
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setOpenFormModal(false)} disabled={formSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={formSubmitting}
              startIcon={formSubmitting ? <CircularProgress size={16} color="inherit" /> : null}
            >
              {formSubmitting ? "Saving..." : editingStudent ? "Update Student" : "Create Account"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete Student Account"
        description="Are you sure you want to permanently remove this student account? This action cannot be undone."
        loading={deleteSubmitting}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteId(null)}
      />
    </>
  );
}
