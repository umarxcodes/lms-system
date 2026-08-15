import React from "react";
import { Grid, Card, Typography, Box, Stack, Avatar, Skeleton } from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PersonIcon from "@mui/icons-material/Person";
import FolderIcon from "@mui/icons-material/Folder";

export default function TeamSummaryCards({ loading, teams = [], projects = [] }) {
  const totalTeams = teams.length;
  const activeTeams = teams.filter((t) => (t.members?.length || 0) > 0).length;
  const totalMembers = teams.reduce((sum, t) => sum + (t.members?.length || 0), 0);
  
  // Calculate teams with assigned projects from backend projects list or team.project
  const teamIdsWithProjects = new Set(
    projects
      .map((p) => (p.team?._id || p.team?.id || p.teamId?._id || p.teamId?.id || p.team || p.teamId))
      .filter(Boolean)
  );
  const teamsWithProjects = teams.filter(
    (t) => t.project || teamIdsWithProjects.has(t._id || t.id)
  ).length;

  const cardsData = [
    {
      title: "Total Teams",
      value: totalTeams,
      subtitle: "Organized bootcamp squads",
      icon: <GroupsIcon />,
      iconBg: "#eff6ff",
      iconColor: "#1e40af",
    },
    {
      title: "Active Teams",
      value: activeTeams,
      subtitle: "Teams with assigned members",
      icon: <CheckCircleIcon />,
      iconBg: "#f0fdf4",
      iconColor: "#16a34a",
    },
    {
      title: "Total Members",
      value: totalMembers,
      subtitle: "Trainees in active teams",
      icon: <PersonIcon />,
      iconBg: "#fdf4ff",
      iconColor: "#9333ea",
    },
    {
      title: "Teams With Projects",
      value: teamsWithProjects,
      subtitle: "Capstone project assignments",
      icon: <FolderIcon />,
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
