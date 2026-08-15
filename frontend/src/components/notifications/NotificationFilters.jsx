import React from "react";
import {
  Paper,
  Stack,
  TextField,
  InputAdornment,
  MenuItem,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListOffIcon from "@mui/icons-material/FilterListOff";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";

export default function NotificationFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  typeFilter,
  onTypeFilterChange,
  onClearFilters,
  onMarkAllAsRead,
  hasUnread,
}) {
  const isFiltered = Boolean(search || statusFilter !== "all" || typeFilter !== "all");

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        bgcolor: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: 2.5,
        width: "100%",
      }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        alignItems={{ xs: "stretch", md: "center" }}
        justifyContent="space-between"
      >
        {/* Left / Middle Controls */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          alignItems={{ xs: "stretch", sm: "center" }}
          sx={{ flexGrow: 1 }}
        >
          {/* Search Input */}
          <TextField
            placeholder="Search notification title or message..."
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            sx={{
              flexGrow: 1,
              maxWidth: { sm: 300, md: 380 },
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                bgcolor: "#f8fafc",
                "&:hover": { bgcolor: "#ffffff" },
                "&.Mui-focused": { bgcolor: "#ffffff" },
              },
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" sx={{ color: "text.secondary" }} />
                  </InputAdornment>
                ),
              },
            }}
          />

          {/* Status Filter */}
          <TextField
            select
            size="small"
            label="Read Status"
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            sx={{
              minWidth: 150,
              "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: "#ffffff" },
            }}
          >
            <MenuItem value="all">All Notifications</MenuItem>
            <MenuItem value="unread">Unread Only</MenuItem>
            <MenuItem value="read">Read Only</MenuItem>
          </TextField>

          {/* Category Type Filter */}
          <TextField
            select
            size="small"
            label="Category"
            value={typeFilter}
            onChange={(e) => onTypeFilterChange(e.target.value)}
            sx={{
              minWidth: 160,
              "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: "#ffffff" },
            }}
          >
            <MenuItem value="all">All Categories</MenuItem>
            <MenuItem value="task">Tasks & Milestones</MenuItem>
            <MenuItem value="project">Project Updates</MenuItem>
            <MenuItem value="attendance">Attendance Logs</MenuItem>
            <MenuItem value="system">System Announcements</MenuItem>
          </TextField>
        </Stack>

        {/* Right Actions */}
        <Stack direction="row" spacing={1.5} alignItems="center">
          {isFiltered && (
            <Button
              size="small"
              variant="outlined"
              color="inherit"
              startIcon={<FilterListOffIcon fontSize="small" />}
              onClick={onClearFilters}
              sx={{
                fontWeight: 700,
                borderRadius: 2,
                px: 2,
                py: 0.75,
                borderColor: "#cbd5e1",
                color: "#475569",
                whiteSpace: "nowrap",
              }}
            >
              Clear
            </Button>
          )}

          {hasUnread && (
            <Button
              size="small"
              variant="contained"
              color="primary"
              startIcon={<MarkEmailReadIcon />}
              onClick={onMarkAllAsRead}
              sx={{
                fontWeight: 800,
                borderRadius: 2,
                px: 2.5,
                py: 0.85,
                whiteSpace: "nowrap",
              }}
            >
              Mark All as Read
            </Button>
          )}
        </Stack>
      </Stack>
    </Paper>
  );
}
