# Saylani Mass I.T. Training (SMIT) Bootcamp LMS

An enterprise-grade Learning Management System (LMS) built with **React 19**, **Material UI v9**, **Node.js (Express 5)**, and **MongoDB**.

---

## 📁 Repository & Documentation Architecture

The repository is modularly structured into self-contained `frontend` and `backend` directories, each with its own comprehensive code, configuration, test suites, and dedicated `docs/` folder:

```text
Saylani-Bootcamp-LMS4/
├── frontend/                     # React 19 + Vite 8 + MUI v9 Web Application
│   ├── docs/                     # Frontend Architectural & API Documentation
│   │   ├── API.md                # Frontend HTTP client & endpoint integration map
│   │   ├── ARCHITECTURE.md       # Frontend tech stack, theme tokens & state flow
│   │   ├── ROUTES.md             # Complete RBAC route map (Admin & Student)
│   │   └── TEST_STATUS.md        # UI/UX verification & audit matrix
│   ├── src/                      # Source code (components, pages, context, theme)
│   └── README.md                 # Frontend specific README & setup guide
│
├── backend/                      # Node.js + Express 5 + Mongoose 9 REST API
│   ├── docs/                     # Backend API & System Documentation
│   │   ├── API.md                # REST API endpoints specification & schemas
│   │   ├── API_STATUS.md         # API smoke test results & module statuses
│   │   └── ARCHITECTURE.md       # Request lifecycle, database models & security
│   ├── src/                      # Backend source code (modules, middlewares, config)
│   └── README.md                 # Backend specific README & API guide
│
└── docs/                         # Institutional project specifications & presentation assets
    ├── Bootcamp_LMS_Architecture.pptx
    └── Bootcamp_LMS_Team_Assignment_Document.pdf
```

---

## 🚀 Key Modules & Portal Features

### 👑 Admin Portal (`/admin/*`)
- **Dashboard**: Real-time program metrics, attendance overview, task status distribution, and live **Tasks Due Today** query engine.
- **Students Management**: Roster CRUD, roll number assignment, batch allocation, search, and student detail profiles.
- **Attendance Management**: Batch session recorder, daily attendance logs, correction tools, and duplicate prevention.
- **Team Management**: Team allocation, student roster assignment, team lead selection, and team member management.
- **Project Management**: Capstone project creation & assignment to teams, deliverable milestone tracking, and detailed project views.
- **Task Management**: Deliverable backlog matrix with priority indicators (`low`, `medium`, `high`), status filters, and assignment dialogs.
- **Progress Tracking**: Real-time bootcamp performance center with trainee/team progress bars.
- **Reports & Export**: Centralized attendance and task reports with sanitized CSV exports (`/reports/attendance/export.csv`, `/reports/assignments/export.csv`).
- **Broadcast Notifications**: Global announcements broadcasting to students with real-time unread badges.
- **System Settings**: Admin profile management, password updates, Cloudinary avatar uploads, application preferences, and security metadata.

### 🎓 Student Portal (`/student/*`)
- **Dashboard**: Personal attendance score, team assignment summary, pending tasks, and announcement feed.
- **Profile & Avatar**: View profile details and upload/delete profile avatar via Cloudinary integration.
- **Attendance**: Read-only personal attendance log with summary statistics.
- **My Team**: View assigned team roster, team lead, and team projects.
- **Projects & Tasks**: Track team projects and update assigned task status (`todo` ➔ `in-progress` ➔ `done`).
- **Progress & Reports**: Personal progress reports and performance statistics.
- **Notifications**: Personal notification inbox with read/unread filters, mark all as read, and delete controls.
- **Account Settings**: Student account customization, password updates, and notification preferences.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | React 19 (`react` & `react-dom`) |
| **Build Tooling** | Vite 8 + `@vitejs/plugin-react` |
| **UI Design System** | Material UI (MUI v9) + `@emotion/react` & `@emotion/styled` |
| **Routing** | React Router v7 (`react-router-dom`) |
| **Data Visualization** | Recharts (`recharts`) |
| **Backend Runtime** | Node.js + Express 5 |
| **Database & ORM** | MongoDB + Mongoose 9 |
| **Authentication** | JWT Bearer Token + bcrypt password hashing |
| **Validation** | Zod (`zod`) request schema validation |
| **File Storage** | Multer + Cloudinary Storage API |

---

## ⚙️ Quick Start Guide

### 1. Environment Setup

#### Backend (`/backend/.env`)
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

# Cloudinary Storage
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### Frontend (`/frontend/.env`)
```env
VITE_API_BASE_URL=/api/v1
```

### 2. Running local services

#### Start Backend Server
```bash
cd backend
yarn install
yarn dev
```

#### Start Frontend Client
```bash
cd frontend
yarn install
yarn dev
```

#### Run Backend API Integration Tests
```bash
cd backend
yarn test:api
```

---

## 🔒 Security & Authorization (RBAC)

- **Authentication**: Bearer JWT tokens sent via the `Authorization` header.
- **Role Enforcement**:
  - `ADMIN`: Full administrative control across all management modules and global settings.
  - `STUDENT`: Isolated access to student-specific resources and personal user settings.
- **Cross-Role Protection**: Frontend route guards (`RoleRoute.jsx`) and backend middleware (`requireRole`) enforce access boundaries, returning `403 Forbidden` for unauthorized attempts.
- **IDOR Protection**: Student access to private resources is scoped strictly to `req.user.userId`.
