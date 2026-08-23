# BOOTCAMP LMS — FRONTEND API DOCUMENTATION

All API requests route to `/api/v1` via Vite proxy configuration in development or `VITE_API_BASE_URL` in production.

## HTTP Client & Interceptor Architecture

- **Client**: Axios instance configured in `src/services/api.js`.
- **Request Interceptor**: Automatically attaches `Authorization: Bearer <token>` from `localStorage` (`lms_token`).
- **Response Interceptor**: Intercepts `401 Unauthorized` responses and emits a global `auth:unauthorized` window event, initiating a clean logout without redirect loops.

---

## Endpoints Summary

### Authentication (`/api/v1/auth`)
- `POST /auth/login` — Authenticate email/password. Returns `{ success: true, data: { token, user } }`.
- `GET /auth/me` — Hydrate current user profile. Auth required.

### Student Management (`/api/v1/students`)
- `GET /students` — List students with pagination & search filter. (Admin only)
- `POST /students` — Create new student account. (Admin only)
- `GET /students/:id` — Get detailed student profile. (Admin or owning Student)
- `PUT /students/:id` — Update student profile. (Admin only)
- `DELETE /students/:id` — Delete student account. (Admin only)
- `GET /students/me` — Get own student profile. (Student only)
- `GET /students/dashboard` — Get student portal dashboard statistics. (Student only)
- `POST /students/me/avatar` — Upload profile avatar to Cloudinary. (Student only)
- `DELETE /students/me/avatar` — Delete profile avatar. (Student only)

### Attendance (`/api/v1/attendance`)
- `GET /attendance` — List daily attendance logs with date & status filters. (Admin only)
- `POST /attendance` — Log attendance for student. (Admin only)
- `POST /attendance/mark` — Log attendance for student (legacy endpoint). (Admin only)
- `GET /attendance/me` — Get personal attendance logs. (Student only)
- `GET /attendance/student/:studentId` — Get student attendance history. (Admin only)
- `GET /attendance/date/:date` — Get attendance by calendar date. (Admin only)
- `PATCH /attendance/:id` — Update attendance record status. (Admin only)

### Teams (`/api/v1/teams`)
- `GET /teams` — List all project teams. (Admin only)
- `POST /teams` — Create project team. (Admin only)
- `GET /teams/:id` — Get team details & member roster.
- `PATCH /teams/:id` — Update team details. (Admin only)
- `DELETE /teams/:id` — Delete project team. (Admin only)
- `GET /teams/me` — Get personal assigned team. (Student only)
- `POST /teams/:id/members` — Add student member to team. (Admin only)
- `DELETE /teams/:id/members/:memberId` — Remove member from team. (Admin only)

### Projects (`/api/v1/projects`)
- `GET /projects` — List capstone projects. (Admin only)
- `POST /projects` — Create project entry. (Admin only)
- `GET /projects/:id` — Get project detail breakdown.
- `PATCH /projects/:id` — Update project details. (Admin only)
- `PATCH /projects/:id/status` — Update project status (`pending`, `in-progress`, `completed`). (Admin only)
- `DELETE /projects/:id` — Delete project. (Admin only)
- `GET /projects/me` — Get personal team project. (Student only)

### Tasks (`/api/v1/tasks`)
- `GET /tasks` — List backlog tasks. (Admin only)
- `POST /tasks` — Create task. (Admin only)
- `GET /tasks/:id` — Get task details.
- `PATCH /tasks/:id` — Update task details. (Admin only)
- `PATCH /tasks/:id/status` — Update task status (`todo`, `in-progress`, `done`).
- `PATCH /tasks/:id/assign` — Assign task to team member. (Admin only)
- `DELETE /tasks/:id` — Delete task. (Admin only)
- `GET /tasks/me` — List team tasks. (Student only)
- `GET /tasks/my-assigned` — List personal assigned tasks. (Student only)

### Notifications (`/api/v1/notifications`)
- `GET /notifications/me` — List personal system notifications. (Student only)
- `POST /notifications/announcements` — Broadcast notification to students. (Admin only)
- `GET /notifications/unread` — List unread notifications. (Student only)
- `GET /notifications/unread/count` — Get unread count badge. (Student only)
- `PATCH /notifications/read-all` — Mark all notifications as read. (Student only)
- `PATCH /notifications/:id/read` — Mark single notification as read. (Student only)
- `DELETE /notifications/:id` — Delete notification. (Student only)

### Reports (`/api/v1/reports`)
- `GET /reports/attendance` — Get attendance report summary. (Admin only)
- `GET /reports/assignments` — Get assignment submission report summary. (Admin only)
- `GET /reports/attendance/export.csv` — Download attendance CSV report. (Admin only)
- `GET /reports/assignments/export.csv` — Download assignments CSV report. (Admin only)
- `GET /reports/students/:studentId` | Single student report breakdown. (Admin only)
- `GET /reports/me` — Authenticated student personal progress report. (Student only)

### Settings (`/api/v1/settings`)
- `GET /settings/profile` — Get Admin profile. (Admin only)
- `PATCH /settings/profile` — Update Admin profile. (Admin only)
- `POST /settings/profile/avatar` — Upload Admin profile image. (Admin only)
- `DELETE /settings/profile/avatar` — Delete Admin profile image. (Admin only)
- `PATCH /settings/password` — Change Admin password. (Admin only)
- `GET /settings/application` — Get application preferences. (Admin only)
- `PATCH /settings/application` — Update application preferences. (Admin only)
- `GET /settings/notifications` — Get notification preferences. (Admin only)
- `PATCH /settings/notifications` — Update notification preferences. (Admin only)
- `GET /settings/security` — Get security metadata. (Admin only)
- `GET /admin/dashboard` — Get admin dashboard stats & due today tasks. (Admin only)
