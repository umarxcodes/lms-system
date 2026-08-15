import React from "react";
import { Grid, Card, Typography, Box, Stack, Avatar, Skeleton } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MarkEmailUnreadIcon from "@mui/icons-material/MarkEmailUnread";
import CampaignIcon from "@mui/icons-material/Campaign";

export default function NotificationSummaryCards({ loading, totalCount = 0, unreadCount = 0, announcementCount = 0 }) {
  const cards = [
    {
      title: "Total Notifications",
      value: totalCount,
      subtitle: "Total alerts & logs received",
      icon: <NotificationsIcon />,
      iconBg: "#eff6ff",
      iconColor: "#1e40af",
    },
    {
      title: "Unread Notifications",
      value: unreadCount,
      subtitle: "Action required or pending review",
      icon: <MarkEmailUnreadIcon />,
      iconBg: "#fffbebe",
      iconColor: "#d97706",
    },
    {
      title: "Announcements",
      value: announcementCount,
      subtitle: "Global bootcamp broadcasts",
      icon: <CampaignIcon />,
      iconBg: "#f0fdf4",
      iconColor: "#16a34a",
    },
  ];

  return (
    <Grid container spacing={2.5}>
      {cards.map((card, idx) => (
        <Grid item xs={12} sm={4} key={idx}>
          <Card
            elevation={0}
            sx={{
              p: 2.5,
              height: "100%",
              bgcolor: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: 2.5,
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.02)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 6px 16px rgba(0, 0, 0, 0.05)",
              },
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight={700}
                  sx={{ textTransform: "uppercase", letterSpacing: "0.04em", fontSize: "0.7rem" }}
                >
                  {card.title}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5, color: "#0f172a" }}>
                  {loading ? <Skeleton width={48} /> : card.value}
                </Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={500} sx={{ mt: 0.5, display: "block" }}>
                  {card.subtitle}
                </Typography>
              </Box>
              <Avatar
                sx={{
                  bgcolor: card.iconBg,
                  color: card.iconColor,
                  width: 46,
                  height: 46,
                  borderRadius: 2,
                }}
              >
                {card.icon}
              </Avatar>
            </Stack>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
