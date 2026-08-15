import React from "react";
import {
  Box,
  Stack,
  TextField,
  InputAdornment,
  MenuItem,
  Button,
  Paper,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import FilterListIcon from "@mui/icons-material/FilterList";

export default function TeamToolbar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  projectFilter,
  onProjectFilterChange,
  onCreateClick,
}) {
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
        {/* Left Side: Search + Filters */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          alignItems={{ xs: "stretch", sm: "center" }}
          sx={{ flexGrow: 1 }}
        >
          <TextField
            placeholder="Search teams by name..."
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            sx={{
              flexGrow: 1,
              maxWidth: { sm: 360, md: 450 },
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

          <Stack direction="row" spacing={1.5} alignItems="center">
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
              <MenuItem value="active">Active (With Members)</MenuItem>
              <MenuItem value="empty">Empty (No Members)</MenuItem>
            </TextField>

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
              <MenuItem value="assigned">Assigned</MenuItem>
              <MenuItem value="unassigned">Unassigned</MenuItem>
            </TextField>
          </Stack>
        </Stack>

        {/* Right Side: Primary Action Button */}
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={onCreateClick}
          sx={{
            fontWeight: 700,
            borderRadius: 2,
            px: 2.5,
            py: 1,
            whiteSpace: "nowrap",
            boxShadow: "none",
            "&:hover": { boxShadow: "0 4px 12px rgba(30, 64, 175, 0.2)" },
          }}
        >
          Create Team
        </Button>
      </Stack>
    </Paper>
  );
}
