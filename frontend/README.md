# Saylani Bootcamp LMS — Enterprise Frontend Architecture

An institutional, production-grade Web Portal for **Saylani Mass I.T. Training (SMIT)** Bootcamp Learning Management System (LMS). Built with **React 19**, **Material-UI (MUI v9)**, **Vite 8**, and **Axios**, providing role-isolated administrative and trainee experiences.

---

## 🏛️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | React 19 (`react` & `react-dom`) |
| **Build Tooling** | Vite 8 + `@vitejs/plugin-react` |
| **Design System** | Material-UI (MUI v9) + `@emotion/react` & `@emotion/styled` |
| **Routing** | React Router v7 (`react-router-dom`) |
| **HTTP Client** | Axios (`axios`) with JWT Bearer Request/Response Interceptors |
| **Icons & Media** | MUI Icons (`@mui/icons-material`) & Cloudinary Upload API |
| **Date & Time** | Dayjs (`dayjs`) |

---

## 🔐 Authentication & Authorization Architecture

- **JWT Session Persistence**: Token-based authentication stored in `localStorage` and managed globally by `AuthContext`.
- **Axios Interceptor**: Automatically attaches `Authorization: Bearer <token>` to outbound requests and handles global `401 Unauthorized` token expiration events via custom browser dispatch.
- **Role-Based Guards**:
  - `ProtectedRoute`: Guarantees user is authenticated before mounting shell.
  - `RoleRoute`: Guarantees role authorization (`ADMIN` vs `STUDENT`). Unauthorized role access attempts trigger a seamless redirect to the `403 Access Denied` view.

---

## 🗺️ Application Route & Module Map

### 🔓 Public Routes
- `/login`: Clean, secure institutional authentication portal.
- `/403`: Institutional Access Denied page.
- `/*`: Institutional 404 Page Not Found fallback page.

### 🛡️ Administrative Portal (`ADMIN`)
- `/admin/dashboard`: Institutional KPI summary, real-time analytics, recent activity feed.
- `/admin/students`: Full-width trainee table with search, status filters, create student modal, and CSV export.
- `/admin/students/:id`: Individual trainee detail profile with attendance & project record tabs.
- `/admin/attendance`: Institutional attendance management, batch session recorder, and summary metrics.
- `/admin/teams`: Project teams management, creation modal, and member capacity indicators.
- `/admin/teams/:id`: In-depth team detail profile with project assignment and roster management.
- `/admin/projects`: Comprehensive project management repository with status chips and team links.
- `/admin/projects/:id`: Project detail workspace with deliverable milestones and progress tracking.
- `/admin/tasks`: Task assignment matrix with priority badges, status filters, and assignment dialog.
- `/admin/progress`: Real-time bootcamp progress center with trainee/team completion bars.
- `/admin/reports`: Centralized report center with dynamic multi-criteria filtering and CSV export.
- `/admin/notifications`: Global announcement broadcast form, notification feeds, and delete controls.
- `/admin/settings`: Two-column administrative settings navigation (Profile, Security, Notifications, Preferences, System Config).

### 🎓 Trainee Portal (`STUDENT`)
- `/student/dashboard`: Personal trainee overview, progress metrics, assigned team, upcoming tasks.
- `/student/profile`: Personal trainee profile with Cloudinary avatar upload and bio details.
- `/student/attendance`: Personal attendance log history with present/absent summary statistics.
- `/student/team`: Assigned project team view with teammate cards and project details.
- `/student/projects`: Assigned project deliverables with submission status.
- `/student/tasks`: Assigned tasks checklist with status update controls.
- `/student/progress`: Personal progress breakdown with grade evaluation and milestone trackers.
- `/student/reports`: Verifiable institutional trainee report card with grade computation.
- `/student/notifications`: Personal notification feed with read/unread indicators and details drawer.
- `/student/settings`: Trainee account settings (Profile, Password Security, Notifications, Regional Preferences).

---

## ⚙️ Environment Configuration

Copy `.env.example` to `.env` in the `frontend` root:

```bash
VITE_API_BASE_URL=/api/v1
```

*Note: Frontend environment variables expose only safe public API base paths. Secrets like JWT secrets or DB keys reside strictly in the backend environment.*

---

## 🚀 Development & Production Build Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```

### 3. Production Build & Linting Verification
```bash
npm run lint
npm run build
```

---

## 🎨 UI/UX Design System Guidelines

1. **Full-Width Layouts**: All pages utilize `width: 100%` and `flexGrow: 1` within `PageContent` layout wrapper to maximize desktop horizontal scanning area.
2. **Color Palette**: Curated institutional Saylani Welfare palette leveraging standard MUI theme tokens (`primary.main: #1e40af`, `background.paper: #ffffff`, borders: `#e2e8f0`, text: `#0f172a`).
3. **Component Architecture**: Modular component organization inside `src/components/` (`layout`, `common`, `notifications`, `progress`, `reports`, `settings`, `teams`).
