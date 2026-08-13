# BOOTCAMP LMS — FRONTEND ARCHITECTURE

## 1. Tech Stack Overview
- **Core Library**: React 18
- **Build Tooling**: Vite 8
- **UI Framework**: Material UI (MUI v6)
- **Icons**: `@mui/icons-material`
- **Charts**: Recharts
- **HTTP Client**: Axios with JWT Interceptors
- **Routing**: React Router v6

## 2. Directory Structure
```
frontend/src/
├── components/
│   ├── common/         # Reusable primitives (DataTable, PageHeader, PageSkeleton, StatCard, StatusChip, ConfirmDialog, EmptyState, ErrorBoundary, CloudinaryAvatarUpload)
│   └── layout/         # Application shell (AppLayout, Sidebar, Header)
├── context/            # Global providers (AuthContext, ToastContext)
├── pages/
│   ├── admin/          # Admin portal views (Dashboard, Students, Attendance, Teams, Projects, Tasks, Progress, Reports, Notifications, Settings)
│   ├── auth/           # Login, Forbidden (403), Not Found (404)
│   └── student/        # Student portal views (Dashboard, Profile, Attendance, Team, Projects, Tasks, Progress, Reports, Notifications, Settings)
├── routes/             # ProtectedRoute and RoleRoute definitions
├── services/           # Service layer mapping to backend REST endpoints
└── theme/              # Centralized MUI theme configuration (palette, typography, shape, component overrides)
```

## 3. Theme & Design Tokens
- **Primary Color**: Indigo `#1d4ed8`
- **Secondary Color**: Slate `#0f172a`
- **Background**: `#f8fafc` (body) & `#ffffff` (cards/paper)
- **Border Radius**: 10px base, 8px buttons, 12px cards, 16px modals
- **Typography Scale**: Inter / Outfit sans-serif hierarchy

## 4. State & Auth Flow
- `AuthContext` hydrates session on app start via `/api/v1/auth/me`.
- Axios interceptor appends `Authorization: Bearer <token>` to requests.
- `401 Unauthorized` responses trigger a custom window event (`auth:unauthorized`) which safely logs out the user without reload loops.
- `RoleRoute` strictly enforces role boundaries (`ADMIN` vs `STUDENT`).
