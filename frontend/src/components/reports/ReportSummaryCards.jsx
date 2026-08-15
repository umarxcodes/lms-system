import React from "react";
import { Grid, Card, Typography, Box, Stack, Avatar, Skeleton } from "@mui/material";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AssessmentIcon from "@mui/icons-material/Assessment";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";

export default function ReportSummaryCards({
  loading,
  attendanceCount = 0,
  deliverablesCount = 0,
  attendanceRate = 100,
  deliverableCompletionRate = 0,
}) {
  const cardsData = [
    {
      title: "Total Attendance Logs",
      value: attendanceCount,
      subtitle: "Audited daily session entries",
      icon: <EventAvailableIcon />,
      iconBg: "#f0fdf4",
      iconColor: "#16a34a",
    },
    {
      title: "Deliverable Logs",
      value: deliverablesCount,
      subtitle: "Evaluated student assignments",
      icon: <AssignmentIcon />,
      iconBg: "#eff6ff",
      iconColor: "#1e40af",
    },
    {
      title: "Avg Attendance Rate",
      value: `${Math.round(attendanceRate)}%`,
      subtitle: "Bootcamp session presence",
      icon: <VerifiedUserIcon />,
      iconBg: "#fdf4ff",
      iconColor: "#9333ea",
    },
    {
      title: "Deliverable Velocity",
      value: `${Math.round(deliverableCompletionRate)}%`,
      subtitle: "Completed task milestone rate",
      icon: <AssessmentIcon />,
      iconBg: "#fff7ed",
      iconColor: "#ea580c",
    },
  ];

  return (
    <Grid container spacing={2.5}>
      {cardsData.map((card, idx) => (
        <Grid item xs={12} sm={6} md={3} key={idx}>
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
