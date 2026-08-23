# Saylani Bootcamp LMS — Backend REST API

The Bootcamp LMS backend provides a production-ready, role-based RESTful API for managing Students, Attendance, Teams, Projects, Tasks, Reports, Notifications, Settings, and an Admin Dashboard. Built with Node.js, Express 5, MongoDB (Mongoose 9), JWT authentication, Zod validation, and Cloudinary image storage.

---

## 📚 Dedicated Documentation Folder

All backend-specific architectural, API specification, and status files are organized inside [`backend/docs/`](./docs/):

- 📄 [**API Specification (`backend/docs/API.md`)**](./docs/API.md) — Comprehensive endpoint schemas, request/response formats, and security rules.
- 📄 [**API Smoke Test Status (`backend/docs/API_STATUS.md`)**](./docs/API_STATUS.md) — Module test results and verification matrix against disposable test DB.
- 📄 [**Backend Architecture (`backend/docs/ARCHITECTURE.md`)**](./docs/ARCHITECTURE.md) — Request lifecycle, database relationships, Zod schemas, and security model.

---

## 🛠️ Technology Stack

- **Runtime**: Node.js 22 + Express 5
- **Database & ORM**: MongoDB + Mongoose 9
- **Authentication**: JSON Web Tokens (`jsonwebtoken`) + bcrypt password hashing (10 rounds)
- **Validation**: Zod schema validation with strict field matching
- **File Storage**: Multer + Cloudinary Storage API
- **Timezone Support**: `Intl.DateTimeFormat` timezone handling (default: `Asia/Karachi`)

---

## 📁 Backend Directory Structure

```text
backend/
├── docs/                 # Dedicated backend documentation
│   ├── API.md            # REST API endpoints & payload schemas
│   ├── API_STATUS.md     # Smoke test results & module statuses
│   └── ARCHITECTURE.md   # Request lifecycle, database models & security
├── src/
│   ├── config/           # Environment variables, DB connection, Cloudinary config
│   ├── middlewares/      # Authentication, RBAC (requireRole), error handling, upload
│   ├── modules/          # Feature modules (auth, students, attendance, teams, projects, tasks, dashboard, reports, notifications, settings)
│   ├── services/         # Startup services & initial Admin seeding
│   ├── utils/            # JWT helpers, password helpers, response formatters, dateRange utilities
│   ├── app.js            # Express app configuration & middleware pipeline
│   └── server.js         # HTTP server entry point & MongoDB connection
├── scripts/              # Integration smoke test suite (testApi.js)
└── package.json
```

---

## ⚙️ Environment Variables & Setup

Copy `.env.example` to `.env`:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/bootcamp_lms
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
DASHBOARD_TIMEZONE=Asia/Karachi

# Initial Development Admin Seed
ADMIN_NAME=Bootcamp Admin
ADMIN_EMAIL=muhammadumar.codes@gmail.com
ADMIN_PASSWORD=umarkhan

# Cloudinary Setup
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 🏃 Installation & Execution

### 1. Install Dependencies
```bash
yarn install
```

### 2. Run Development Server
```bash
yarn dev
```

### 3. Run API Integration Smoke Tests
```bash
yarn test:api
```
