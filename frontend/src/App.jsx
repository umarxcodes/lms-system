import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";

import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import ErrorBoundary from "./components/common/ErrorBoundary";

import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRoute from "./routes/RoleRoute";

import AppLayout from "./components/layout/AppLayout";
import LoginPage from "./pages/auth/LoginPage";
import ForbiddenPage from "./pages/auth/ForbiddenPage";
import NotFoundPage from "./pages/auth/NotFoundPage";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminStudentDetail from "./pages/admin/AdminStudentDetail";
import AdminAttendance from "./pages/admin/AdminAttendance";
import AdminTeams from "./pages/admin/AdminTeams";
import AdminTeamDetail from "./pages/admin/AdminTeamDetail";
import AdminProjects from "./pages/admin/AdminProjects";
import AdminCreateProject from "./pages/admin/AdminCreateProject";
import AdminProjectDetail from "./pages/admin/AdminProjectDetail";
import AdminTasks from "./pages/admin/AdminTasks";
import AdminProgress from "./pages/admin/AdminProgress";
import AdminReports from "./pages/admin/AdminReports";
import AdminNotifications from "./pages/admin/AdminNotifications";
import AdminSettings from "./pages/admin/AdminSettings";

// Student Pages
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentProfile from "./pages/student/StudentProfile";
import StudentAttendance from "./pages/student/StudentAttendance";
import StudentTeam from "./pages/student/StudentTeam";
import StudentProjects from "./pages/student/StudentProjects";
import StudentTasks from "./pages/student/StudentTasks";
import StudentProgress from "./pages/student/StudentProgress";
import StudentReports from "./pages/student/StudentReports";
import StudentNotifications from "./pages/student/StudentNotifications";
import StudentSettings from "./pages/student/StudentSettings";

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ToastProvider>
          <AuthProvider>
            <BrowserRouter>
              <Routes>
                {/* Public Route */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/403" element={<ForbiddenPage />} />

                {/* Root Redirect */}
                <Route path="/" element={<Navigate to="/login" replace />} />

                {/* Protected Layout Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route element={<AppLayout />}>
                    {/* Admin Portal Routes */}
                    <Route element={<RoleRoute allowedRole="ADMIN" />}>
                      <Route path="/admin/dashboard" element={<AdminDashboard />} />
                      <Route path="/admin/students" element={<AdminStudents />} />
                      <Route path="/admin/students/:id" element={<AdminStudentDetail />} />
                      <Route path="/admin/attendance" element={<AdminAttendance />} />
                      <Route path="/admin/teams" element={<AdminTeams />} />
                      <Route path="/admin/teams/:id" element={<AdminTeamDetail />} />
                      <Route path="/admin/projects" element={<AdminProjects />} />
                      <Route path="/admin/projects/create" element={<AdminCreateProject />} />
                      <Route path="/admin/projects/:id" element={<AdminProjectDetail />} />
                      <Route path="/admin/tasks" element={<AdminTasks />} />
                      <Route path="/admin/progress" element={<AdminProgress />} />
                      <Route path="/admin/reports" element={<AdminReports />} />
                      <Route path="/admin/notifications" element={<AdminNotifications />} />
                      <Route path="/admin/settings" element={<AdminSettings />} />
                    </Route>

                    {/* Student Portal Routes */}
                    <Route element={<RoleRoute allowedRole="STUDENT" />}>
                      <Route path="/student/dashboard" element={<StudentDashboard />} />
                      <Route path="/student/profile" element={<StudentProfile />} />
                      <Route path="/student/attendance" element={<StudentAttendance />} />
                      <Route path="/student/team" element={<StudentTeam />} />
                      <Route path="/student/projects" element={<StudentProjects />} />
                      <Route path="/student/tasks" element={<StudentTasks />} />
                      <Route path="/student/progress" element={<StudentProgress />} />
                      <Route path="/student/reports" element={<StudentReports />} />
                      <Route path="/student/notifications" element={<StudentNotifications />} />
                      <Route path="/student/settings" element={<StudentSettings />} />
                    </Route>
                  </Route>
                </Route>

                {/* Fallback 404 Route */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
