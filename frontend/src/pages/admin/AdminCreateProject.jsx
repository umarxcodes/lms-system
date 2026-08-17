import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Grid,
  TextField,
  MenuItem,
  CircularProgress,
  Divider,
  Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FolderIcon from "@mui/icons-material/FolderOutlined";
import EventIcon from "@mui/icons-material/EventOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import GroupIcon from "@mui/icons-material/GroupOutlined";
import { useNavigate } from "react-router-dom";

import PageHeader from "../../components/common/PageHeader";
import { PageContent } from "../../components/layout/AppLayout";
import { projectApi } from "../../services/projectApi";
import { teamApi } from "../../services/teamApi";
import { useToast } from "../../context/ToastContext";

export default function AdminCreateProject() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [teams, setTeams] = useState([]);
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    teamId: "",
    deadline: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    let isMounted = true;
    const fetchTeams = async () => {
      try {
        setLoadingTeams(true);
        const res = await teamApi.getTeams();
        if (isMounted && res.success && Array.isArray(res.data)) {
          setTeams(res.data);
          if (res.data.length > 0) {
            setFormData((prev) => ({
              ...prev,
              teamId: res.data[0]._id || res.data[0].id || "",
            }));
          }
        }
      } catch (err) {
        if (isMounted) {
          showToast(err?.message || "Failed to load teams list", "error");
        }
      } finally {
        if (isMounted) setLoadingTeams(false);
      }
    };

    fetchTeams();
    return () => {
      isMounted = false;
    };
  }, [showToast]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = "Project title is required";
    } else if (formData.title.trim().length < 2) {
      newErrors.title = "Title must be at least 2 characters";
    }

    if (!formData.teamId) {
      newErrors.teamId = "Team selection is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const payload = {
        title: formData.title.trim(),
        teamId: formData.teamId,
      };

      if (formData.description?.trim()) {
        payload.description = formData.description.trim();
      }

      if (formData.deadline) {
        payload.deadline = new Date(formData.deadline).toISOString();
      }

      const res = await projectApi.createProject(payload);
      showToast("Project created successfully!", "success");
      const createdId = res?.data?._id || res?.data?.id;
      if (createdId) {
        navigate(`/admin/projects/${createdId}`);
      } else {
        navigate("/admin/projects");
      }
    } catch (err) {
      showToast(err?.message || "Failed to create project. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageContent>
      <PageHeader
        title="Create Project"
        description="Assign a new capstone or module project to a student team."
        breadcrumbs={[
          { label: "Dashboard", to: "/admin/dashboard" },
          { label: "Projects", to: "/admin/projects" },
          { label: "Create Project" },
        ]}
        actions={
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/admin/projects")}
            sx={{ borderRadius: 2, bgcolor: "#ffffff" }}
          >
            Back to Projects
          </Button>
        }
      />

      <Box sx={{ maxWidth: 840, mx: "auto", mt: 1 }}>
        <Card
          elevation={0}
          sx={{
            borderRadius: 3,
            border: "1px solid #e2e8f0",
            bgcolor: "#ffffff",
          }}
        >
          <Box component="form" onSubmit={handleSubmit} noValidate>
            {/* Section 1: Project Information */}
            <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    bgcolor: "#eff6ff",
                    color: "#1e40af",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FolderIcon />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a", lineHeight: 1.2 }}>
                    Project Deliverable Details
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Essential title, scope, and objectives for the assigned team.
                  </Typography>
                </Box>
              </Stack>

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    label="Project Title"
                    placeholder="e.g. Saylani LMS Enterprise Web Portal"
                    fullWidth
                    required
                    value={formData.title}
                    onChange={(e) => {
                      setFormData({ ...formData, title: e.target.value });
                      if (errors.title) setErrors({ ...errors, title: null });
                    }}
                    error={Boolean(errors.title)}
                    helperText={errors.title || "Provide a descriptive title for this capstone project."}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Description"
                    placeholder="Provide a detailed overview of project requirements, features, and tech stack..."
                    fullWidth
                    multiline
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    helperText="Outline scope and expectations for the assigned student team."
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                    <GroupIcon fontSize="small" color="action" />
                    <Typography variant="subtitle2" fontWeight={700} color="#0f172a">
                      Assigned Team *
                    </Typography>
                  </Stack>

                  {loadingTeams ? (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1 }}>
                      <CircularProgress size={20} color="primary" />
                      <Typography variant="body2" color="text.secondary">
                        Loading teams list...
                      </Typography>
                    </Box>
                  ) : teams.length === 0 ? (
                    <Alert severity="warning" sx={{ borderRadius: 2 }}>
                      No teams available in the system. Create a team first before assigning a project.
                    </Alert>
                  ) : (
                    <TextField
                      select
                      fullWidth
                      required
                      value={formData.teamId}
                      onChange={(e) => {
                        setFormData({ ...formData, teamId: e.target.value });
                        if (errors.teamId) setErrors({ ...errors, teamId: null });
                      }}
                      error={Boolean(errors.teamId)}
                      helperText={errors.teamId || "Each team can own one active project."}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                    >
                      {teams.map((t) => (
                        <MenuItem key={t._id || t.id} value={t._id || t.id}>
                          <Stack direction="row" justifyContent="space-between" width="100%" alignItems="center">
                            <Typography variant="body2" fontWeight={700}>
                              {t.name}
                            </Typography>
                            {t.members && (
                              <Typography variant="caption" color="text.secondary">
                                {t.members.length} member{t.members.length === 1 ? "" : "s"}
                              </Typography>
                            )}
                          </Stack>
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                </Grid>
              </Grid>
            </CardContent>

            <Divider />

            {/* Section 2: Schedule & Deadline */}
            <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    bgcolor: "#f0fdf4",
                    color: "#16a34a",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <EventIcon />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a", lineHeight: 1.2 }}>
                    Schedule & Submission Deadline
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Optional target deadline for evaluation.
                  </Typography>
                </Box>
              </Stack>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Submission Deadline"
                    type="date"
                    fullWidth
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                    helperText="Set expected completion date."
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  />
                </Grid>
              </Grid>
            </CardContent>

            <Divider />

            {/* Form Actions */}
            <Box
              sx={{
                p: { xs: 2.5, sm: 3 },
                bgcolor: "#f8fafc",
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
              }}
            >
              <Button
                variant="outlined"
                disabled={submitting}
                onClick={() => navigate("/admin/projects")}
                sx={{ borderRadius: 2, px: 3, bgcolor: "#ffffff" }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={submitting || loadingTeams || teams.length === 0}
                startIcon={
                  submitting ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : (
                    <CheckCircleOutlinedIcon />
                  )
                }
                sx={{
                  borderRadius: 2,
                  px: 4,
                  fontWeight: 700,
                }}
              >
                {submitting ? "Creating Project..." : "Create Project"}
              </Button>
            </Box>
          </Box>
        </Card>
      </Box>
    </PageContent>
  );
}
