import { useMemo, useState } from "react";
import {
  Box,
  Avatar,
  Chip,
  IconButton,
  Select,
  MenuItem,
  Button,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { SearchField } from "./Header.jsx";

const PAGE_SIZE = 5;

// Chip color per team. Falls back to a neutral style for unknown team names.
const TEAM_STYLES = {
  "Team Alpha": { bg: "#eff6ff", color: "#1d4ed8" }, // blue
  "Team Beta": { bg: "#ecfdf5", color: "#047857" }, // green
  "Team Gamma": { bg: "#f5f3ff", color: "#6d28d9" }, // purple
};

function TeamCell({ team }) {
  if (!team) {
    return (
      <Typography sx={{ fontSize: 13, color: "grey.400", fontStyle: "italic" }}>
        Not Assigned
      </Typography>
    );
  }
  const style = TEAM_STYLES[team] ?? { bg: "grey.100", color: "grey.700" };
  return (
    <Chip
      label={team}
      size="small"
      sx={{
        bgcolor: style.bg,
        color: style.color,
        fontWeight: 600,
        fontSize: 12,
        height: 24,
      }}
    />
  );
}

// Small bordered dropdown matching the mockup's "Course" / "Batch" filters.
function FilterSelect({ value, onChange, options, placeholder }) {
  return (
    <Select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      displayEmpty
      size="small"
      sx={{
        minWidth: 130,
        bgcolor: "#fff",
        fontSize: 14,
        borderRadius: 2,
        "& .MuiOutlinedInput-notchedOutline": { borderColor: "grey.200" },
        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "grey.300" },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "#60a5fa",
        },
      }}
    >
      <MenuItem value="">{placeholder}</MenuItem>
      {options.map((opt) => (
        <MenuItem key={opt} value={opt}>
          {opt}
        </MenuItem>
      ))}
    </Select>
  );
}

/**
 * Students data table (MUI X Data Grid) with a search + Course/Batch filter
 * toolbar and an "Add Student" button above it.
 *
 * Requires: npm install @mui/x-data-grid
 *
 * `students` is the full list; search/course/batch filtering happens
 * client-side before rows reach the grid. The grid handles its own
 * pagination (page size fixed at 5 to match the mockup).
 *
 * For server-side pagination/filtering instead, swap to DataGrid's
 * `paginationMode="server"` + `rowCount` + `onPaginationModelChange`,
 * driven by your API.
 *
 * Usage:
 *   <StudentsTable
 *     students={students}
 *     onAddStudent={() => {...}}
 *     onView={(student) => {...}}
 *     onEdit={(student) => {...}}
 *   />
 */
export default function StudentsTable({
  students = [],
  onAddStudent,
  onView,
  onEdit,
}) {
  const [search, setSearch] = useState("");
  const [course, setCourse] = useState("");
  const [batch, setBatch] = useState("");

  const courseOptions = useMemo(
    () => [...new Set(students.map((s) => s.course))],
    [students],
  );
  const batchOptions = useMemo(
    () => [...new Set(students.map((s) => s.batch))],
    [students],
  );

  const filtered = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch =
        !search ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase()) ||
        s.rollNumber.toLowerCase().includes(search.toLowerCase());
      const matchesCourse = !course || s.course === course;
      const matchesBatch = !batch || s.batch === batch;
      return matchesSearch && matchesCourse && matchesBatch;
    });
  }, [students, search, course, batch]);

  // DataGrid needs a unique `id` per row.
  const rows = useMemo(
    () => filtered.map((s) => ({ id: s.rollNumber, ...s })),
    [filtered],
  );

  const columns = [
    {
      field: "rollNumber",
      headerName: "Roll Number",
      width: 130,
      renderCell: (params) => (
        <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#2563eb" }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: "name",
      headerName: "Student Name",
      flex: 1,
      minWidth: 220,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar
            src={params.row.avatarSrc}
            alt={params.value}
            sx={{ width: 36, height: 36 }}
          />
          <Box>
            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 600,
                color: "grey.900",
                lineHeight: 1.3,
              }}
            >
              {params.value}
            </Typography>
            <Typography
              sx={{ fontSize: 12.5, color: "#2563eb", lineHeight: 1.3 }}
            >
              {params.row.email}
            </Typography>
          </Box>
        </Box>
      ),
    },
    { field: "course", headerName: "Course", flex: 1, minWidth: 180 },
    { field: "batch", headerName: "Batch", width: 110 },
    {
      field: "team",
      headerName: "Team",
      width: 140,
      renderCell: (params) => <TeamCell team={params.value} />,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      sortable: false,
      filterable: false,
      align: "right",
      headerAlign: "right",
      renderCell: (params) => (
        <Box>
          <IconButton
            size="small"
            onClick={() => onView?.(params.row)}
            sx={{ color: "grey.400" }}
          >
            <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => onEdit?.(params.row)}
            sx={{ color: "grey.400" }}
          >
            <EditOutlinedIcon sx={{ fontSize: 17 }} />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <>
      {/* Toolbar: search + filters + add button */}
      <Box
        sx={{
          bgcolor: "#fff",
          border: "1px solid",
          borderColor: "grey.200",
          borderRadius: 3,
          p: 2,
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            flexWrap: "wrap",
          }}
        >
          <SearchField
            placeholder="Search..."
            value={search}
            onChange={setSearch}
            width={280}
            bgcolor="grey.50"
          />
          <FilterSelect
            value={course}
            onChange={setCourse}
            options={courseOptions}
            placeholder="Course"
          />
          <FilterSelect
            value={batch}
            onChange={setBatch}
            options={batchOptions}
            placeholder="Batch"
          />
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon sx={{ fontSize: 16 }} />}
          onClick={onAddStudent}
          sx={{
            bgcolor: "#2563eb",
            "&:hover": { bgcolor: "#1d4ed8" },
            borderRadius: 2,
            px: 2,
            height: 36,
            fontSize: 14,
            fontWeight: 600,
            textTransform: "none",
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            whiteSpace: "nowrap",
          }}
        >
          Add Student
        </Button>
      </Box>

      {/* Data grid */}
      <Box
        sx={{
          bgcolor: "#fff",
          border: "1px solid",
          borderColor: "grey.200",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.id}
          rowHeight={64}
          columnHeaderHeight={44}
          initialState={{
            pagination: { paginationModel: { pageSize: PAGE_SIZE, page: 0 } },
          }}
          pageSizeOptions={[PAGE_SIZE]}
          disableRowSelectionOnClick
          disableColumnMenu
          autoHeight
          sx={{
            border: "none",
            "--DataGrid-rowBorderColor": "transparent",
            "& .MuiDataGrid-columnHeaders": {
              bgcolor: "grey.50",
              borderBottom: "1px solid",
              borderColor: "grey.100",
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              fontSize: 11,
              fontWeight: 600,
              color: "grey.500",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "1px solid",
              borderColor: "grey.50",
              display: "flex",
              alignItems: "center",
            },
            "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
              outline: "none",
            },
            "& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within":
              {
                outline: "none",
              },
            "& .MuiDataGrid-row:hover": {
              bgcolor: "grey.50",
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "1px solid",
              borderColor: "grey.100",
            },
          }}
        />
      </Box>
    </>
  );
}
