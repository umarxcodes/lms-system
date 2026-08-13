# BOOTCAMP LMS — FRONTEND API DOCUMENTATION

All API requests route to `/api/v1` via Vite proxy configuration in development.

## Endpoints Summary

### Authentication (`/api/v1/auth`)
- `POST /auth/login` — Authenticate email/password. Returns `{ success: true, data: { token, user } }`.
- `GET /auth/me` — Hydrate current user profile. Auth required.

### Student Management (`/api/v1/students`)
- `GET /students` — List students with pagination & search filter. (Admin only)
- `POST /students` — Create new student account. (Admin only)
- `GET /students/:id` — Get detailed student profile.
- `PUT /students/:id` — Update student profile. (Admin only)
- `DELETE /students/:id` — Delete student account. (Admin only)
- `GET /students/dashboard` — Get student dashboard statistics. (Student only)

### Attendance (`/api/v1/attendance`)
- `GET /attendance` — List daily attendance logs. (Admin only)
- `POST /attendance/mark` — Log attendance for student. (Admin only)
- `GET /attendance/my-attendance` — Get personal attendance logs. (Student only)

### Teams (`/api/v1/teams`)
- `GET /teams` — List all project teams.
- `POST /teams` — Create project team. (Admin only)
- `GET /teams/:id` — Get team details & member roster.
- `PUT /teams/:id` — Update team details. (Admin only)
- `DELETE /teams/:id` — Delete project team. (Admin only)
- `GET /teams/my-team` — Get personal assigned team. (Student only)

### Projects (`/api/v1/projects`)
- `GET /projects` — List capstone projects.
- `POST /projects` — Create project entry. (Admin only)
- `GET /projects/:id` — Get project detail breakdown.
- `PUT /projects/:id` — Update project. (Admin only)
- `DELETE /projects/:id` — Delete project. (Admin only)

### Tasks (`/api/v1/tasks`)
- `GET /tasks` — List backlog tasks.
- `POST /tasks` — Create task. (Admin only)
- `GET /tasks/my-tasks` — List assigned student tasks. (Student only)
- `PATCH /tasks/:id/status` — Update task status (`todo`, `in_progress`, `under_review`, `completed`).

### Notifications (`/api/v1/notifications`)
- `GET /notifications` — List system notifications.
- `POST /notifications` — Broadcast notification. (Admin only)
- `GET /notifications/unread/count` — Get unread count badge. (Student only)
- `PATCH /notifications/read-all` — Mark all notifications as read. (Student only)

### Reports (`/api/v1/reports`)
- `GET /reports/attendance` — Get attendance report summary.
- `GET /reports/assignments` — Get assignment submission report summary.
- `GET /reports/attendance/export.csv` — Download attendance CSV report.
- `GET /reports/assignments/export.csv` — Download assignments CSV report.

### Settings (`/api/v1/settings`)
- `GET /settings` — Get system/user settings.
- `PUT /settings` — Update preferences.
- `POST /settings/avatar` — Upload avatar image via Cloudinary service.
- `DELETE /settings/avatar` — Delete avatar image.
