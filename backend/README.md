# Bootcamp LMS Backend

## Project Overview

The Bootcamp LMS backend provides role-based administration for Students, Attendance, Teams, Projects, Tasks, and an Admin Dashboard. `ADMIN` users manage LMS data; `STUDENT` users can authenticate and access only their own Student profile.

## Technology Stack

- Node.js and Express 5
- MongoDB with Mongoose
- JSON Web Tokens (`jsonwebtoken`)
- bcrypt password hashing
- Zod request validation
- Yarn 4

## Project Structure

```text
src/
  config/          environment and database connection
  middlewares/     authentication, authorization, errors
  modules/         feature modules (auth, students, attendance, teams, projects, tasks, dashboard, reports, notifications, settings)
  services/        startup services, including initial Admin seeding
  utils/           JWT, password, response, and error helpers
  app.js           Express configuration and route registration
  server.js        database startup and HTTP listener
```

## Installation and Development

```bash
git clone <repository-url>
cd Saylani-Bootcamp-LMS4/backend
yarn install
cp .env.example .env
yarn dev
```

For production-style startup, run `yarn start`.

## Environment Variables

```env
MONGO_URI=mongodb+srv://username:password@cluster0.mongodb.net/lms
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development
DASHBOARD_TIMEZONE=Asia/Karachi
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Optional development-only initial Admin seed; set all three together.
ADMIN_NAME=Bootcamp Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=replace_with_a_strong_development_password
```

Never commit `.env`. It is ignored by Git; `.env.example` contains placeholders only.

## Authentication and Roles

`POST /api/v1/auth/login` authenticates either role and returns a safe user object plus a JWT. The token contains only `userId` and `role`. Passwords and password hashes are never returned.

Use protected endpoints with:

```http
Authorization: Bearer <token>
```

- `ADMIN`: full authorized LMS management and dashboard access.
- `STUDENT`: own profile only through `GET /api/v1/students/me`.

The startup seed exists only to bootstrap the first trusted development Admin. It is not a public registration mechanism. Stateless JWT logout is performed client-side by removing the stored token; token revocation requires a future blacklist/session design.

## API Modules

### Auth

| Method | Endpoint | Role | Purpose |
| --- | --- | --- | --- |
| POST | `/api/v1/auth/login` | Public | Login Admin or Student |
| GET | `/api/v1/auth/me` | Authenticated | Safe current-user information |

### Dashboard

| Method | Endpoint | Role | Purpose |
| --- | --- | --- | --- |
| GET | `/api/v1/admin/dashboard` | Admin | Database-derived LMS summary |

### Admin Settings

Admin Settings endpoints require an Admin JWT and derive ownership from the authenticated token. Students receive `403`, and unauthenticated requests receive `401`. Profile and password operations reuse the existing `User` model; application and notification preferences are stored in one Admin-owned Settings document. Secrets such as `JWT_SECRET`, `MONGO_URI`, password hashes, tokens, and environment variables are never returned or editable through Settings.

| Method | Endpoint | Role | Purpose |
| --- | --- | --- | --- |
| GET | `/api/v1/settings/profile` | Admin | Safe Admin profile |
| PATCH | `/api/v1/settings/profile` | Admin | Update Admin `name` and/or `email` |
| POST | `/api/v1/settings/profile/avatar` | Admin | Upload or replace own profile image |
| DELETE | `/api/v1/settings/profile/avatar` | Admin | Delete own profile image |
| PATCH | `/api/v1/settings/password` | Admin | Change password using current password verification |
| GET | `/api/v1/settings/application` | Admin | Admin application preferences |
| PATCH | `/api/v1/settings/application` | Admin | Update supported application preferences |
| GET | `/api/v1/settings/notifications` | Admin | Admin notification preferences |
| PATCH | `/api/v1/settings/notifications` | Admin | Update notification preferences |
| GET | `/api/v1/settings/security` | Admin | Supported security metadata |

