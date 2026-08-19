import React from "react";
import FilterBar from "../common/FilterBar";

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
  const teamOptions = [
    { value: "all", label: "All Teams" },
    ...teams.map((t) => ({ value: t._id || t.id, label: t.name })),
  ];

  return (
    <FilterBar
      search={search}
      onSearchChange={onSearchChange}
      searchPlaceholder="Search projects by title, description, or team..."
      filters={[
        {
          key: "status",
          label: "Status",
          value: statusFilter,
          onChange: onStatusFilterChange,
          options: [
            { value: "all", label: "All Statuses" },
            { value: "pending", label: "Pending" },
            { value: "in-progress", label: "In Progress" },
            { value: "completed", label: "Completed" },
          ],
        },
        {
          key: "team",
          label: "Team",
          value: teamFilter,
          onChange: onTeamFilterChange,
          options: teamOptions,
        },
      ]}
      sortOptions={[
        { value: "recent", label: "Recently Created" },
        { value: "deadline", label: "Deadline (Earliest)" },
        { value: "title", label: "Title (A - Z)" },
        { value: "progress", label: "Completion Progress" },
      ]}
      sortBy={sortBy}
      onSortChange={onSortByChange}
      onReset={() => {
        onSearchChange && onSearchChange("");
        onStatusFilterChange && onStatusFilterChange("all");
        onTeamFilterChange && onTeamFilterChange("all");
        onSortByChange && onSortByChange("recent");
      }}
    />
  );
}
