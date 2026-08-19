import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  Typography,
  Stack,
  TextField,
  Box,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

import PageHeader from "../../components/common/PageHeader";
import { PageContent } from "../../components/layout/AppLayout";
import CloudinaryAvatarUpload from "../../components/common/CloudinaryAvatarUpload";
import ActionButton from "../../components/common/ActionButton";
import StatusBadge from "../../components/common/StatusBadge";
import { studentApi } from "../../services/studentApi";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

export default function StudentProfile() {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();

  const [student, setStudent] = useState(null);
  const [formData, setFormData] = useState({
    phone: "",
    address: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    studentApi.getMyProfile().then((res) => {
      if (res.success && res.data) {
        setStudent(res.data);
        setFormData({
          phone: res.data.phone || "",
          address: res.data.address || "",
        });
      }
    });
  }, []);

  const handleAvatarUpload = async (formData) => {
    const res = await studentApi.uploadAvatar(formData);
    if (res.success && res.data?.avatarUrl) {
      updateUser({ avatarUrl: res.data.avatarUrl });
      showToast("Profile photo updated successfully!", "success");
    }
  };

  const handleAvatarDelete = async () => {
    const res = await studentApi.deleteAvatar();
    if (res.success) {
      updateUser({ avatarUrl: "" });
      showToast("Profile photo removed!", "info");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (student?._id || student?.id) {
        await studentApi.updateStudent(student._id || student.id, formData);
        showToast("Profile information updated successfully!", "success");
      }
    } catch (err) {
      showToast(err?.message || "Failed to update profile", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageContent>
      <PageHeader
        title="Student Profile & Enrollment Credentials"
        description="View your bootcamp student credentials and manage your contact details."
      />
      <Grid container spacing={3}>
        {/* Left Column: Avatar & Quick Info Card */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            elevation={0}
            sx={{
              p: 3.5,
              borderRadius: "12px",
              border: "1px solid #E2E8F0",
              bgcolor: "#FFFFFF",
              textAlign: "center",
            }}
          >
            <Typography variant="h3" sx={{ fontWeight: 600, color: "#111827", mb: 2 }}>
              Profile Photo
            </Typography>
            <CloudinaryAvatarUpload
              currentAvatarUrl={user?.avatarUrl || user?.profileImage}
              userName={user?.name}
              onUpload={handleAvatarUpload}
              onDelete={handleAvatarDelete}
              size={104}
            />

            <Box sx={{ mt: 3, pt: 2, borderTop: "1px solid #E2E8F0", textAlign: "left" }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>
                Enrollment Status
              </Typography>
              <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
                <StatusBadge status="active" label="Enrolled Student" />
                <StatusBadge status="completed" label="Batch 1" />
              </Box>
            </Box>
          </Card>
        </Grid>

        {/* Right Column: Editable Personal Details */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card
            elevation={0}
            sx={{
              p: 3.5,
              borderRadius: "12px",
              border: "1px solid #E2E8F0",
              bgcolor: "#FFFFFF",
            }}
          >
            <Typography variant="h3" sx={{ fontWeight: 600, color: "#111827", mb: 3 }}>
              Personal & Contact Information
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={2.5}>
                <TextField label="Full Name" fullWidth disabled value={user?.name || "Ali Khan"} />

                <TextField label="Registered Email" fullWidth disabled value={user?.email || "ali.khan@saylani.org"} />

                <Stack direction="row" spacing={2}>
                  <TextField label="Roll Number" fullWidth disabled value={student?.rollNumber || "SMIT-2026-0941"} />
                  <TextField label="Enrolled Course" fullWidth disabled value="Web & App Development" />
                </Stack>

                <TextField
                  label="Phone Number"
                  fullWidth
                  placeholder="+92 300 1234567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                />

                <TextField
                  label="Residential Address"
                  fullWidth
                  multiline
                  rows={2.5}
                  placeholder="Enter your address..."
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                />

                <ActionButton
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={submitting}
                  startIcon={<SaveIcon />}
                  sx={{ width: "fit-content", mt: 1 }}
                >
                  {submitting ? "Saving..." : "Save Profile Changes"}
                </ActionButton>
              </Stack>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </PageContent>
  );
}