Profile updates accept only `name` and `email`; duplicate emails return `409`. Password changes require `currentPassword`, `newPassword`, and `confirmPassword`; the new password must be at least 8 characters and match confirmation. Application settings support `applicationName`, `timezone`, `dateFormat` (`YYYY-MM-DD`, `DD-MM-YYYY`, `MM-DD-YYYY`), and `defaultPageSize` from 1 to 100. Notification preferences support boolean `emailNotifications`, `taskNotifications`, `attendanceNotifications`, `projectNotifications`, and `systemNotifications`. Protected fields such as `role`, `adminId`, `passwordHash`, `createdAt`, and `updatedAt` are rejected by strict validation.

Profile image upload uses `multipart/form-data` with a single file field named `avatar`.

### Students

| Method | Endpoint | Role | Purpose |
| --- | --- | --- | --- |
| POST | `/api/v1/students` | Admin | Create linked Student login and profile |
| GET | `/api/v1/students` | Admin | List Students |
| GET | `/api/v1/students/me` | Student | Own profile, derived from JWT |
| POST | `/api/v1/students/me/avatar` | Student | Upload or replace own profile image |
| DELETE | `/api/v1/students/me/avatar` | Student | Delete own profile image |
| GET | `/api/v1/students/:id` | Admin / owning Student | Get one Student |
| PATCH | `/api/v1/students/:id` | Admin | Update Student profile |
| DELETE | `/api/v1/students/:id` | Admin | Delete an unreferenced Student |

`PUT /api/v1/students/:id` remains available as a compatibility alias for `PATCH`.

### Profile Image Management

Profile images are stored in Cloudinary under the `bootcamp-lms/profiles` folder. MongoDB stores only image metadata on the existing `User` document:

```json
{
  "profileImage": {
    "url": "https://res.cloudinary.com/.../image/upload/...",
    "publicId": "bootcamp-lms/profiles/..."
  }
}
```

API responses expose only `profileImage.url`; Cloudinary credentials and `publicId` are not returned to clients. Uploads accept one `avatar` file, up to 2MB, with JPEG/JPG, PNG, or WEBP content. The backend validates MIME type and image file signature; PDFs, SVG, GIF, archives, scripts, and unknown file types are rejected.

Admins manage only their own image through Admin Settings. Students manage only their own image through `/api/v1/students/me/avatar`; the backend ignores request-supplied ownership fields and derives ownership from the verified JWT. Replacing an image uploads the new asset first, updates MongoDB, then deletes the old Cloudinary asset. Deleting uses the stored Cloudinary `publicId`.

### Attendance

Attendance belongs to a Student profile. Admins manage records; Students can read only records resolved through their authenticated Student profile. One record is allowed per Student per LMS day.

| Method | Endpoint | Role | Purpose |
| --- | --- | --- | --- |
| POST | `/api/v1/attendance` | Admin | Mark Student attendance |
| POST | `/api/v1/attendance/mark` | Admin | Legacy-compatible mark endpoint |
| GET | `/api/v1/attendance` | Admin | List/filter attendance |
| GET | `/api/v1/attendance/me` | Student | Own attendance history |
| GET | `/api/v1/attendance/student/:studentId` | Admin | Student attendance history |
| GET | `/api/v1/attendance/date/:date` | Admin | Attendance for `YYYY-MM-DD` |
| GET | `/api/v1/attendance/:id` | Admin / owning Student | Get one attendance record |
| PATCH | `/api/v1/attendance/:id` | Admin | Update attendance record |

Mark attendance request:

```json
{
  "studentId": "Student-profile ObjectId",
  "date": "2026-08-10",
  "status": "present",
  "notes": "Optional"
}
```

Supported statuses are `present`, `absent`, `leave`, and legacy-compatible `late`. Admin list filters are optional `studentId`, `status`, `date`, `startDate`, and `endDate`. Dates are normalized to the configured `DASHBOARD_TIMEZONE`; duplicate Student-plus-day submissions return `409`.

