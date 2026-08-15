import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import PageHeader from "../../components/common/PageHeader";
import { PageContent } from "../../components/layout/AppLayout";
import { studentApi } from "../../services/studentApi";
import { teamApi } from "../../services/teamApi";
import { projectApi } from "../../services/projectApi";
import { taskApi } from "../../services/taskApi";
import { useToast } from "../../context/ToastContext";

import ProgressSummaryCards from "../../components/progress/ProgressSummaryCards";
import ProgressToolbar from "../../components/progress/ProgressToolbar";
import ProgressTable from "../../components/progress/ProgressTable";
import ProgressDetailsDialog from "../../components/progress/ProgressDetailsDialog";

export default function AdminProgress() {
  const [students, setStudents] = useState([]);
  const [teams, setTeams] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState("");
  const [teamFilter, setTeamFilter] = useState("all");
  const [projectFilter, setProjectFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Details Dialog State
  const [selectedProgressItem, setSelectedProgressItem] = useState(null);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);

  const { showToast } = useToast();
  const navigate = useNavigate();

  // Fetch all progress-related data from backend APIs
  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [studentsRes, teamsRes, projectsRes, tasksRes] = await Promise.allSettled([
        studentApi.getStudents({ limit: 100 }),
        teamApi.getTeams(),
        projectApi.getProjects(),
        taskApi.getTasks(),
      ]);

      if (studentsRes.status === "fulfilled" && studentsRes.value.success && studentsRes.value.data) {
        const raw = studentsRes.value.data;
        setStudents(Array.isArray(raw) ? raw : raw.students || []);
      }
      if (teamsRes.status === "fulfilled" && teamsRes.value.success && teamsRes.value.data) {
        setTeams(Array.isArray(teamsRes.value.data) ? teamsRes.value.data : []);
      }
      if (projectsRes.status === "fulfilled" && projectsRes.value.success && projectsRes.value.data) {
        setProjects(Array.isArray(projectsRes.value.data) ? projectsRes.value.data : []);
      }
      if (tasksRes.status === "fulfilled" && tasksRes.value.success && tasksRes.value.data) {
        setTasks(Array.isArray(tasksRes.value.data) ? tasksRes.value.data : []);
      }
    } catch (err) {
      setError(err?.message || "Failed to load progress data");
      showToast(err?.message || "Failed to load progress data", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Build synthesized Progress Data Model matching real backend entities
  const synthesizedProgressData = useMemo(() => {
    if (students.length === 0) {
      // Fallback: If no student profiles exist yet, map projects into progress items
      return projects.map((p) => {
        const pTeam = teams.find(
          (t) => (t._id || t.id) === (p.team?._id || p.team?.id || p.team || p.teamId)
        );
        const pTasks = tasks.filter(
          (t) => (t.project?._id || t.project?.id || t.project) === (p._id || p.id)
        );
        const completed = pTasks.filter((t) => t.status === "completed" || t.status === "done").length;
        const total = pTasks.length;
        const prog = Math.round(p.progress || (total > 0 ? (completed / total) * 100 : 0));
        let st = "pending";
        if (prog >= 100 || p.status === "completed") st = "completed";
        else if (prog > 0 || p.status === "in-progress" || p.status === "in_progress") st = "in_progress";

        return {
          id: p._id || p.id,
          studentId: null,
          studentName: pTeam?.name ? `${pTeam.name} Lead` : "Bootcamp Trainee",
          studentEmail: pTeam?.createdBy?.email || "trainee@saylani.com",
          teamName: pTeam?.name || "Unassigned Squad",
          projectId: p._id || p.id,
          projectName: p.name || p.title || "Untitled Project",
          projectDescription: p.description || "",
          completedTasks: completed,
          totalTasks: total,
          progressPercentage: prog,
          status: st,
          lastUpdated: p.updatedAt || p.createdAt,
          taskList: pTasks,
        };
      });
    }

    return students.map((s) => {
      const sId = (s._id || s.id)?.toString();
      const uId = (s.user?._id || s.user?.id || s.user)?.toString();

      // Find team containing this student
      const studentTeam = teams.find((t) =>
        t.members?.some((m) => {
          const mId = (m._id || m.id || m)?.toString();
          return mId === sId || mId === uId;
        })
      );
      const teamId = (studentTeam?._id || studentTeam?.id)?.toString();

      // Find project assigned to this team
      const studentProject = projects.find((p) => {
        const pTeamId = (p.team?._id || p.team?.id || p.team || p.teamId)?.toString();
        return pTeamId && pTeamId === teamId;
      });

      // Find tasks assigned to this student or team
      const studentTasks = tasks.filter((t) => {
        const assignId = (t.assignedTo?._id || t.assignedTo?.id || t.assignedTo)?.toString();
        const taskTeamId = (t.team?._id || t.team?.id || t.team)?.toString();
        return assignId === sId || assignId === uId || (taskTeamId && taskTeamId === teamId);
      });

      const completedTasks = studentTasks.filter(
        (t) => t.status === "completed" || t.status === "done"
      ).length;
      const totalTasks = studentTasks.length;

      let prog = 0;
      if (studentProject && typeof studentProject.progress === "number") {
        prog = Math.round(studentProject.progress);
      } else if (totalTasks > 0) {
        prog = Math.round((completedTasks / totalTasks) * 100);
      }

      let st = "pending";
      if (prog >= 100 || studentProject?.status === "completed") st = "completed";
      else if (prog > 0 || studentProject?.status === "in_progress" || totalTasks > 0) st = "in_progress";

      const studentName = s.name || s.user?.name || "Student Trainee";
      const studentEmail = s.email || s.user?.email || "student@saylani.com";

      return {
        id: s._id || s.id,
        studentId: s._id || s.id,
        studentName,
        studentEmail,
        teamName: studentTeam?.name || "No team",
        projectId: studentProject?._id || studentProject?.id || null,
        projectName: studentProject?.name || studentProject?.title || "No project",
        projectDescription: studentProject?.description || "",
        completedTasks,
        totalTasks,
        progressPercentage: prog,
        status: st,
        lastUpdated: s.updatedAt || studentProject?.updatedAt || s.createdAt,
        taskList: studentTasks,
      };
    });
  }, [students, teams, projects, tasks]);

  // Overall KPI Metrics Calculation
  const totalStudentsCount = students.length || synthesizedProgressData.length;
  const overallProgressAvg =
    synthesizedProgressData.length > 0
      ? synthesizedProgressData.reduce((acc, curr) => acc + curr.progressPercentage, 0) /
        synthesizedProgressData.length
      : 0;
  const completedProjectsCount = projects.filter(
    (p) => p.status === "completed" || (p.progress && p.progress >= 100)
  ).length;
  const pendingTasksCount = tasks.filter(
    (t) => t.status !== "completed" && t.status !== "done"
  ).length;

  // Filtered dataset calculation
  const filteredProgressData = useMemo(() => {
    return synthesizedProgressData.filter((item) => {
      // Search filter
      const matchesSearch =
        !search ||
        item.studentName.toLowerCase().includes(search.toLowerCase()) ||
        item.teamName.toLowerCase().includes(search.toLowerCase()) ||
        item.projectName.toLowerCase().includes(search.toLowerCase());

      // Team filter
      const matchesTeam = teamFilter === "all" || item.teamName === teamFilter;

      // Project filter
      const matchesProject = projectFilter === "all" || item.projectName === projectFilter;

      // Status filter
      const matchesStatus = statusFilter === "all" || item.status === statusFilter;

      return matchesSearch && matchesTeam && matchesProject && matchesStatus;
    });
  }, [synthesizedProgressData, search, teamFilter, projectFilter, statusFilter]);

  const handleClearFilters = () => {
    setSearch("");
    setTeamFilter("all");
    setProjectFilter("all");
    setStatusFilter("all");
  };

  const handleViewProgress = (item) => {
    setSelectedProgressItem(item);
    setOpenDetailsModal(true);
  };

  return (
    <PageContent px={{ xs: 2, sm: 3, md: 4 }}>
      {/* Page Header */}
      <PageHeader
        breadcrumbs={[{ label: "Dashboard", to: "/admin/dashboard" }, { label: "Progress" }]}
        title="Progress Management"
        description="Track and monitor student, team, and project bootcamp progress."
      />

      {/* Summary KPI Cards */}
      <ProgressSummaryCards
        loading={loading}
        totalStudents={totalStudentsCount}
        overallProgress={overallProgressAvg}
        completedProjectsCount={completedProjectsCount}
        pendingTasksCount={pendingTasksCount}
      />

      {/* Search & Filter Toolbar */}
      <ProgressToolbar
        search={search}
        onSearchChange={setSearch}
        teamFilter={teamFilter}
        onTeamFilterChange={setTeamFilter}
        projectFilter={projectFilter}
        onProjectFilterChange={setProjectFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        availableTeams={teams}
        availableProjects={projects}
        onClearFilters={handleClearFilters}
      />

      {/* Full-Width Progress Table */}
      <ProgressTable
        loading={loading}
        error={error}
        progressData={filteredProgressData}
        onRetry={fetchAllData}
        onViewProgress={handleViewProgress}
        onViewStudent={(studentId) => navigate(`/admin/students`)}
        onViewProject={(projectId) => navigate(`/admin/projects/${projectId}`)}
      />

      {/* Progress Details Dialog Modal */}
      <ProgressDetailsDialog
        open={openDetailsModal}
        onClose={() => {
          setOpenDetailsModal(false);
          setSelectedProgressItem(null);
        }}
        progressItem={selectedProgressItem}
      />
    </PageContent>
  );
}
