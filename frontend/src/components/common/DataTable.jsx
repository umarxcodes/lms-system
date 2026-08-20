import React from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  Paper,
  Box,
} from "@mui/material";
import EmptyState from "./EmptyState";
import PageSkeleton from "./PageSkeleton";

export default function DataTable({
  columns = [],
  data = [],
  loading = false,
  emptyTitle = "No records found",
  emptyDescription = "There are no data records available to display.",
  emptyIcon,
  emptyAction,
  page = 0,
  rowsPerPage = 10,
  totalCount,
  onPageChange,
  onRowsPerPageChange,
  rowKey = "_id",
}) {
  if (loading) {
    return <PageSkeleton type="table" />;
  }

  if (!data || data.length === 0) {
    return (
      <Paper elevation={0} sx={{ p: 4, border: "1px solid", borderColor: "divider" }}>
        <EmptyState
          title={emptyTitle}
          description={emptyDescription}
          icon={emptyIcon}
          actionButton={emptyAction}
        />
      </Paper>
    );
  }

  const count = typeof totalCount === "number" ? totalCount : data.length;

  return (
    <Paper elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, overflow: "hidden" }}>
      <TableContainer>
        <Table>
          <TableHead sx={{ bgcolor: "grey.50" }}>
            <TableRow>
              {columns.map((col, idx) => (
                <TableCell
                  key={col.id || col.field || idx}
                  align={col.align || "left"}
                  sx={{ fontWeight: 700, whiteSpace: "nowrap" }}
                >
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, rIdx) => {
              const keyVal = row[rowKey] || row.id || rIdx;
              return (
                <TableRow key={keyVal} hover>
                  {columns.map((col, cIdx) => (
                    <TableCell key={col.id || col.field || cIdx} align={col.align || "left"}>
                      {col.render ? col.render(row) : row[col.field]}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {onPageChange && (
        <TablePagination
          component="div"
          count={count}
          page={page}
          onPageChange={onPageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={onRowsPerPageChange}
          rowsPerPageOptions={[5, 10, 25]}
        />
      )}
    </Paper>
  );
}
