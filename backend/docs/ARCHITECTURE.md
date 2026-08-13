# Bootcamp LMS — Backend Architecture

## Overview

Bootcamp LMS is a Node.js/Express REST API for managing a bootcamp learning environment. It uses MongoDB (Mongoose) for persistence, JWT for stateless authentication, and Zod for request validation.

## Request Lifecycle

```
Client
  │
  ▼
Express App (app.js)
  │
  ├─ Global middlewares: cors, helmet, compression, morgan, cookieParser, express.json
  │
  ▼
Route Mount (/api/v1/*)
  │
  ├─ authenticate (JWT verification + role staleness check)
  │
  ├─ requireRole(...) (RBAC)
  │
  ├─ validate(schema) or validateQuery(schema) (Zod)
  │
  ▼
Controller
  │
  ▼
Service (business logic, validation, transactions)
  │
  ▼
Model (Mongoose schema, hooks, methods)
  │
  ▼
MongoDB
  │
  ▼
Service (response shaping)
  │
  ▼
Controller
  │
  ▼
success() / error() response helper
  │
  ▼
notFound middleware (404 fallback)
  ▼
errorMiddleware (global error handler)
```

## Module Structure

Every feature module follows the same pattern:

```
modules/<feature>/
  ├── <feature>.model.js      # Mongoose schema + indexes
  ├── <feature>.service.js    # Business logic, DB operations
  ├── <feature>.controller.js # Thin request/response handlers
  ├── <feature>.routes.js     # Express routes + middleware stack
  └── <feature>.validation.js # Zod schemas
```

## Database Relationships

```
User (1) ──< (1) Student
User (1) ──< (1) AdminSettings
User (1) ──< (N) Team (as createdBy)
User (1) ──< (N) Team.members
User (1) ──< (N) Task.assignedTo
User (1) ──< (N) Notification.recipient

Student (1) ──< (N) Attendance
Team (1) ──< (1) Project
Project (1) ──< (N) Task
```

## Authentication

- Login returns a JWT containing `userId` and `role`.
- The `authenticate` middleware verifies the JWT and re-queries the User on every request to enforce role changes immediately.
- `req.user = { userId, role }` is the only trusted identity source.
- Passwords are hashed with bcrypt (10 rounds) and excluded from queries via `select: false`.

## Authorization

- `requireRole(...roles)` restricts access to specified roles.
- Admin-only routes: Students, Attendance, Teams, Projects, Tasks, Reports, Settings, Dashboard.
- Student routes: own profile, own attendance, own team, own projects, own tasks, own notifications.

## Security Rules

- **IDOR protection:** Student access to private resources is scoped to `req.user.userId`. Client-supplied ownership IDs (`req.body.studentId`, `req.body.userId`) are never trusted.
- **Mass assignment:** All write endpoints use Zod `.strict()` validation. Only explicitly allowed fields are accepted.
- **Password safety:** Passwords are never returned, logged, or stored in JWT.
- **Cloudinary:** Profile images are validated by magic bytes (JPEG/PNG/WEBP), not MIME type alone. Old images are deleted after replacement.
- **Transactions:** `createStudent`, `deleteStudent`, and attendance updates use MongoDB sessions for atomicity.

## Configuration

| Variable | Purpose |
| --- | --- |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | JWT signing secret (required) |
| `JWT_EXPIRES_IN` | Token expiry (default: `7d`) |
| `PORT` | Server port (default: `5000`) |
| `NODE_ENV` | Environment (`development` recommended for local) |
| `DASHBOARD_TIMEZONE` | Timezone for dashboard day boundaries (default: `Asia/Karachi`) |
| `CLOUDINARY_*` | Cloudinary credentials for profile images |

## Admin Provisioning

In `development` mode, the server seeds an initial Admin if `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `ADMIN_NAME` are set in `.env` and no Admin exists. This is intentionally local-only.

## Student Flow

1. Admin creates a Student (POST /students) — creates User + Student profile in a transaction.
2. Student logs in (POST /auth/login) — receives JWT.
3. Student accesses portal endpoints (`/students/me`, `/students/dashboard`, etc.) — identity comes from JWT.
