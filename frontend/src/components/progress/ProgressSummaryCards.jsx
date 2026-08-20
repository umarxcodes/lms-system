import React from 'react'
import {
  Grid,
  Card,
  Typography,
  Box,
  Stack,
  Avatar,
  Skeleton,
} from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import FolderIcon from '@mui/icons-material/Folder'
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'

export default function ProgressSummaryCards({
  loading,
  totalStudents = 0,
  overallProgress = 0,
  completedProjectsCount = 0,
  pendingTasksCount = 0,
}) {
  const cardsData = [
    {
      title: 'Total Students',
      value: totalStudents,
      subtitle: 'Active trainees in bootcamp',
      icon: <PersonIcon />,
      iconBg: '#eff6ff',
      iconColor: '#1e40af',
    },
    {
      title: 'Overall Progress',
      value: `${Math.round(overallProgress)}%`,
      subtitle: 'Average completion rate',
      icon: <TrendingUpIcon />,
      iconBg: '#f0fdf4',
      iconColor: '#16a34a',
    },
    {
      title: 'Completed Projects',
      value: completedProjectsCount,
      subtitle: 'Finished capstone projects',
      icon: <FolderIcon />,
      iconBg: '#fdf4ff',
      iconColor: '#9333ea',
    },
    {
      title: 'Pending Tasks',
      value: pendingTasksCount,
      subtitle: 'Tasks awaiting completion',
      icon: <AssignmentTurnedInIcon />,
      iconBg: '#fff7ed',
      iconColor: '#ea580c',
    },
  ]

  return (
    <Grid container spacing={2.5}>
      {cardsData.map((card, idx) => (
        <Grid item xs={12} sm={6} md={3} key={idx}>
          <Card
            elevation={0}
            sx={{
              p: 2.5,
              height: '100%',
              bgcolor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: 2.5,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 16px rgba(0, 0, 0, 0.05)',
              },
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight={700}
                  sx={{
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    fontSize: '0.7rem',
                  }}
                >
                  {card.title}
                </Typography>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 800, mt: 0.5, color: '#0f172a' }}
                >
                  {loading ? <Skeleton width={48} /> : card.value}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight={500}
                  sx={{ mt: 0.5, display: 'block' }}
                >
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
  )
}
