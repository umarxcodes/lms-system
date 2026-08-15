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

export default function ProgressToolbar({
  search,
  onSearchChange,
  teamFilter,
  onTeamFilterChange,
  projectFilter,
  onProjectFilterChange,
  statusFilter,
  onStatusFilterChange,
  availableTeams = [],
  availableProjects = [],
  onClearFilters,
}) {
  const isFiltered = Boolean(search || teamFilter !== "all" || projectFilter !== "all" || statusFilter !== "all");

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
        {/* Left / Center: Search Bar & Dropdown Filters */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          alignItems={{ xs: "stretch", sm: "center" }}
          sx={{ flexGrow: 1 }}
        >
          <TextField
            placeholder="Search students, teams or projects..."
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            sx={{
              flexGrow: 1,
              maxWidth: { sm: 340, md: 420 },
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

          <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
            {/* Team Filter */}
            <TextField
              select
              size="small"
              label="Team"
              value={teamFilter}
              onChange={(e) => onTeamFilterChange(e.target.value)}
              sx={{
                minWidth: 130,
                "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: "#ffffff" },
              }}
            >
              <MenuItem value="all">All Teams</MenuItem>
              {availableTeams.map((t) => {
                const tName = t.name || t;
                return (
                  <MenuItem key={t._id || t.id || tName} value={tName}>
                    {tName}
                  </MenuItem>
                );
              })}
            </TextField>

            {/* Project Filter */}
            <TextField
              select
              size="small"
              label="Project"
              value={projectFilter}
              onChange={(e) => onProjectFilterChange(e.target.value)}
              sx={{
                minWidth: 140,
                "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: "#ffffff" },
              }}
            >
              <MenuItem value="all">All Projects</MenuItem>
              {availableProjects.map((p) => {
                const pName = p.name || p.title || p;
                return (
                  <MenuItem key={p._id || p.id || pName} value={pName}>
                    {pName}
                  </MenuItem>
                );
              })}
            </TextField>

            {/* Status Filter */}
            <TextField
              select
              size="small"
              label="Status"
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              sx={{
                minWidth: 130,
                "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: "#ffffff" },
              }}
            >
              <MenuItem value="all">All Statuses</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="in_progress">In Progress</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
            </TextField>
          </Stack>
        </Stack>

        {/* Clear Filters Button */}
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
            Clear Filters
          </Button>
        )}
      </Stack>
    </Paper>
  );
}
