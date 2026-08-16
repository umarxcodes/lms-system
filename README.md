# Saylani Mass I.T. Training (SMIT) Bootcamp LMS

A enterprise-grade Learning Management System (LMS) built with React 19, Material UI v9, Node.js, Express, and MongoDB.

---

## 🚀 Key Modules & Features

### 👑 Admin Portal (`/admin/*`)
- **Dashboard**: Real-time program metrics, attendance overview, project completion distribution, and quick action shortcuts.
- **Students Management**: CRUD operations for student profiles, batch assignments, roll numbers, status toggles, and detailed profile views.
- **Attendance Management**: Batch & date-based attendance marking, individual student logs, edit/correct attendance records, and duplicate prevention.
- **Team Management**: Team allocation, student roster assignment, team captain selection, and team member management.
- **Project Management**: Create & assign projects to teams, track milestone completion status, and detail views.
- **Task Management**: Assign tasks to team members with priorities (`low`, `medium`, `high`, `urgent`), statuses (`todo`, `in-progress`, `review`, `completed`), and due dates.
- **Progress Tracking**: Program-wide milestone metrics, completion distribution, and performance tracking.
- **Reports & Export**: Comprehensive attendance and assignment reports with CSV export capability (`/reports/attendance/export.csv`, `/reports/assignments/export.csv`).
- **Broadcast Notifications**: Global announcements broadcasting to students with real-time unread badges.
- **System Settings**: Admin profile management, password updates, Cloudinary avatar uploads, application preferences, and security logs.

### 🎓 Student Portal (`/student/*`)
- **Dashboard**: Overview of personal attendance score, team assignment, pending tasks, and latest program announcements.
- **Profile & Avatar**: View profile details and upload/remove profile picture via Cloudinary.
- **Attendance**: Detailed personal attendance history and percentage score.
- **My Team**: View team roster, team captain, and assigned team projects.
- **Projects & Tasks**: Track team projects and update assigned task status (`todo` ➔ `in-progress` ➔ `review` ➔ `completed`).
- **Progress & Reports**: Personal progress reports and performance statistics.
- **Notifications**: Personal notification inbox with read/unread filtering, mark all as read, and notification deletion.
- **Account Settings**: Student profile customization, password change, and notification preferences.

---

## 🛠️ Architecture & Tech Stack

### Frontend
- **Framework**: React 19 + Vite 8
- **UI Library**: Material UI (MUI v9) + Emotion
- **Charts**: Recharts
- **Icons**: MUI Icons + Lucide React
- **HTTP Client**: Axios with request/response interceptors for Bearer token attachment and automatic 401 handling
- **Routing**: React Router v7 with `ProtectedRoute` (Auth guard) and `RoleRoute` (RBAC guard)

### Backend
- **Runtime**: Node.js + Express 5
- **Database**: MongoDB + Mongoose 9
- **Validation**: Zod 4 for input validation
- **Authentication**: JWT Bearer token authentication with password hashing via bcrypt
- **File Uploads**: Multer + Multer Storage Cloudinary

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js >= 18.x
- Yarn or npm
- MongoDB instance (local or MongoDB Atlas)
- Cloudinary Account (for image uploads)

### 1. Environment Setup

#### Backend (`/backend/.env`)
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/bootcamp_lms
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# Seed Admin Credentials
ADMIN_EMAIL=muhammadumar.codes@gmail.com
ADMIN_PASSWORD=umarkhan

# Cloudinary Setup
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### Frontend (`/frontend/.env`)
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

---

## 🏃 Running the Application

### Backend Server
```bash
cd backend
yarn install
yarn dev
```

### Frontend Client
```bash
cd frontend
yarn install
yarn dev
```

### Running Backend API Integration Smoke Test
```bash
cd backend
yarn test:api
```

---

## 🔒 Security & Authorization (RBAC)

- **Authentication**: Bearer JWT tokens sent via `Authorization` header.
- **Roles**:
  - `ADMIN`: Full administrative control across all management modules and global settings.
  - `STUDENT`: Isolated access to student-specific resources and personal user settings.
- **Cross-Role Protection**: Frontend route guards (`RoleRoute.jsx`) and backend middleware (`requireRole`) enforce access boundaries, returning `403 Forbidden` for unauthorized attempts.
