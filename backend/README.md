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
  modules/         feature modules (auth, students, attendance, teams, projects, tasks, dashboard)
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

### Students

| Method | Endpoint | Role | Purpose |
| --- | --- | --- | --- |
| POST | `/api/v1/students` | Admin | Create linked Student login and profile |
| GET | `/api/v1/students` | Admin | List Students |
| GET | `/api/v1/students/me` | Student | Own profile, derived from JWT |
| GET | `/api/v1/students/:id` | Admin / owning Student | Get one Student |
| PATCH | `/api/v1/students/:id` | Admin | Update Student profile |
| DELETE | `/api/v1/students/:id` | Admin | Delete an unreferenced Student |

`PUT /api/v1/students/:id` remains available as a compatibility alias for `PATCH`.

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
- Admin creation is restricted to the trusted environment-driven seed.
- Deletion blocks when documented related records would be left inconsistent; no undocumented cascade deletion is performed.

## Testing

No automated test framework is currently configured. Verify endpoints against a test MongoDB database using the route tables above. At minimum test valid/invalid login, JWT failures, Student/Admin authorization, Student ownership, CRUD validation, relationship constraints, and dashboard aggregate values.