### Teams

`Team.members` is the membership source of truth and stores linked Student User IDs. A Student can belong to one Team only. Admins manage Teams; Students can read only their own Team and its members.

| Method | Endpoint | Role | Purpose |
| --- | --- | --- | --- |
| POST | `/api/v1/teams` | Admin | Create Team; creator is derived from JWT |
| GET | `/api/v1/teams` | Admin | List/search Teams |
| GET | `/api/v1/teams/me` | Student | Own Team, derived from JWT |
| GET | `/api/v1/teams/:id` | Admin / owning Student | Get Team |
| PATCH | `/api/v1/teams/:id` | Admin | Update Team |
| DELETE | `/api/v1/teams/:id` | Admin | Delete Team without Projects or members |
| POST | `/api/v1/teams/:id/members` | Admin | Add Student member |
| DELETE | `/api/v1/teams/:id/members/:memberId` | Admin | Remove member |
| GET | `/api/v1/teams/:id/members` | Admin / owning Student | List Team members |

Create/update bodies accept only `name` and optional `description`. Member addition accepts `{ "studentId": "Student-profile ObjectId" }`; `{ "memberId": "Student User ObjectId" }` remains accepted for compatibility. `GET /api/v1/teams?search=alpha` searches Team names. Duplicate Team names, duplicate membership, and assignment to another Team return `409`.

### Projects

Project Management connects one Team to one Project. Admins create and manage Projects; Students have read-only access to the Project associated with the Team derived from their verified JWT. Project data includes `title`, optional `description`, `team`, `status`, and optional ISO-8601 `deadline`. Supported statuses are `pending`, `in-progress`, and `completed`.

`GET /api/v1/projects/me` never accepts a Team ID from the client. The API resolves Team membership from `Team.members`, while `GET /api/v1/projects/:id` verifies that the requested Project's Team contains the authenticated Student. These checks prevent cross-Team IDOR access. Project creation rejects an unknown Team and a Team that already has a Project. Updates use strict allow-listed validation, so Team ownership and internal fields cannot be mass assigned.

Tasks reference Projects. A Project cannot be deleted while Tasks reference it; the API does not perform undocumented cascade deletion. Archiving, start dates, and calculated progress are not implemented because the current Project schema does not define them.

| Method | Endpoint | Role | Purpose |
| --- | --- | --- | --- |
| POST | `/api/v1/projects` | Admin | Create Project for Team |
| GET | `/api/v1/projects` | Admin | List Projects |
| GET | `/api/v1/projects/me` | Student | List Projects for the authenticated student's Team |
| GET | `/api/v1/projects/:id` | Admin / Student | Admin can view any Project; Students can view only their Team's Project |
| PATCH | `/api/v1/projects/:id` | Admin | Update Project |
| PATCH | `/api/v1/projects/:id/status` | Admin | Update Project status |
| DELETE | `/api/v1/projects/:id` | Admin | Delete Project without Tasks |

### Tasks

Tasks belong to one Project, and Projects belong to Teams. Admins can create, update, assign, change status, and delete Tasks. A Task may be assigned to one Student User; assignment is accepted only when that User has the `STUDENT` role and belongs to the Project's Team. This prevents cross-Team assignments.

Students have read-only Task access. `GET /api/v1/tasks/me` returns all Tasks for Projects owned by the authenticated Student's Team, while `GET /api/v1/tasks/my-assigned` returns only the subset assigned to that Student. `GET /api/v1/tasks/:id` uses the same server-side Team/Project ownership check and rejects another Team's Task with `403`. No Student Task update endpoint is implemented because the current requirements do not define Student-editable Task fields.

