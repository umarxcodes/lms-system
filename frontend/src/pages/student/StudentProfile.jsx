import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  TextField,
  Box,
  CircularProgress,
  Divider,
  Grid,
  Paper,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { useOutletContext } from "react-router-dom";

import PageHeader from "../../components/common/PageHeader";
import { PageContent } from "../../components/layout/AppLayout";
import CloudinaryAvatarUpload from "../../components/common/CloudinaryAvatarUpload";
import { studentApi } from "../../services/studentApi";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

export default function StudentProfile() {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();
  const { onMobileNavOpen } = useOutletContext() || {};

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
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
      setLoading(false);
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
        title="Student Profile & Settings"
        description="View your bootcamp enrollment credentials and update your personal details."
      />
      <Grid container spacing={3.5} sx={{ maxWidth: 1000 }}>
        {/* Left Column: Avatar Card */}
        <Grid item xs={12} md={5}>
          <Paper
            elevation={0}
            sx={{
              p: 3.5,
              borderRadius: 3.5,
              border: "1px solid #e2e8f0",
              bgcolor: "#ffffff",
              boxShadow: "0 4px 16px rgba(0,0,0,0.02)",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2.5, color: "#0f172a" }}>
              Profile Photo
            </Typography>
            <CloudinaryAvatarUpload
              currentAvatarUrl={user?.avatarUrl || user?.profileImage}
              userName={user?.name}
              onUpload={handleAvatarUpload}
              onDelete={handleAvatarDelete}
              size={104}
            />
          </Paper>
        </Grid>

        {/* Right Column: Editable Details Form */}
        <Grid item xs={12} md={7}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, sm: 4 },
              borderRadius: 3.5,
              border: "1px solid #e2e8f0",
              bgcolor: "#ffffff",
              boxShadow: "0 4px 16px rgba(0,0,0,0.02)",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 3, color: "#0f172a" }}>
              Personal & Academic Details
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={2.5}>
                <TextField label="Full Name" fullWidth disabled value={user?.name || ""} />

                <TextField label="Registered Email" fullWidth disabled value={user?.email || ""} />

                <Stack direction="row" spacing={2}>
                  <TextField label="Roll Number" fullWidth disabled value={student?.rollNumber || "N/A"} />
                  <TextField label="Enrolled Batch" fullWidth disabled value={student?.batch || "Batch 1"} />
                </Stack>

                <TextField
                  label="Phone Number"
                  fullWidth
                  placeholder="+92 300 1234567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />

                <TextField
                  label="Residential Address"
                  fullWidth
                  multiline
                  rows={2.5}
                  placeholder="Enter your home address..."
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={submitting}
                  startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
                  sx={{ py: 1.2, fontWeight: 700, borderRadius: 2.5, width: "fit-content" }}
                >
                  {submitting ? "Saving Updates..." : "Save Profile Changes"}
                </Button>
              </Stack>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </PageContent>
  );
}
