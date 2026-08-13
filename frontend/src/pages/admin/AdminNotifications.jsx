import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  TextField,
  Box,
  CircularProgress,
} from "@mui/material";
import CampaignIcon from "@mui/icons-material/Campaign";
import SendIcon from "@mui/icons-material/Send";
import { useOutletContext } from "react-router-dom";

import PageHeader from "../../components/common/PageHeader";
import { PageContent } from "../../components/layout/AppLayout";
import { notificationApi } from "../../services/notificationApi";
import { useToast } from "../../context/ToastContext";

export default function AdminNotifications() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { showToast } = useToast();
  const { onMobileNavOpen } = useOutletContext() || {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !message) return;

    setLoading(true);
    try {
      await notificationApi.createAnnouncement(title, message);
      showToast("Announcement broadcast successfully to all students!", "success");
      setTitle("");
      setMessage("");
    } catch (err) {
      showToast(err?.message || "Failed to send announcement", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContent>
      <PageHeader
        title="Notifications & Announcements"
        description="Broadcast announcements and system updates to all enrolled students."
      />
        <Card sx={{ maxWidth: 640 }}>
          <CardContent sx={{ p: 4 }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2.5,
                  bgcolor: "primary.50",
                  color: "primary.main",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <CampaignIcon fontSize="large" />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Create Global Announcement
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Notifications will appear in the student header popover and notifications page.
                </Typography>
              </Box>
            </Stack>

            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={2.5}>
                <TextField
                  label="Announcement Title"
                  fullWidth
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Hackathon Registration Now Open"
                />

                <TextField
                  label="Announcement Message"
                  fullWidth
                  required
                  multiline
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter detailed announcement message..."
                />

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                  sx={{ py: 1.2 }}
                >
                  {loading ? "Sending..." : "Send Announcement"}
                </Button>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </PageContent>
  );
}
