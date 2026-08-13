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
} from "@mui/material";
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
      showToast("Profile image uploaded successfully to Cloudinary!", "success");
    }
  };

  const handleAvatarDelete = async () => {
    const res = await studentApi.deleteAvatar();
    if (res.success) {
      updateUser({ avatarUrl: "" });
      showToast("Profile image removed!", "info");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (student?._id || student?.id) {
        await studentApi.updateStudent(student._id || student.id, formData);
        showToast("Profile information updated!", "success");
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
        title="Student Profile"
        description="Manage your profile information and Cloudinary profile photo."
      />
        <Card sx={{ maxWidth: 640 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              My Profile & Avatar
            </Typography>

            <CloudinaryAvatarUpload
              currentAvatarUrl={user?.avatarUrl || user?.profileImage}
              userName={user?.name}
              onUpload={handleAvatarUpload}
              onDelete={handleAvatarDelete}
            />

            <Divider sx={{ my: 3 }} />

            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={2.5}>
                <TextField label="Full Name" fullWidth disabled value={user?.name || ""} />

                <TextField label="Email Address" fullWidth disabled value={user?.email || ""} />

                <Stack direction="row" spacing={2}>
                  <TextField label="Roll Number" fullWidth disabled value={student?.rollNumber || "N/A"} />
                  <TextField label="Batch" fullWidth disabled value={student?.batch || "Batch 1"} />
                </Stack>

                <TextField
                  label="Phone Number"
                  fullWidth
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />

                <TextField
                  label="Residential Address"
                  fullWidth
                  multiline
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />

                <Button
                  type="submit"
                  variant="contained"
                  disabled={submitting}
                  startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : null}
                >
                  {submitting ? "Saving..." : "Update Profile"}
                </Button>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </PageContent>
  );
}
