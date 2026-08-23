# BOOTCAMP LMS — FRONTEND ARCHITECTURE

## 1. Tech Stack Overview
- **Core Library**: React 19 (`react` & `react-dom`)
- **Build Tooling**: Vite 8 (`@vitejs/plugin-react`)
- **UI Framework**: Material UI (MUI v9) + `@emotion/react` & `@emotion/styled`
- **Icons**: `@mui/icons-material` & `lucide-react`
- **Charts**: Recharts (`recharts`)
- **HTTP Client**: Axios with JWT Interceptors (`axios`)
- **Routing**: React Router v7 (`react-router-dom`)
- **Date Utility**: Dayjs (`dayjs`)

## 2. Directory Structure
```text
frontend/
├── docs/               # Frontend documentation (API, Architecture, Routes, Test Status)
├── src/
│   ├── components/
│   │   ├── common/     # Reusable UI primitives (DataTable, PageHeader, PageSkeleton, StatCard, StatusChip, ConfirmDialog, EmptyState, ErrorBoundary, CloudinaryAvatarUpload)
│   │   ├── layout/     # Application shell (AppLayout, Sidebar, Header)
│   │   ├── notifications/ # Notification drawer & items
│   │   ├── progress/   # Progress metrics & milestone bars
│   │   ├── reports/    # Report tables & export controls
│   │   ├── settings/   # Profile & account preferences tabs
│   │   └── teams/      # Team creation & member allocation cards
│   ├── context/        # Global context providers (AuthContext, ToastContext)
│   ├── pages/
│   │   ├── admin/      # Admin portal views (Dashboard, Students, Attendance, Teams, Projects, Tasks, Progress, Reports, Notifications, Settings)
│   │   ├── auth/       # Auth & System views (Login, Forbidden 403, Not Found 404)
│   │   └── student/    # Student portal views (Dashboard, Profile, Attendance, Team, Projects, Tasks, Progress, Reports, Notifications, Settings)
│   ├── routes/         # Router configuration & guards (ProtectedRoute, RoleRoute)
│   ├── services/       # Service API abstraction layer mapping to backend endpoints
│   └── theme/          # Centralized MUI theme configuration (palette, typography, shapes, component overrides)
```

## 3. Theme & Design System Tokens
- **Primary Accent**: Saylani Blue `#2563EB` (dark `#1d4ed8`, light `#eff6ff`)
- **Secondary Accent**: Slate `#0f172a`
- **Surface Background**: `#f8fafc` (body grid) & `#ffffff` (cards / paper)
- **Border System**: `#e2e8f0` (1px solid default)
- **Border Radius Standard**:
  - `8px` buttons & inputs
  - `10px` data table rows & status chips
  - `12px` cards & stat containers
  - `16px` dialogs & modal containers
- **Typography Scale**: Inter / Outfit sans-serif hierarchy

## 4. State & Auth Flow
- `AuthContext` hydrates session on initial application load via `GET /api/v1/auth/me`.
- Axios interceptor automatically appends `Authorization: Bearer <token>` to all HTTP requests.
- `401 Unauthorized` responses trigger a custom window event (`auth:unauthorized`), initiating a clean logout without redirect loops.
- `RoleRoute` strictly enforces role boundaries (`ADMIN` vs `STUDENT`). Unauthorized role access attempts trigger a seamless redirect to the `403 Access Denied` view.
