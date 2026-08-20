import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Card,
  Typography,
  Stack,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  CircularProgress,
  IconButton,
  Tooltip,
  Avatar,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SchoolIcon from "@mui/icons-material/School";
import GroupsIcon from "@mui/icons-material/Groups";
import VerifiedIcon from "@mui/icons-material/Verified";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";

import PageHeader from "../../components/common/PageHeader";
import { PageContent } from "../../components/layout/AppLayout";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import EmptyState from "../../components/common/EmptyState";
import FilterBar from "../../components/common/FilterBar";
import StatCard from "../../components/common/StatCard";
import StatusBadge from "../../components/common/StatusBadge";
import ActionButton from "../../components/common/ActionButton";
import { studentApi } from "../../services/studentApi";
import { useToast } from "../../context/ToastContext";

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [batchFilter] = useState("ALL");
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
        if (setTotalCount) setTotalCount(res.data.total || items.length);
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
                bgcolor: "#2563EB",
                fontWeight: 700,
                fontSize: "0.95rem",
              }}
            >
              {name.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ overflow: "hidden" }}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, color: "#111827", lineHeight: 1.3, textOverflow: "ellipsis", overflow: "hidden", whitespace: "nowrap" }}
              >
                {name}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "#64748B", display: "block", textOverflow: "ellipsis", overflow: "hidden", whitespace: "nowrap" }}
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
        <Typography variant="body2" sx={{ fontWeight: 600, color: "#334155", fontFamily: "monospace" }}>
          {params.value || "N/A"}
        </Typography>
      ),
    },
    {
      field: "batch",
      headerName: "Batch",
      flex: 0.9,
      minWidth: 110,
      renderCell: (params) => <StatusBadge status="active" label={params.value || "Batch 1"} />,
    },
    {
      field: "team",
      headerName: "Assigned Team",
      flex: 1.2,
      minWidth: 150,
      renderCell: (params) => {
        const teamName = params.row.team?.name || params.row.teamId?.name;
        return teamName ? (
          <StatusBadge status="in_progress" label={teamName} icon={GroupsIcon} />
        ) : (
          <StatusBadge status="pending" label="Unassigned" />
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
        <Stack direction="row" spacing={1} justifyContent="flex-end" alignItems="center" sx={{ height: "100%", py: 1 }}>
          <Tooltip title="View Profile">
            <IconButton
              size="small"
              sx={{
                width: 32,
                height: 32,
                minWidth: 32,
                minHeight: 32,
                borderRadius: "50%",
                color: "#2563EB",
                bgcolor: "#EFF6FF",
                border: "1px solid #DBEAFE",
                p: 0,
                flexShrink: 0,
                transition: "all 0.18s ease-in-out",
                "&:hover": {
                  bgcolor: "#2563EB",
                  color: "#FFFFFF",
                  borderColor: "#2563EB",
                  transform: "scale(1.08)",
                },
              }}
              onClick={() => navigate(`/admin/students/${params.row._id || params.row.id}`)}
            >
              <VisibilityIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit Profile">
            <IconButton
              size="small"
              sx={{
                width: 32,
                height: 32,
                minWidth: 32,
                minHeight: 32,
                borderRadius: "50%",
                color: "#0284C7",
                bgcolor: "#F0F9FF",
                border: "1px solid #E0F2FE",
                p: 0,
                flexShrink: 0,
                transition: "all 0.18s ease-in-out",
                "&:hover": {
                  bgcolor: "#0284C7",
                  color: "#FFFFFF",
                  borderColor: "#0284C7",
                  transform: "scale(1.08)",
                },
              }}
              onClick={() => handleOpenEdit(params.row)}
            >
              <EditIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Account">
            <IconButton
              size="small"
              sx={{
                width: 32,
                height: 32,
                minWidth: 32,
                minHeight: 32,
                borderRadius: "50%",
                color: "#DC2626",
                bgcolor: "#FEF2F2",
                border: "1px solid #FEE2E2",
                p: 0,
                flexShrink: 0,
                transition: "all 0.18s ease-in-out",
                "&:hover": {
                  bgcolor: "#DC2626",
                  color: "#FFFFFF",
                  borderColor: "#DC2626",
                  transform: "scale(1.08)",
                },
              }}
              onClick={() => setDeleteId(params.row._id || params.row.id)}
            >
              <DeleteIcon sx={{ fontSize: 16 }} />
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
          title="Student Directory & Enrollment"
          description="View, register, search, and manage bootcamp student accounts and team assignments."
          actions={
            <ActionButton variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpenCreate}>
              Add New Student
            </ActionButton>
          }
        />

        {/* Top Summary Metrics using StatCard Primitive */}
        <Grid container spacing={2.5} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <StatCard
              title="TOTAL ENROLLED STUDENTS"
              value={totalStudents}
              subtitle="Registered bootcamp trainees"
              icon={SchoolIcon}
              iconBgColor="#EFF6FF"
              iconColor="#2563EB"
              accentColor="#2563EB"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <StatCard
              title="TEAM ASSIGNMENT RATE"
              value={`${assignmentPercentage}%`}
              subtitle={`${assignedCount} of ${totalStudents} in teams`}
              icon={GroupsIcon}
              iconBgColor="#ECFDF5"
              iconColor="#16A34A"
              progress={assignmentPercentage}
              accentColor="#16A34A"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <StatCard
              title="ACTIVE BOOTCAMP BATCH"
              value="Batch 1"
              subtitle="Web & App Development"
              icon={VerifiedIcon}
              iconBgColor="#F3E8FF"
              iconColor="#7C3AED"
              accentColor="#7C3AED"
            />
          </Grid>
        </Grid>

        {/* Filter Toolbar */}
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search by student name, email, roll number..."
          filters={[
            {
              key: "teamState",
              label: "Team Status",
              value: teamFilter,
              onChange: setTeamFilter,
              options: [
                { value: "ALL", label: "All Team States" },
                { value: "ASSIGNED", label: "Assigned Only" },
                { value: "UNASSIGNED", label: "Unassigned Only" },
              ],
            },
          ]}
          onReset={() => {
            setSearch("");
            setTeamFilter("ALL");
          }}
        />

        {/* Data Table Container */}
        <Card
          elevation={0}
          sx={{
            borderRadius: "12px",
            border: "1px solid #E2E8F0",
            bgcolor: "#FFFFFF",
            overflow: "hidden",
          }}
        >
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
                    borderBottom: "1px solid #F1F5F9",
                    display: "flex",
                    alignItems: "center",
                  },
                  "& .MuiDataGrid-columnHeaders": {
                    bgcolor: "#F8FAFC",
                    borderBottom: "1px solid #E2E8F0",
                    fontWeight: 600,
                    color: "#475569",
                  },
                  "& .MuiDataGrid-row:hover": {
                    bgcolor: "#F8FAFC",
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
            sx: { borderRadius: "12px", p: 1 },
          }}
        >
          <DialogTitle sx={{ fontWeight: 700, pb: 1, color: "#111827" }}>
            {editingStudent ? "Edit Student Account" : "Register New Student"}
          </DialogTitle>
          <Box component="form" onSubmit={handleFormSubmit}>
            <DialogContent>
              <Grid container spacing={2.5}>
                <Grid size={12}>
                  <TextField
                    label="Full Name"
                    required
                    fullWidth
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
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
                  <Grid size={{ xs: 12, sm: 6 }}>
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
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Roll Number"
                    required
                    fullWidth
                    disabled={Boolean(editingStudent)}
                    value={formData.rollNumber}
                    onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Batch"
                    required
                    fullWidth
                    value={formData.batch}
                    onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Phone Number"
                    fullWidth
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </Grid>
                <Grid size={12}>
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
              <ActionButton onClick={() => setOpenFormModal(false)} disabled={formSubmitting} variant="outlined" color="inherit">
                Cancel
              </ActionButton>
              <ActionButton
                type="submit"
                variant="contained"
                color="primary"
                disabled={formSubmitting}
                startIcon={formSubmitting ? <CircularProgress size={16} color="inherit" /> : null}
              >
                {formSubmitting ? "Saving..." : editingStudent ? "Update Profile" : "Register Student"}
              </ActionButton>
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

