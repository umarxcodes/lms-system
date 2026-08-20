import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  Typography,
  Stack,
  Avatar,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import StarIcon from "@mui/icons-material/Star";
import FolderIcon from "@mui/icons-material/Folder";
import ChecklistRtlIcon from "@mui/icons-material/ChecklistRtl";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import PageHeader from "../../components/common/PageHeader";
import { PageContent } from "../../components/layout/AppLayout";
import StatCard from "../../components/common/StatCard";
import StatusBadge from "../../components/common/StatusBadge";
import DataTable from "../../components/common/DataTable";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { teamApi } from "../../services/teamApi";
import { useToast } from "../../context/ToastContext";

export default function StudentTeam() {
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    teamApi
      .getMyTeam()
      .then((res) => {
        if (res.success && res.data) setTeam(res.data);
      })
      .catch((err) => showToast(err?.message || "Failed to load team details", "error"))
      .finally(() => setLoading(false));
  }, [showToast]);

  const mockMembers = [
    { id: 1, name: "Ali Khan (You)", email: "ali.khan@saylani.org", rollNumber: "SMIT-2026-0941", role: "Frontend Lead", isLeader: true },
    { id: 2, name: "Usman Raza", email: "usman.raza@saylani.org", rollNumber: "SMIT-2026-0942", role: "Backend Engineer", isLeader: false },
    { id: 3, name: "Sara Ahmed", email: "sara.ahmed@saylani.org", rollNumber: "SMIT-2026-0943", role: "UI/UX Designer", isLeader: false },
    { id: 4, name: "Bilal Tariq", email: "bilal.tariq@saylani.org", rollNumber: "SMIT-2026-0944", role: "Fullstack Developer", isLeader: false },
  ];

  const displayMembers = (team?.members && team.members.length > 0) ? team.members : mockMembers;

  const columns = [
    {
      field: "name",
      label: "Member Name & Role",
      render: (row) => {
        const name = row.name || row.user?.name || "Student";
        return (
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar sx={{ width: 34, height: 34, bgcolor: "#2563EB", fontWeight: 700, fontSize: 13 }}>
              {name.charAt(0)}
            </Avatar>
            <Box>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="body2" sx={{ fontWeight: 700, color: "#111827" }}>
                  {name}
                </Typography>
                {row.isLeader && (
                  <StatusBadge status="completed" label="Team Leader" icon={StarIcon} />
                )}
              </Stack>
              <Typography variant="caption" sx={{ color: "#64748B" }}>
                {row.role || "Software Engineer"}
              </Typography>
            </Box>
          </Stack>
        );
      },
    },
    {
      field: "email",
      label: "Email Address",
      render: (row) => row.email || row.user?.email || "N/A",
    },
    {
      field: "rollNumber",
      label: "Roll Number",
      render: (row) => (
        <Typography variant="caption" sx={{ fontFamily: "monospace", fontWeight: 700, px: 1, py: 0.3, bgcolor: "#F1F5F9", borderRadius: "6px" }}>
          {row.rollNumber || "SMIT-2026"}
        </Typography>
      ),
    },
    {
      field: "status",
      label: "Status",
      render: () => <StatusBadge status="active" />,
    },
    {
      field: "actions",
      label: "Actions",
      align: "right",
      render: (row) => (
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Tooltip title="View Member Profile">
            <IconButton
              size="small"
              sx={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                color: "#2563EB",
                bgcolor: "#EFF6FF",
                border: "1px solid #DBEAFE",
                transition: "all 0.18s ease-in-out",
                "&:hover": { bgcolor: "#2563EB", color: "#FFFFFF" },
              }}
              onClick={() => showToast(`View Member: ${row.name || "Student"}`, "info")}
            >
              <VisibilityIcon sx={{ fontSize: 17 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit Member Role">
            <IconButton
              size="small"
              sx={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                color: "#0284C7",
                bgcolor: "#F0F9FF",
                border: "1px solid #E0F2FE",
                transition: "all 0.18s ease-in-out",
                "&:hover": { bgcolor: "#0284C7", color: "#FFFFFF" },
              }}
              onClick={() => showToast(`Edit Role: ${row.name || "Student"}`, "info")}
            >
              <EditIcon sx={{ fontSize: 17 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Remove Member">
            <IconButton
              size="small"
              sx={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                color: "#DC2626",
                bgcolor: "#FEF2F2",
                border: "1px solid #FEE2E2",
                transition: "all 0.18s ease-in-out",
                "&:hover": { bgcolor: "#DC2626", color: "#FFFFFF" },
              }}
              onClick={() => setDeleteId(row.id || row._id)}
            >
              <DeleteIcon sx={{ fontSize: 17 }} />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <PageContent>
      <PageHeader
        breadcrumbs={[{ label: "Home", to: "/student/dashboard" }, { label: "My Team" }]}
        title={team?.name ? `Team Roster: ${team.name}` : "My Team: Team Alpha"}
        description="Collaborate with your team members on Capstone project modules and deliverables."
      />

      {/* Team KPI Summary Cards */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="TOTAL SQUAD MEMBERS"
            value={displayMembers.length}
            subtitle="Active developers"
            icon={GroupsIcon}
            iconBgColor="#EFF6FF"
            iconColor="#2563EB"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="TEAM LEADER"
            value="Ali Khan"
            subtitle="Frontend Coordinator"
            icon={StarIcon}
            iconBgColor="#FFFBEB"
            iconColor="#F59E0B"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="ASSIGNED PROJECT"
            value="LMS Portal"
            subtitle="Capstone Batch 1"
            icon={FolderIcon}
            iconBgColor="#F3E8FF"
            iconColor="#7C3AED"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="COMPLETED DELIVERABLES"
            value="12 / 16"
            subtitle="75% Completion Rate"
            icon={ChecklistRtlIcon}
            iconBgColor="#ECFDF5"
            iconColor="#16A34A"
            progress={75}
            accentColor="#16A34A"
          />
        </Grid>
      </Grid>

      {/* Team Roster DataTable */}
      <Card elevation={0} sx={{ p: 3, borderRadius: "12px", border: "1px solid #E2E8F0", bgcolor: "#FFFFFF", mb: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 600, color: "#111827" }}>
              Member Roster & Responsibilities
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748B" }}>
              Registered students in your assigned project squad
            </Typography>
          </Box>
          <StatusBadge status="active" label="Active Squad" />
        </Stack>

        <DataTable
          columns={columns}
          data={displayMembers}
          loading={loading}
          emptyTitle="No team members found"
          emptyDescription="You are currently not assigned to a team."
        />
      </Card>

      {/* Confirm Action Dialog */}
      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Remove Team Member"
        description="Are you sure you want to remove this member from the team roster?"
        confirmLabel="Remove Member"
        confirmColor="error"
        onConfirm={() => {
          showToast("Member removed", "info");
          setDeleteId(null);
        }}
        onClose={() => setDeleteId(null)}
      />
    </PageContent>
  );
}


