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

| Method | Endpoint | Role | Purpose |
| --- | --- | --- | --- |
| POST | `/api/v1/teams` | Admin | Create Team; creator is derived from JWT |
| GET | `/api/v1/teams` | Admin | List Teams |
| GET | `/api/v1/teams/:id` | Admin | Get Team |
| PATCH | `/api/v1/teams/:id` | Admin | Update Team |
| DELETE | `/api/v1/teams/:id` | Admin | Delete Team without Projects |
| POST | `/api/v1/teams/:id/members` | Admin | Add Student User member |
| DELETE | `/api/v1/teams/:id/members/:memberId` | Admin | Remove member |

### Projects

| Method | Endpoint | Role | Purpose |
| --- | --- | --- | --- |
| POST | `/api/v1/projects` | Admin | Create Project for Team |
| GET | `/api/v1/projects` | Admin | List Projects |
| GET | `/api/v1/projects/:id` | Admin | Get Project |
| PATCH | `/api/v1/projects/:id` | Admin | Update Project |
| PATCH | `/api/v1/projects/:id/status` | Admin | Update Project status |
| DELETE | `/api/v1/projects/:id` | Admin | Delete Project without Tasks |

### Tasks

| Method | Endpoint | Role | Purpose |
| --- | --- | --- | --- |
| POST | `/api/v1/tasks` | Admin | Create Task for Project |
| GET | `/api/v1/tasks` | Admin | List Tasks |
| GET | `/api/v1/tasks/:id` | Admin | Get Task |
| PATCH | `/api/v1/tasks/:id` | Admin | Update Task |
| PATCH | `/api/v1/tasks/:id/status` | Admin | Update Task status |
| PATCH | `/api/v1/tasks/:id/assign` | Admin | Assign to Student User |
| DELETE | `/api/v1/tasks/:id` | Admin | Delete Task |

## Security

- Passwords use bcrypt and are selected only during authentication.
- JWT verification is required before all protected routes.
- `requireRole` enforces role-based authorization.
- Student identity is resolved from verified JWT claims, not request-supplied Student IDs.
- Admin creation is restricted to the trusted environment-driven seed.
- Deletion blocks when documented related records would be left inconsistent; no undocumented cascade deletion is performed.

## Testing

No automated test framework is currently configured. Verify endpoints against a test MongoDB database using the route tables above. At minimum test valid/invalid login, JWT failures, Student/Admin authorization, Student ownership, CRUD validation, relationship constraints, and dashboard aggregate values.
