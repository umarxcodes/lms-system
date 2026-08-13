# Bootcamp LMS API

Base path: `/api/v1`

All endpoints return JSON. Successful responses follow the shape:

```json
{
  "success": true,
  "message": "...",
  "data": {}
}
```

Error responses follow the shape:

```json
{
  "success": false,
  "message": "..."
}
```

---

## Authentication

### POST /auth/login

Authenticate and receive a JWT.

**Request body:**

```json
{
  "email": "admin@example.com",
  "password": "AdminPass123!"
}
```

**Success response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { "id": "...", "name": "...", "email": "...", "role": "ADMIN" },
    "token": "..."
  }
}
```

**Errors:**

- `400` — Invalid request body
- `401` — Invalid email or password

### GET /auth/me

Return the authenticated user's safe profile.

**Headers:**

```http
Authorization: Bearer <token>
```

**Success response (200):**

```json
{
  "success": true,
  "message": "Authenticated user retrieved",
  "data": { "id": "...", "name": "...", "email": "...", "role": "ADMIN" }
}
```

**Errors:**

- `401` — Missing, invalid, or expired token

---

## Students

Student endpoints require `Bearer JWT` + `ADMIN` role unless noted.

| Method | Endpoint | Role | Purpose |
| --- | --- | --- | --- |
| POST | `/students/` | ADMIN | Create Student account + profile |
| GET | `/students/` | ADMIN | List all Students |
| GET | `/students/:id` | ADMIN or owning STUDENT | Get Student profile |
| PATCH | `/students/:id` | ADMIN | Update Student profile |
| PUT | `/students/:id` | ADMIN | Update Student profile (alias) |
| DELETE | `/students/:id` | ADMIN | Delete Student account |
| GET | `/students/me` | STUDENT | Get own Student profile |
| GET | `/students/dashboard` | STUDENT | Get Student portal dashboard |
| POST | `/students/me/avatar` | STUDENT | Upload profile image |
| DELETE | `/students/me/avatar` | STUDENT | Delete profile image |

**Create Student body:**

```json
{
  "name": "Student Name",
  "email": "student@example.com",
  "password": "SecurePass123!",
  "rollNumber": "AUDIT-001",
  "batch": "Batch 1",
  "phone": "03000000000",
  "address": "Address"
}
```

**Security:**

- A Student's `userId` is taken from the verified JWT, not from `req.body`.
- Students can only access their own profile (`/students/me`).
- Admin-only endpoints reject Students with `403`.

---

## Attendance

| Method | Endpoint | Role | Purpose |
| --- | --- | --- | --- |
| POST | `/attendance/` | ADMIN | Mark attendance |
| POST | `/attendance/mark` | ADMIN | Mark attendance (legacy alias) |
| GET | `/attendance/` | ADMIN | List attendance with filters |
| GET | `/attendance/me` | STUDENT | Get own attendance |
| GET | `/attendance/student/:studentId` | ADMIN | Get Student attendance |
| GET | `/attendance/date/:date` | ADMIN | Get attendance by date |
| GET | `/attendance/:id` | ADMIN or owning STUDENT | Get attendance record |
| PATCH | `/attendance/:id` | ADMIN | Update attendance |

**Mark attendance body:**

```json
{
  "studentId": "...",
  "date": "2026-08-13",
  "status": "present",
  "notes": "Optional note"
}
```

**Business rule:** One attendance record per Student per calendar date. Duplicate submissions return `409`.

---

## Teams

| Method | Endpoint | Role | Purpose |
| --- | --- | --- | --- |
| POST | `/teams/` | ADMIN | Create Team |
| GET | `/teams/` | ADMIN | List Teams (supports `?search=`) |
| GET | `/teams/me` | STUDENT | Get own Team |
| GET | `/teams/:id` | ADMIN or member STUDENT | Get Team |
| POST | `/teams/:id/members` | ADMIN | Add Student to Team |
| DELETE | `/teams/:id/members/:memberId` | ADMIN | Remove Student from Team |
| GET | `/teams/:id/members` | ADMIN or member STUDENT | Get Team members |
| PATCH | `/teams/:id` | ADMIN | Update Team |
| DELETE | `/teams/:id` | ADMIN | Delete Team |

**Business rules:**

- A Student can belong to only one Team at a time.
- A Team cannot be deleted while it has a Project or members.
- All members must be existing STUDENT users.

---

## Projects

| Method | Endpoint | Role | Purpose |
| --- | --- | --- | --- |
| POST | `/projects/` | ADMIN | Create Project |
| GET | `/projects/` | ADMIN | List all Projects |
| GET | `/projects/me` | STUDENT | Get own Team's Projects |
| GET | `/projects/:id` | ADMIN or member STUDENT | Get Project |
| PATCH | `/projects/:id/status` | ADMIN | Update Project status |
| PATCH | `/projects/:id` | ADMIN | Update Project |
| DELETE | `/projects/:id` | ADMIN | Delete Project |

**Business rules:**

- Each Team can own only one Project.
- Projects cannot be deleted while they have Tasks.
- Students access Projects through Team membership, not direct assignment.

---

## Tasks

| Method | Endpoint | Role | Purpose |
| --- | --- | --- | --- |
| POST | `/tasks/` | ADMIN | Create Task |
| GET | `/tasks/` | ADMIN | List all Tasks |
| GET | `/tasks/me` | STUDENT | Get own Team's Tasks |
| GET | `/tasks/my-assigned` | STUDENT | Get Tasks assigned to me |
| GET | `/tasks/:id` | ADMIN or member STUDENT | Get Task |
| PATCH | `/tasks/:id/status` | ADMIN | Update Task status |
| PATCH | `/tasks/:id/assign` | ADMIN | Assign Task to Student |
| PATCH | `/tasks/:id` | ADMIN | Update Task |
| DELETE | `/tasks/:id` | ADMIN | Delete Task |

**Business rules:**

- A Task must belong to a Project.
- A Student can only be assigned to a Task if they belong to the Project's Team.
- Students see Tasks through Team membership.

---

## Reports

| Method | Endpoint | Role | Purpose |
| --- | --- | --- | --- |
| GET | `/reports/me` | STUDENT | Get own progress report |
| GET | `/reports/attendance` | ADMIN | Attendance report |
| GET | `/reports/attendance/export.csv` | ADMIN | Export attendance CSV |
| GET | `/reports/assignments` | ADMIN | Assignment report |
| GET | `/reports/assignments/export.csv` | ADMIN | Export assignment CSV |
| GET | `/reports/students/:studentId` | ADMIN | Single Student report |

**CSV export:**

- Attendance CSV columns: Date, Status, Roll number, Student, Email, Notes
- Assignment CSV columns: Task, Project, Status, Priority, Deadline, Assigned student, Email
- Values containing `=`, `+`, `-`, or `@` are wrapped in quotes to prevent CSV injection.

---

## Notifications

| Method | Endpoint | Role | Purpose |
| --- | --- | --- | --- |
| POST | `/notifications/announcements` | ADMIN | Send announcement to Students |
| GET | `/notifications/me` | STUDENT | Get own notifications |
| GET | `/notifications/unread` | STUDENT | Get unread notifications |
| GET | `/notifications/unread/count` | STUDENT | Get unread count |
| PATCH | `/notifications/read-all` | STUDENT | Mark all as read |
| PATCH | `/notifications/:id/read` | STUDENT | Mark one as read |
| DELETE | `/notifications/:id` | STUDENT | Delete notification |

**Security:** Students can only access their own notifications. The `recipient` field is never client-supplied.

---

## Admin Settings

All settings endpoints require `Bearer JWT` + `ADMIN` role.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/settings/profile` | Get Admin profile |
| PATCH | `/settings/profile` | Update Admin profile |
| POST | `/settings/profile/avatar` | Upload Admin profile image |
| DELETE | `/settings/profile/avatar` | Delete Admin profile image |
| PATCH | `/settings/password` | Change Admin password |
| GET | `/settings/application` | Get application settings |
| PATCH | `/settings/application` | Update application settings |
| GET | `/settings/notifications` | Get notification preferences |
| PATCH | `/settings/notifications` | Update notification preferences |
| GET | `/settings/security` | Get security metadata |

**Protected fields:**

- `role` cannot be changed via the API.
- `password` and `passwordHash` are never returned.
- `publicId` is stripped from profile image responses.

---

## Dashboard

| Method | Endpoint | Role | Purpose |
| --- | --- | --- | --- |
| GET | `/admin/dashboard` | ADMIN | Get dashboard statistics |

**Response includes:**

- Summary: total students, present/absent today, total teams, pending tasks
- Attendance breakdown for today
- Task status breakdown
- Tasks due today
- Recent students (last 5)
- Recent teams (last 5) with member counts
