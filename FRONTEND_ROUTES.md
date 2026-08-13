# BOOTCAMP LMS — FRONTEND ROUTES MAP

## Public Routes
| Route | Component | Description | Access |
|---|---|---|---|
| `/login` | `LoginPage` | User login screen | Public |
| `/403` | `ForbiddenPage` | Access denied error page | Public |
| `/*` | `NotFoundPage` | 404 Page not found | Public |

## Admin Routes (`/admin/*`)
*Requires `ProtectedRoute` + `RoleRoute (allowedRole="ADMIN")`*

| Route | Component | Description |
|---|---|---|
| `/admin/dashboard` | `AdminDashboard` | Admin analytics & system summary |
| `/admin/students` | `AdminStudents` | Student roster management & account creation |
| `/admin/students/:id` | `AdminStudentDetail` | Student profile detail view |
| `/admin/attendance` | `AdminAttendance` | Daily attendance logging & history |
| `/admin/teams` | `AdminTeams` | Team list & creation |
| `/admin/teams/:id` | `AdminTeamDetail` | Team roster & member allocation |
| `/admin/projects` | `AdminProjects` | Capstone project tracking |
| `/admin/projects/:id` | `AdminProjectDetail` | Project detail & milestone progress |
| `/admin/tasks` | `AdminTasks` | Task deliverable backlog |
| `/admin/progress` | `AdminProgress` | Student & team progress metrics |
| `/admin/reports` | `AdminReports` | Report overview & CSV exports |
| `/admin/notifications` | `AdminNotifications` | System-wide broadcast notifications |
| `/admin/settings` | `AdminSettings` | Admin settings & profile management |

## Student Routes (`/student/*`)
*Requires `ProtectedRoute` + `RoleRoute (allowedRole="STUDENT")`*

| Route | Component | Description |
|---|---|---|
| `/student/dashboard` | `StudentDashboard` | Personal summary & priority tasks |
| `/student/profile` | `StudentProfile` | Personal profile & Cloudinary avatar |
| `/student/attendance` | `StudentAttendance` | Read-only personal attendance log |
| `/student/team` | `StudentTeam` | Assigned team roster & project details |
| `/student/projects` | `StudentProjects` | Team project details & demo links |
| `/student/tasks` | `StudentTasks` | Personal tasks with status update controls |
| `/student/progress` | `StudentProgress` | Attendance & deliverable progress bars |
| `/student/reports` | `StudentReports` | Individual student report card |
| `/student/notifications` | `StudentNotifications` | Personal notification inbox |
| `/student/settings` | `StudentSettings` | Account password management |
