import React, { useState, useEffect } from "react";
import { Stack, Box } from "@mui/material";

import PageHeader from "../../components/common/PageHeader";
import { PageContent } from "../../components/layout/AppLayout";
import { settingsApi } from "../../services/settingsApi";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

import SettingsNavigation from "../../components/settings/SettingsNavigation";
import ProfileSettings from "../../components/settings/ProfileSettings";
import SecuritySettings from "../../components/settings/SecuritySettings";
import NotificationSettings from "../../components/settings/NotificationSettings";
import PreferenceSettings from "../../components/settings/PreferenceSettings";
import ApplicationSettings from "../../components/settings/ApplicationSettings";

export default function AdminSettings() {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();

  const [activeSection, setActiveSection] = useState("profile");

  // Loading States
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [notifLoading, setNotifLoading] = useState(false);
  const [appLoading, setAppLoading] = useState(false);

  // Settings Data States
  const [appSettings, setAppSettings] = useState(null);
  const [notifPrefs, setNotifPrefs] = useState(null);

  // Fetch initial profile & app settings
  useEffect(() => {
    settingsApi
      .getAdminProfile()
      .then((res) => {
        if (res.success && res.data) {
          updateUser({
            name: res.data.name || user?.name,
            phone: res.data.phone || user?.phone,
            bio: res.data.bio || user?.bio,
          });
        }
      })
      .catch(() => {});

    settingsApi
      .getApplicationSettings()
      .then((res) => {
        if (res.success && res.data) {
          setAppSettings(res.data);
        }
      })
      .catch(() => {});

    settingsApi
      .getNotificationPreferences()
      .then((res) => {
        if (res.success && res.data) {
          setNotifPrefs(res.data);
        }
      })
      .catch(() => {});
  }, []);

  // Handlers
  const handleSaveProfile = async (formData) => {
    setProfileLoading(true);
    try {
      const res = await settingsApi.updateAdminProfile(formData);
      if (res.success) {
        showToast("Profile settings updated successfully!", "success");
        updateUser({ name: formData.name, phone: formData.phone, bio: formData.bio });
      }
    } catch (err) {
      showToast(err?.message || "Failed to update profile settings", "error");
    } finally {
      setProfileLoading(false);
    }
  };

  const handleUploadAvatar = async (formData) => {
    try {
      const res = await settingsApi.uploadAdminAvatar(formData);
      if (res.success && res.data?.avatarUrl) {
        updateUser({ avatarUrl: res.data.avatarUrl });
        showToast("Profile picture updated successfully!", "success");
      }
    } catch (err) {
      showToast(err?.message || "Failed to upload profile picture", "error");
    }
  };

  const handleDeleteAvatar = async () => {
    try {
      const res = await settingsApi.deleteAdminAvatar();
      if (res.success) {
        updateUser({ avatarUrl: "" });
        showToast("Profile picture removed", "info");
      }
    } catch (err) {
      showToast(err?.message || "Failed to remove profile picture", "error");
    }
  };

  const handleUpdatePassword = async (currentPassword, newPassword, onSuccess) => {
    setPasswordLoading(true);
    try {
      await settingsApi.changePassword(currentPassword, newPassword);
      showToast("Password updated successfully!", "success");
      if (onSuccess) onSuccess();
    } catch (err) {
      showToast(err?.message || "Failed to change password", "error");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleSaveNotificationPreferences = async (data) => {
    setNotifLoading(true);
    try {
      const res = await settingsApi.updateNotificationPreferences(data);
      if (res.success) {
        setNotifPrefs(data);
        showToast("Notification preferences updated!", "success");
      }
    } catch (err) {
      showToast(err?.message || "Failed to update notification preferences", "error");
    } finally {
      setNotifLoading(false);
    }
  };

  const handleSaveAppSettings = async (data) => {
    setAppLoading(true);
    try {
      const res = await settingsApi.updateApplicationSettings(data);
      if (res.success) {
        setAppSettings(data);
        showToast("Application settings updated successfully!", "success");
      }
    } catch (err) {
      showToast(err?.message || "Failed to update application settings", "error");
    } finally {
      setAppLoading(false);
    }
  };

  const sections = [
    { id: "profile", label: "Profile Settings" },
    { id: "security", label: "Security & Password" },
    { id: "notifications", label: "Notification Preferences" },
    { id: "preferences", label: "Portal Preferences" },
    { id: "application", label: "Application Configuration" },
  ];

  return (
    <PageContent px={{ xs: 2, sm: 3, md: 4 }}>
      {/* Page Header */}
      <PageHeader
        breadcrumbs={[{ label: "Dashboard", to: "/admin/dashboard" }, { label: "Settings" }]}
        title="Settings & Preferences"
        description="Manage your personal account profile, security credentials, notification channels, and global portal configuration."
      />

      {/* Main Settings Two-Column Layout */}
      <Stack direction={{ xs: "column", md: "row" }} spacing={3} alignItems="flex-start" sx={{ width: "100%" }}>
        {/* Left Navigation */}
        <SettingsNavigation sections={sections} activeSection={activeSection} onSelectSection={setActiveSection} />

        {/* Right Settings Content Area */}
        <Box sx={{ flexGrow: 1, width: "100%" }}>
          {activeSection === "profile" && (
            <ProfileSettings
              user={user}
              onSaveProfile={handleSaveProfile}
              onUploadAvatar={handleUploadAvatar}
              onDeleteAvatar={handleDeleteAvatar}
              loading={profileLoading}
            />
          )}

          {activeSection === "security" && (
            <SecuritySettings onUpdatePassword={handleUpdatePassword} loading={passwordLoading} />
          )}

          {activeSection === "notifications" && (
            <NotificationSettings
              preferences={notifPrefs}
              onSavePreferences={handleSaveNotificationPreferences}
              loading={notifLoading}
            />
          )}

          {activeSection === "preferences" && <PreferenceSettings />}

          {activeSection === "application" && (
            <ApplicationSettings
              appSettings={appSettings}
              onSaveAppSettings={handleSaveAppSettings}
              loading={appLoading}
            />
          )}
        </Box>
      </Stack>
    </PageContent>
  );
}
