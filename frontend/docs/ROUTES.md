# BOOTCAMP LMS — FRONTEND ROUTES MAP

## Public Routes
| Route | Component | Description | Access |
|---|---|---|---|
| `/login` | `LoginPage` | User authentication screen | Public |
| `/403` | `ForbiddenPage` | Access denied error page | Public |
| `/*` | `NotFoundPage` | 404 Page not found fallback | Public |

## Admin Routes (`/admin/*`)
*Requires `ProtectedRoute` + `RoleRoute (allowedRole="ADMIN")`*

| Route | Component | Description |
|---|---|---|
| `/admin/dashboard` | `AdminDashboard` | Admin analytics, KPI summary & due today tasks |
| `/admin/students` | `AdminStudents` | Trainee roster management, filters & account creation |
| `/admin/students/:id` | `AdminStudentDetail` | Trainee profile detail view with tabs |
| `/admin/attendance` | `AdminAttendance` | Daily attendance recorder & logs |
| `/admin/teams` | `AdminTeams` | Team list, capacity badges & creation modal |
| `/admin/teams/:id` | `AdminTeamDetail` | Team roster & member allocation |
| `/admin/projects` | `AdminProjects` | Capstone project tracking repository |
| `/admin/projects/:id` | `AdminProjectDetail` | Project detail & milestone progress |
| `/admin/tasks` | `AdminTasks` | Task deliverable backlog & assign modal |
| `/admin/progress` | `AdminProgress` | Student & team progress metrics center |
| `/admin/reports` | `AdminReports` | Report overview & CSV export center |
| `/admin/notifications` | `AdminNotifications` | System-wide broadcast announcement center |
| `/admin/settings` | `AdminSettings` | Admin profile, security & system settings |

## Student Routes (`/student/*`)
*Requires `ProtectedRoute` + `RoleRoute (allowedRole="STUDENT")`*

| Route | Component | Description |
|---|---|---|
| `/student/dashboard` | `StudentDashboard` | Personal summary & priority task alerts |
| `/student/profile` | `StudentProfile` | Personal profile & Cloudinary avatar manager |
| `/student/attendance` | `StudentAttendance` | Read-only personal attendance log & score |
| `/student/team` | `StudentTeam` | Assigned team roster & project details |
| `/student/projects` | `StudentProjects` | Team project deliverables & milestone status |
| `/student/tasks` | `StudentTasks` | Personal tasks with status update controls |
| `/student/progress` | `StudentProgress` | Attendance & deliverable progress bars |
| `/student/reports` | `StudentReports` | Individual student report card |
| `/student/notifications` | `StudentNotifications` | Personal notification inbox |
| `/student/settings` | `StudentSettings` | Account password & preferences management |