Task fields are `title`, optional `description`, `project`, optional `assignedTo`, `status`, `priority`, and optional ISO-8601 `deadline`. Statuses are `todo`, `in-progress`, and `done`; priorities are `low`, `medium`, and `high`. Progress and archiving are not implemented because they are not defined in the Task model. All task write bodies use strict allow-listed validation.

| Method | Endpoint | Role | Purpose |
| --- | --- | --- | --- |
| POST | `/api/v1/tasks` | Admin | Create Task for Project |
| GET | `/api/v1/tasks` | Admin | List Tasks |
| GET | `/api/v1/tasks/me` | Student | List Tasks for the authenticated Student's Team Projects |
| GET | `/api/v1/tasks/my-assigned` | Student | List authorized Tasks assigned to the authenticated Student |
| GET | `/api/v1/tasks/:id` | Admin / owning Student | Get Task |
| PATCH | `/api/v1/tasks/:id` | Admin | Update Task |
| PATCH | `/api/v1/tasks/:id/status` | Admin | Update Task status |
| PATCH | `/api/v1/tasks/:id/assign` | Admin | Assign to Student User |
| DELETE | `/api/v1/tasks/:id` | Admin | Delete Task |

Create body: `{ "title": "Build authentication", "projectId": "Project ObjectId", "assignedTo": "Student User ObjectId" }`. Assignment uses `{ "userId": "Student User ObjectId" }`. Invalid IDs, unknown Projects or Students, invalid statuses/priorities/dates, unknown body fields, and cross-Team assignments are rejected with client errors.

## Security

- Passwords use bcrypt and are selected only during authentication.
- JWT verification is required before all protected routes.
- `requireRole` enforces role-based authorization.
- Student identity is resolved from verified JWT claims, not request-supplied Student IDs.
- Student Project reads verify Team membership server-side to prevent cross-Team IDOR access.
- Student Task reads derive Team ownership from the verified JWT and the Task Project, preventing cross-Team IDOR access.
- Admin Settings derive ownership from the verified Admin JWT and reject protected-field mass assignment.
- Profile image upload/delete derives ownership from the verified JWT and stores only Cloudinary URL/publicId metadata in MongoDB.
- Admin creation is restricted to the trusted environment-driven seed.
- Deletion blocks when documented related records would be left inconsistent; no undocumented cascade deletion is performed.

## Student Portal

Student Portal endpoints reuse the existing Student, Attendance, Team, Project, and Task modules. Every endpoint requires a Student JWT and resolves identity from its verified `userId`; no endpoint accepts a client-supplied Student or Team ID as ownership proof.

| Method | Endpoint | Role | Purpose |
| --- | --- | --- | --- |
| GET | `/api/v1/students/me` | Student | Own profile |
| GET | `/api/v1/students/dashboard` | Student | Own profile, attendance summary, Team, Projects, Tasks, and assigned Tasks |
| GET | `/api/v1/attendance/me` | Student | Own attendance records |
| GET | `/api/v1/teams/me` | Student | Own Team and safe member details |
| GET | `/api/v1/projects/me` | Student | Own Team's Projects |
| GET | `/api/v1/tasks/me` | Student | Tasks accessible through own Team Projects |
| GET | `/api/v1/tasks/my-assigned` | Student | Authorized Tasks assigned to the Student |

The dashboard's attendance summary exposes the existing `present`, `absent`, `leave`, and `late` counts plus a total. It intentionally does not calculate attendance percentage or Progress because neither has a documented calculation rule or dedicated data model. Project and Task detail endpoints also perform server-side Team ownership checks.

## Progress and Reports

Reports aggregate the existing Attendance, Student, Team, Project, and Task data; they do not introduce duplicate records or calculated fields on Project or Task documents. All administrative report routes require an Admin JWT. `GET /api/v1/reports/me` is Student-only and derives the Student profile from the verified JWT.

