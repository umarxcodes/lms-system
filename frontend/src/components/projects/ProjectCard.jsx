import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  IconButton,
  Box,
  LinearProgress,
  Tooltip,
  Skeleton,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import StatusChip from "../common/StatusChip";

export function ProjectCard({ project, onDelete, onEdit, onStatusChange, onNavigateDetails }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const projTitle = project?.title || project?.name || "Untitled Project";
  const teamName = project?.team?.name || project?.teamId?.name || "Unassigned";
  const progress = Math.min(100, Math.max(0, project?.progress || 0));
  const currentStatus = project?.status || "pending";

  const isOverdue =
    project?.deadline &&
    new Date(project.deadline) < new Date() &&
    currentStatus !== "completed";

  const formattedDeadline = project?.deadline
    ? new Date(project.deadline).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  const handleOpenMenu = (e) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#ffffff",
        borderRadius: 3,
        border: "1px solid #e2e8f0",
        transition: "transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 10px 28px rgba(15, 23, 42, 0.06)",
          borderColor: "#cbd5e1",
        },
      }}
    >
      <CardContent sx={{ p: 2.75, flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Header: Title + More Actions */}
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1} sx={{ mb: 1.5 }}>
          <Tooltip title={projTitle} placement="top-start" arrow>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                fontSize: "1.05rem",
                color: "#0f172a",
                lineHeight: 1.35,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {projTitle}
            </Typography>
          </Tooltip>

          <IconButton
            size="small"
            onClick={handleOpenMenu}
            aria-label={`Actions for ${projTitle}`}
            sx={{
              color: "#64748b",
              borderRadius: 1.5,
              p: 0.5,
              "&:hover": { bgcolor: "#f1f5f9", color: "#0f172a" },
            }}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleCloseMenu}
            onClick={handleCloseMenu}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            PaperProps={{
              elevation: 0,
              sx: {
                borderRadius: 2,
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                minWidth: 150,
              },
            }}
          >
            <MenuItem onClick={() => onNavigateDetails(project._id || project.id)}>
              <ListItemIcon>
                <VisibilityOutlinedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primaryTypographyProps={{ fontSize: "0.875rem", fontWeight: 600 }}>
                View Project
              </ListItemText>
            </MenuItem>

            {onEdit && (
              <MenuItem onClick={() => onEdit(project)}>
                <ListItemIcon>
                  <EditOutlinedIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primaryTypographyProps={{ fontSize: "0.875rem", fontWeight: 600 }}>
                  Edit Details
                </ListItemText>
              </MenuItem>
            )}

            <MenuItem
              onClick={() => onDelete(project._id || project.id)}
              sx={{ color: "error.main" }}
            >
              <ListItemIcon sx={{ color: "error.main" }}>
                <DeleteOutlinedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primaryTypographyProps={{ fontSize: "0.875rem", fontWeight: 600 }}>
                Delete
              </ListItemText>
            </MenuItem>
          </Menu>
        </Stack>

        {/* Description */}
        <Typography
          variant="body2"
          sx={{
            color: "#475569",
            mb: 2,
            minHeight: 40,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            lineHeight: 1.5,
            fontSize: "0.875rem",
          }}
        >
          {project?.description || "No project description available."}
        </Typography>

        {/* Assigned Team */}
        <Box sx={{ mb: 2, p: 1.25, px: 1.5, borderRadius: 2, bgcolor: "#f8fafc", border: "1px solid #f1f5f9" }}>
          <Typography variant="caption" fontWeight={700} color="#64748b" display="block" sx={{ mb: 0.25, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.03em" }}>
            Assigned Team
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <GroupsOutlinedIcon sx={{ fontSize: 16, color: "#1e40af" }} />
            <Typography variant="body2" fontWeight={700} color="#0f172a" noWrap>
              {teamName}
            </Typography>
          </Stack>
        </Box>

        {/* Status & Deadline Row */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5, flexWrap: "wrap", gap: 1 }}>
          <Box>
            <Typography variant="caption" fontWeight={700} color="#64748b" display="block" sx={{ mb: 0.5, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.03em" }}>
              Status
            </Typography>
            <StatusChip status={currentStatus} />
          </Box>

          {formattedDeadline && (
            <Box sx={{ textAlign: "right" }}>
              <Typography variant="caption" fontWeight={700} color="#64748b" display="block" sx={{ mb: 0.5, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.03em" }}>
                Due Date
              </Typography>
              <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="flex-end">
                {isOverdue ? (
                  <Chip
                    icon={<WarningAmberOutlinedIcon sx={{ fontSize: "14px !important", color: "#b91c1c" }} />}
                    label={`Overdue (${formattedDeadline})`}
                    size="small"
                    sx={{
                      bgcolor: "#fef2f2",
                      color: "#991b1b",
                      fontWeight: 700,
                      fontSize: "0.75rem",
                      borderRadius: 1.5,
                      border: "1px solid #fecaca",
                    }}
                  />
                ) : (
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <CalendarTodayOutlinedIcon sx={{ fontSize: 13, color: "#64748b" }} />
                    <Typography variant="caption" fontWeight={700} color="#334155">
                      {formattedDeadline}
                    </Typography>
                  </Stack>
                )}
              </Stack>
            </Box>
          )}
        </Stack>

        {/* Progress Section */}
        <Box sx={{ mt: "auto" }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.75 }}>
            <Typography variant="caption" fontWeight={700} color="#64748b" sx={{ fontSize: "0.75rem" }}>
              Completion Rate
            </Typography>
            <Typography variant="caption" fontWeight={800} color="#1e40af" sx={{ fontSize: "0.8125rem" }}>
              {Math.round(progress)}%
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 6,
              borderRadius: 3,
              bgcolor: "#e2e8f0",
              "& .MuiLinearProgress-bar": {
                borderRadius: 3,
                bgcolor: progress === 100 ? "#16a34a" : "#1e40af",
              },
            }}
          />
        </Box>
      </CardContent>

      {/* Footer Details Button */}
      <Box
        sx={{
          p: 1.5,
          px: 2.75,
          bgcolor: "#f8fafc",
          borderTop: "1px solid #e2e8f0",
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
            fontWeight: 700,
            fontSize: "0.8125rem",
            color: "#0f172a",
            "&:hover": {
              bgcolor: "transparent",
              color: "#1e40af",
              "& .MuiButton-endIcon": {
                transform: "translateX(4px)",
              },
            },
          }}
        >
          View Project Details
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
        border: "1px solid #e2e8f0",
        p: 2.75,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        bgcolor: "#ffffff",
      }}
    >
      <Box>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Skeleton variant="text" width="65%" height={28} />
          <Skeleton variant="circular" width={24} height={24} />
        </Stack>
        <Skeleton variant="text" width="95%" height={20} />
        <Skeleton variant="text" width="75%" height={20} sx={{ mb: 2 }} />
        <Skeleton variant="rounded" width="100%" height={44} sx={{ mb: 2, borderRadius: 2 }} />
      </Box>
      <Box>
        <Skeleton variant="rounded" width="100%" height={6} sx={{ borderRadius: 3, mb: 2 }} />
        <Skeleton variant="rounded" width="100%" height={34} sx={{ borderRadius: 2 }} />
      </Box>
    </Card>
  );
}
