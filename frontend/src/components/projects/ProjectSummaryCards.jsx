import React from "react";
import { Grid, Card, CardContent, Typography, Stack, Box, Skeleton } from "@mui/material";
import FolderIcon from "@mui/icons-material/FolderOutlined";
import TrendingUpIcon from "@mui/icons-material/TrendingUpOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircleOutlined";
import ScheduleIcon from "@mui/icons-material/ScheduleOutlined";

export function ProjectSummaryCards({ projects = [], loading = false }) {
  if (loading) {
    return (
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {[1, 2, 3, 4].map((idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Skeleton variant="rounded" height={84} sx={{ borderRadius: 2.5 }} />
          </Grid>
        ))}
      </Grid>
    );
  }

  const total = projects.length;
  const active = projects.filter((p) => p.status === "in-progress").length;
  const completed = projects.filter((p) => p.status === "completed").length;
  const pending = projects.filter((p) => p.status === "pending" || !p.status).length;

  const cards = [
    {
      title: "Total Projects",
      value: total,
      subtext: "All assigned deliverables",
      icon: FolderIcon,
      bgColor: "#eff6ff",
      iconColor: "#1e40af",
    },
    {
      title: "Active Projects",
      value: active,
      subtext: "Currently in progress",
      icon: TrendingUpIcon,
      bgColor: "#f0fdf4",
      iconColor: "#16a34a",
    },
    {
      title: "Completed",
      value: completed,
      subtext: "Finished capstones",
      icon: CheckCircleIcon,
      bgColor: "#faf5ff",
      iconColor: "#9333ea",
    },
    {
      title: "Pending",
      value: pending,
      subtext: "Awaiting kick-off",
      icon: ScheduleIcon,
      bgColor: "#fff7ed",
      iconColor: "#ea580c",
    },
  ];

  return (
    <Grid container spacing={2.5} sx={{ mb: 3 }}>
      {cards.map((card, idx) => {
        const IconComponent = card.icon;
        return (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Card
              elevation={0}
              sx={{
                p: 2.25,
                bgcolor: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: 2.5,
                transition: "box-shadow 0.2s ease, border-color 0.2s ease",
                "&:hover": {
                  borderColor: "#cbd5e1",
                  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="caption"
                    fontWeight={700}
                    color="text.secondary"
                    sx={{ textTransform: "uppercase", letterSpacing: "0.03em" }}
                  >
                    {card.title}
                  </Typography>
                  <Typography variant="h4" fontWeight={800} color="#0f172a" sx={{ my: 0.25, lineHeight: 1.1 }}>
                    {card.value}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.75rem" }}>
                    {card.subtext}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    bgcolor: card.bgColor,
                    color: card.iconColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <IconComponent fontSize="medium" />
                </Box>
              </Stack>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}
