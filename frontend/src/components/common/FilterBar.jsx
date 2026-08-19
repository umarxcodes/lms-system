import React from "react";
import {
  Paper,
  Stack,
  TextField,
  InputAdornment,
  MenuItem,
  IconButton,
  Button,
  Chip,
  Box,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import FilterListIcon from "@mui/icons-material/FilterList";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

/**
 * FilterBar Component
 *
 * @param {string} search - Search query text
 * @param {function} onSearchChange - Handler for search query change
 * @param {string} searchPlaceholder - Placeholder for search input
 * @param {Array} filters - Array of filter definitions:
 *   [{ key: 'batch', label: 'Batch', value: 'ALL', options: [{ value: 'ALL', label: 'All Batches' }, ...], onChange: fn }]
 * @param {Array} sortOptions - Sort dropdown options (optional)
 * @param {string} sortBy - Active sort value
 * @param {function} onSortChange - Sort change handler
 * @param {function} onReset - Handler to reset all search & filters
 */
export default function FilterBar({
  search = "",
  onSearchChange,
  searchPlaceholder = "Search records...",
  filters = [],
  sortOptions = [],
  sortBy = "",
  onSortChange,
  onReset,
}) {
  // Count active non-default filters
  const activeFiltersCount =
    (search.trim() ? 1 : 0) +
    filters.filter((f) => f.value && f.value !== "ALL" && f.value !== "all" && f.value !== "").length;

  const isFiltered = activeFiltersCount > 0;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mb: 3,
        bgcolor: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: 3,
        boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
      }}
    >
      <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="center" justifyContent="space-between">
        {/* Search Field */}
        <Box sx={{ width: { xs: "100%", md: 380 } }}>
          <TextField
            placeholder={searchPlaceholder}
            size="small"
            fullWidth
            value={search}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2.5,
                bgcolor: "#f8fafc",
                fontSize: "0.875rem",
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: "#f1f5f9",
                },
                "&.Mui-focused": {
                  bgcolor: "#ffffff",
                  boxShadow: "0 0 0 3px rgba(37,99,235,0.12)",
                },
              },
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" sx={{ color: "#64748b" }} />
                  </InputAdornment>
                ),
                endAdornment: search ? (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => onSearchChange && onSearchChange("")}>
                      <ClearIcon fontSize="small" sx={{ color: "#94a3b8" }} />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              },
            }}
          />
        </Box>

        {/* Filter Controls & Reset */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          alignItems="center"
          width={{ xs: "100%", md: "auto" }}
          flexWrap="wrap"
          rowGap={1.5}
        >
          {/* Active Filter Counter Chip */}
          {isFiltered && (
            <Chip
              icon={<FilterListIcon style={{ fontSize: 15, color: "#1d4ed8" }} />}
              label={`${activeFiltersCount} Filter${activeFiltersCount > 1 ? "s" : ""} Active`}
              size="small"
              sx={{
                bgcolor: "#eff6ff",
                color: "#1d4ed8",
                fontWeight: 700,
                fontSize: "0.75rem",
                borderRadius: 2,
                border: "1px solid #dbeafe",
              }}
            />
          )}

          {/* Dynamic Filter Dropdowns */}
          {filters.map((filter) => {
            const isActive = filter.value && filter.value !== "ALL" && filter.value !== "all" && filter.value !== "";
            return (
              <TextField
                key={filter.key}
                select
                size="small"
                label={filter.label}
                value={filter.value}
                onChange={(e) => filter.onChange(e.target.value)}
                sx={{
                  minWidth: { xs: "100%", sm: 150 },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2.5,
                    bgcolor: isActive ? "#eff6ff" : "#f8fafc",
                    borderColor: isActive ? "#93c5fd" : "#cbd5e1",
                    fontSize: "0.875rem",
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? "#1e40af" : "#334155",
                    "&:hover": {
                      bgcolor: isActive ? "#dbeafe" : "#f1f5f9",
                    },
                  },
                }}
              >
                {filter.options.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value} sx={{ fontSize: "0.875rem", fontWeight: 500 }}>
                    {opt.label}
                  </MenuItem>
                ))}
              </TextField>
            );
          })}

          {/* Optional Sort Dropdown */}
          {sortOptions.length > 0 && (
            <TextField
              select
              size="small"
              label="Sort By"
              value={sortBy}
              onChange={(e) => onSortChange && onSortChange(e.target.value)}
              sx={{
                minWidth: { xs: "100%", sm: 160 },
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2.5,
                  bgcolor: "#f8fafc",
                  fontSize: "0.875rem",
                },
              }}
            >
              {sortOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value} sx={{ fontSize: "0.875rem" }}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>
          )}

          {/* Clear / Reset All Button */}
          {isFiltered && onReset && (
            <Button
              size="small"
              variant="text"
              startIcon={<RestartAltIcon fontSize="small" />}
              onClick={onReset}
              sx={{
                fontWeight: 700,
                color: "#64748b",
                borderRadius: 2,
                px: 1.5,
                textTransform: "none",
                "&:hover": {
                  color: "#dc2626",
                  bgcolor: "#fef2f2",
                },
              }}
            >
              Clear Filters
            </Button>
          )}
        </Stack>
      </Stack>
    </Paper>
  );
}
