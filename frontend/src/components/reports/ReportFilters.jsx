import React from "react";
import {
  Paper,
  Stack,
  TextField,
  InputAdornment,
  MenuItem,
  Button,
  Box,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListOffIcon from "@mui/icons-material/FilterListOff";
import DownloadIcon from "@mui/icons-material/Download";
import FileDownloadDoneIcon from "@mui/icons-material/FileDownloadDone";

export default function ReportFilters({
  reportType,
  onReportTypeChange,
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onClearFilters,
  onExportCsv,
  exporting,
}) {
  const isFiltered = Boolean(search || statusFilter !== "all");

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
        {/* Left / Middle: Controls */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          alignItems={{ xs: "stretch", sm: "center" }}
          sx={{ flexGrow: 1 }}
        >
          {/* Report Type Selector */}
          <TextField
            select
            size="small"
            label="Report Type"
            value={reportType}
            onChange={(e) => onReportTypeChange(e.target.value)}
            sx={{
              minWidth: 190,
              "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: "#ffffff" },
            }}
          >
            <MenuItem value="attendance">Attendance Audit Report</MenuItem>
            <MenuItem value="assignments">Task Deliverables Report</MenuItem>
          </TextField>

          {/* Search Input */}
          <TextField
            placeholder="Search trainee name, email, or topic..."
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
            label="Status"
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            sx={{
              minWidth: 140,
              "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: "#ffffff" },
            }}
          >
            <MenuItem value="all">All Statuses</MenuItem>
            {reportType === "attendance" ? (
              [
                <MenuItem key="present" value="present">Present</MenuItem>,
                <MenuItem key="absent" value="absent">Absent</MenuItem>,
                <MenuItem key="late" value="late">Late</MenuItem>,
                <MenuItem key="leave" value="leave">Leave</MenuItem>,
              ]
            ) : (
              [
                <MenuItem key="completed" value="completed">Completed</MenuItem>,
                <MenuItem key="in_progress" value="in_progress">In Progress</MenuItem>,
                <MenuItem key="pending" value="pending">Pending</MenuItem>,
              ]
            )}
          </TextField>
        </Stack>

        {/* Right: Actions */}
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

          <Button
            size="small"
            variant="contained"
            color="primary"
            disabled={exporting}
            startIcon={exporting ? <FileDownloadDoneIcon /> : <DownloadIcon />}
            onClick={onExportCsv}
            sx={{
              fontWeight: 800,
              borderRadius: 2,
              px: 2.5,
              py: 0.85,
              whiteSpace: "nowrap",
            }}
          >
            {exporting ? "Exporting CSV..." : "Export CSV Report"}
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}
