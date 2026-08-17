import React from "react";
import { Box, Stack, TextField, InputAdornment, MenuItem, Paper } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import SortIcon from "@mui/icons-material/Sort";

export function ProjectToolbar({
  search = "",
  onSearchChange,
  statusFilter = "all",
  onStatusFilterChange,
  teamFilter = "all",
  onTeamFilterChange,
  sortBy = "recent",
  onSortByChange,
  teams = [],
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mb: 3,
        bgcolor: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: 2.5,
      }}
    >
      <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="center" justifyContent="space-between">
        {/* Search Field */}
        <TextField
          placeholder="Search projects by title, description, or team..."
          size="small"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          sx={{
            width: { xs: "100%", md: 360 },
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              bgcolor: "#f8fafc",
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

        {/* Filter & Sort Controls */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} width={{ xs: "100%", md: "auto" }}>
          {/* Status Filter */}
          <TextField
            select
            size="small"
            label="Status"
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            sx={{
              minWidth: { xs: "100%", sm: 140 },
              "& .MuiOutlinedInput-root": { borderRadius: 2 },
            }}
          >
            <MenuItem value="all">All Statuses</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="in-progress">In Progress</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </TextField>

          {/* Team Filter */}
          <TextField
            select
            size="small"
            label="Team"
            value={teamFilter}
            onChange={(e) => onTeamFilterChange(e.target.value)}
            sx={{
              minWidth: { xs: "100%", sm: 150 },
              "& .MuiOutlinedInput-root": { borderRadius: 2 },
            }}
          >
            <MenuItem value="all">All Teams</MenuItem>
            {teams.map((t) => (
              <MenuItem key={t._id || t.id} value={t._id || t.id}>
                {t.name}
              </MenuItem>
            ))}
          </TextField>

          {/* Sort By */}
          <TextField
            select
            size="small"
            label="Sort By"
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            sx={{
              minWidth: { xs: "100%", sm: 160 },
              "& .MuiOutlinedInput-root": { borderRadius: 2 },
            }}
          >
            <MenuItem value="recent">Recently Created</MenuItem>
            <MenuItem value="deadline">Deadline (Earliest)</MenuItem>
            <MenuItem value="title">Title (A - Z)</MenuItem>
            <MenuItem value="progress">Completion Progress</MenuItem>
          </TextField>
        </Stack>
      </Stack>
    </Paper>
  );
}
