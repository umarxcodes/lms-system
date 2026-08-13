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
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
  Grid,
  Divider,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import SecurityIcon from "@mui/icons-material/Security";
import { useOutletContext } from "react-router-dom";

import PageHeader from "../../components/common/PageHeader";
import { PageContent } from "../../components/layout/AppLayout";
import CloudinaryAvatarUpload from "../../components/common/CloudinaryAvatarUpload";
import { settingsApi } from "../../services/settingsApi";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

export default function AdminSettings() {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();
  const { onMobileNavOpen } = useOutletContext() || {};

  const [activeTab, setActiveTab] = useState(0);

  // Profile Form
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    bio: user?.bio || "",
  });
  const [profileSubmitting, setProfileSubmitting] = useState(false);

  // Password Form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);

  // Application Settings Form
  const [appSettings, setAppSettings] = useState({
    appName: "Bootcamp LMS",
    allowStudentRegistration: true,
    maintenanceMode: false,
    defaultBatch: "Batch 1",
  });
  const [appSubmitting, setAppSubmitting] = useState(false);

  // Fetch initial profile & app settings
  useEffect(() => {
    settingsApi.getAdminProfile().then((res) => {
      if (res.success && res.data) {
        setProfileData({
          name: res.data.name || "",
          phone: res.data.phone || "",
          bio: res.data.bio || "",
        });
      }
    });

    settingsApi.getApplicationSettings().then((res) => {
      if (res.success && res.data) {
        setAppSettings({
          appName: res.data.appName || "Bootcamp LMS",
          allowStudentRegistration: res.data.allowStudentRegistration ?? true,
          maintenanceMode: res.data.maintenanceMode ?? false,
          defaultBatch: res.data.defaultBatch || "Batch 1",
        });
      }
    });
  }, []);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileSubmitting(true);
    try {
      const res = await settingsApi.updateAdminProfile(profileData);
      if (res.success) {
        showToast("Profile updated successfully!", "success");
        updateUser({ name: profileData.name });
      }
    } catch (err) {
      showToast(err?.message || "Failed to update profile", "error");
    } finally {
      setProfileSubmitting(false);
    }
  };

  const handleAvatarUpload = async (formData) => {
    const res = await settingsApi.uploadAdminAvatar(formData);
    if (res.success && res.data?.avatarUrl) {
      updateUser({ avatarUrl: res.data.avatarUrl });
      showToast("Avatar image uploaded to Cloudinary!", "success");
    }
  };

  const handleAvatarDelete = async () => {
    const res = await settingsApi.deleteAdminAvatar();
    if (res.success) {
      updateUser({ avatarUrl: "" });
      showToast("Avatar image removed!", "info");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;
    setPasswordSubmitting(true);
    try {
      await settingsApi.changePassword(currentPassword, newPassword);
      showToast("Password updated successfully!", "success");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      showToast(err?.message || "Failed to change password", "error");
    } finally {
      setPasswordSubmitting(false);
    }
  };

  const handleAppSubmit = async (e) => {
    e.preventDefault();
    setAppSubmitting(true);
    try {
      await settingsApi.updateApplicationSettings(appSettings);
      showToast("System settings updated!", "success");
    } catch (err) {
      showToast(err?.message || "Failed to update settings", "error");
    } finally {
      setAppSubmitting(false);
    }
  };

  return (
    <PageContent>
      <PageHeader
        title="Admin Settings"
        description="Manage your personal profile, Cloudinary avatar, security, and global system configuration."
      />
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={activeTab} onChange={(e, val) => setActiveTab(val)}>
            <Tab icon={<PersonIcon fontSize="small" />} iconPosition="start" label="Profile" />
            <Tab icon={<LockIcon fontSize="small" />} iconPosition="start" label="Security & Password" />
            <Tab icon={<SettingsApplicationsIcon fontSize="small" />} iconPosition="start" label="System Settings" />
          </Tabs>
        </Box>

        {/* Tab 0: Profile & Cloudinary Avatar */}
        {activeTab === 0 && (
          <Card sx={{ maxWidth: 640 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Admin Profile
              </Typography>

              <CloudinaryAvatarUpload
                currentAvatarUrl={user?.avatarUrl || user?.profileImage}
                userName={user?.name}
                onUpload={handleAvatarUpload}
                onDelete={handleAvatarDelete}
              />

              <Divider sx={{ my: 3 }} />

              <Box component="form" onSubmit={handleProfileSubmit}>
                <Stack spacing={2.5}>
                  <TextField
                    label="Full Name"
                    fullWidth
                    required
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  />

                  <TextField label="Email Address" fullWidth disabled value={user?.email || ""} />

                  <TextField
                    label="Phone Number"
                    fullWidth
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  />

                  <TextField
                    label="Bio"
                    fullWidth
                    multiline
                    rows={3}
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    disabled={profileSubmitting}
                    startIcon={profileSubmitting ? <CircularProgress size={16} color="inherit" /> : null}
                  >
                    {profileSubmitting ? "Saving..." : "Save Profile"}
                  </Button>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Tab 1: Password Change */}
        {activeTab === 1 && (
          <Card sx={{ maxWidth: 500 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Change Password
              </Typography>

              <Box component="form" onSubmit={handlePasswordSubmit}>
                <Stack spacing={2.5}>
                  <TextField
                    label="Current Password"
                    type="password"
                    fullWidth
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />

                  <TextField
                    label="New Password"
                    type="password"
                    fullWidth
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    disabled={passwordSubmitting}
                    startIcon={passwordSubmitting ? <CircularProgress size={16} color="inherit" /> : null}
                  >
                    {passwordSubmitting ? "Updating..." : "Update Password"}
                  </Button>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Tab 2: System Settings */}
        {activeTab === 2 && (
          <Card sx={{ maxWidth: 640 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                System Configuration
              </Typography>

              <Box component="form" onSubmit={handleAppSubmit}>
                <Stack spacing={2.5}>
                  <TextField
                    label="Application Name"
                    fullWidth
                    value={appSettings.appName}
                    onChange={(e) => setAppSettings({ ...appSettings, appName: e.target.value })}
                  />

                  <TextField
                    label="Default Batch Name"
                    fullWidth
                    value={appSettings.defaultBatch}
                    onChange={(e) => setAppSettings({ ...appSettings, defaultBatch: e.target.value })}
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={appSettings.allowStudentRegistration}
                        onChange={(e) =>
                          setAppSettings({ ...appSettings, allowStudentRegistration: e.target.checked })
                        }
                      />
                    }
                    label="Allow Public Student Self-Registration"
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={appSettings.maintenanceMode}
                        onChange={(e) => setAppSettings({ ...appSettings, maintenanceMode: e.target.checked })}
                      />
                    }
                    label="Enable System Maintenance Mode"
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    disabled={appSubmitting}
                    startIcon={appSubmitting ? <CircularProgress size={16} color="inherit" /> : null}
                  >
                    {appSubmitting ? "Saving..." : "Save System Settings"}
                  </Button>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        )}
      </PageContent>
  );
}