| Method | Endpoint | Role | Purpose |
| --- | --- | --- | --- |
| GET | `/api/v1/reports/attendance` | Admin | Attendance records and status totals |
| GET | `/api/v1/reports/attendance/export.csv` | Admin | Download attendance CSV, compatible with Excel |
| GET | `/api/v1/reports/assignments` | Admin | Task-assignment records and Task status totals |
| GET | `/api/v1/reports/assignments/export.csv` | Admin | Download task-assignment CSV, compatible with Excel |
| GET | `/api/v1/reports/students/:studentId` | Admin | One Student's attendance, Team, Projects, and Task status counts |
| GET | `/api/v1/reports/me` | Student | Authenticated Student's own progress report |

Attendance report query parameters are optional `studentId`, `status`, `date`, `startDate`, and `endDate`. Assignment report query parameters are optional `projectId`, `assignedTo` (Student User ObjectId), `status`, and `priority`. All query parameters are strictly validated.

Progress consists of existing, directly measurable counts: attendance by its stored status and Tasks by `todo`, `in-progress`, and `done`, including the number assigned to the reported Student. Attendance percentage is intentionally not calculated because the application has no documented policy for whether `late` or `leave` count as attended. Likewise, no Project percentage is persisted or inferred from Task counts.

Quiz reports are unavailable because there is no Quiz, Assignment-submission, or grading data model. The application exports CSV files that Excel can open; true `.xlsx` and PDF exports are not implemented because no export library or output format is configured.

## Notifications

Notifications are stored per recipient User and use the documented stable types: `ANNOUNCEMENT`, `ASSIGNMENT`, `QUIZ`, and `PROJECT`. The response includes `type`, `title`, `message`, `isRead`, and `createdAt`; the frontend uses these fields to render its icon, unread indicator, and Today/Earlier grouping. The API defaults to newest-first ordering and never stores a time-dependent display group.

| Method | Endpoint | Role | Purpose |
| --- | --- | --- | --- |
| POST | `/api/v1/notifications/announcements` | Admin | Send an announcement to explicitly selected Student Users |
| GET | `/api/v1/notifications/me` | Student | Paginated own notifications |
| GET | `/api/v1/notifications/unread` | Student | Paginated own unread notifications |
| GET | `/api/v1/notifications/unread/count` | Student | Own unread count |
| PATCH | `/api/v1/notifications/read-all` | Student | Mark all own unread notifications as read |
| PATCH | `/api/v1/notifications/:id/read` | Student | Mark one own notification as read |
| DELETE | `/api/v1/notifications/:id` | Student | Delete one own notification |

List endpoints accept optional `page` (default `1`), `limit` (default `20`, maximum `100`), and `type`. They return `{ items, pagination }`. Announcement creation accepts `{ "title": "...", "message": "...", "recipientIds": ["Student User ObjectId"] }`; it intentionally requires explicit recipients rather than assuming a system-wide broadcast.

Project creation, Project updates/status changes, and Task assignment use the Notification service to create supported alerts. Project alerts are sent to the Project Team members; assignment alerts are sent to the assigned Student User. Student notification reads and mutations query by both notification ID and verified JWT recipient, preventing IDOR and recipient manipulation.

There is no Quiz module, Assignment-submission module, scheduled-job system, or Student notification-preferences model. Therefore, Quiz alerts, deadline reminders, and preference management are not implemented.

## Testing

The repository includes a database-backed API smoke test that creates dummy data in a dedicated MongoDB database, verifies authentication, RBAC, Student ownership, CRUD paths, reports, notifications, CSV exports, and cleanup behavior, then drops that test database.

Never point this test at a shared or production database. `TEST_MONGO_URI` must use a database name beginning with `bootcamp_lms_api_test_`.

```bash
cd backend
TEST_MONGO_URI='mongodb+srv://.../bootcamp_lms_api_test_local' yarn test:api
```

The script does not read or modify `MONGO_URI`; it requires the explicit test-only environment variable as a safety boundary. It can be used in CI with a disposable MongoDB database.
