import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  TextField,
  MenuItem,
  IconButton,
  Box,
  LinearProgress,
  Tooltip,
  Skeleton,
} from "@mui/material";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import StatusChip from "../common/StatusChip";

export function ProjectCard({ project, onDelete, onStatusChange, onNavigateDetails }) {
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const projTitle = project?.title || project?.name || "Untitled Project";
  const teamName = project?.team?.name || project?.teamId?.name || "Unassigned";
  const progress = Math.min(100, Math.max(0, project?.progress || 0));
  const currentStatus = project?.status || "pending";

  const handleStatusUpdate = async (e) => {
    const newStatus = e.target.value;
    if (newStatus === currentStatus || updatingStatus) return;
    setUpdatingStatus(true);
    try {
      await onStatusChange(project._id || project.id, newStatus);
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)",
        transition: "transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
        },
      }}
    >
      <CardContent sx={{ p: 2.5, flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Header: Title + Delete Button */}
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1} sx={{ mb: 1.5 }}>
          <Tooltip title={projTitle} placement="top-start" arrow>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: "1.05rem",
                color: "text.primary",
                lineHeight: 1.3,
                display: "-webkit-box",
                WebkitLineClamp: 1,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {projTitle}
            </Typography>
          </Tooltip>

          <Tooltip title="Delete project" arrow>
            <IconButton
              size="small"
              onClick={() => onDelete(project._id || project.id)}
              aria-label={`Delete project ${projTitle}`}
              sx={{
                color: "text.secondary",
                borderRadius: 1.5,
                p: 0.75,
                transition: "all 0.15s ease",
                "&:hover": {
                  color: "error.main",
                  bgcolor: "error.50",
                },
              }}
            >
              <DeleteOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>

        {/* Description */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            minHeight: 40,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            lineHeight: 1.45,
          }}
        >
          {project?.description || "No project description available."}
        </Typography>

        {/* Assigned Team */}
        <Box sx={{ mb: 2, p: 1.25, borderRadius: 2, bgcolor: "grey.50" }}>
          <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" sx={{ mb: 0.25 }}>
            Assigned Team
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <GroupsOutlinedIcon sx={{ fontSize: 16, color: "primary.main" }} />
            <Typography variant="body2" fontWeight={700} color="text.primary" noWrap>
              {teamName}
            </Typography>
          </Stack>
        </Box>

        {/* Status Dropdown */}
        <Box sx={{ mb: 2, mt: "auto" }}>
          <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" sx={{ mb: 0.75 }}>
            Project Status
          </Typography>
          <Stack direction="row" spacing={1.25} alignItems="center">
            <StatusChip status={currentStatus} />
            <TextField
              select
              size="small"
              disabled={updatingStatus}
              value={currentStatus}
              onChange={handleStatusUpdate}
              sx={{
                flex: 1,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  fontSize: "0.8125rem",
                  py: 0.25,
                },
              }}
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="in-progress">In Progress</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </TextField>
          </Stack>
        </Box>

        {/* Completion Progress Bar */}
        <Box>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.75 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={600}>
              Completion Rate
            </Typography>
            <Typography variant="caption" color="primary.main" fontWeight={700}>
              {Math.round(progress)}%
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 6,
              borderRadius: 3,
              bgcolor: "grey.100",
              "& .MuiLinearProgress-bar": {
                borderRadius: 3,
                background:
                  progress === 100
                    ? "linear-gradient(90deg, #10b981 0%, #059669 100%)"
                    : "linear-gradient(90deg, #1e40af 0%, #3b82f6 100%)",
              },
            }}
          />
        </Box>
      </CardContent>

      {/* Footer Details Button */}
      <Box
        sx={{
          p: 1.5,
          px: 2.5,
          bgcolor: "grey.50",
          borderTop: "1px solid",
          borderColor: "divider",
          borderBottomLeftRadius: 12,
          borderBottomRightRadius: 12,
        }}
      >
        <Button
          fullWidth
          size="small"
          endIcon={<ArrowForwardIcon sx={{ transition: "transform 0.18s ease" }} />}
          onClick={() => onNavigateDetails(project._id || project.id)}
          sx={{
            justifyContent: "space-between",
            fontWeight: 600,
            fontSize: "0.8125rem",
            color: "text.primary",
            "&:hover": {
              bgcolor: "transparent",
              color: "primary.main",
              "& .MuiButton-endIcon": {
                transform: "translateX(3px)",
              },
            },
          }}
        >
          Project Details
        </Button>
      </Box>
    </Card>
  );
}

export function ProjectCardSkeleton() {
  return (
    <Card
      elevation={0}
      sx={{
        height: 290,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        p: 2.5,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Box>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Skeleton variant="text" width="60%" height={28} />
          <Skeleton variant="circular" width={24} height={24} />
        </Stack>
        <Skeleton variant="text" width="90%" height={20} />
        <Skeleton variant="text" width="75%" height={20} sx={{ mb: 2 }} />
        <Skeleton variant="rounded" width="100%" height={42} sx={{ mb: 2, borderRadius: 2 }} />
      </Box>
      <Box>
        <Skeleton variant="rounded" width="100%" height={6} sx={{ borderRadius: 3, mb: 2 }} />
        <Skeleton variant="rounded" width="100%" height={32} sx={{ borderRadius: 2 }} />
      </Box>
    </Card>
  );
}
