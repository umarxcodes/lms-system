# Saylani Bootcamp LMS — Frontend Application

An institutional, enterprise-grade Web Portal for **Saylani Mass I.T. Training (SMIT)** Bootcamp Learning Management System (LMS). Built with **React 19**, **Material-UI (MUI v9)**, **Vite 8**, **Recharts**, and **Axios**.

---

## 📚 Dedicated Documentation Folder

All frontend-specific architectural, API, and testing documentation files are organized inside [`frontend/docs/`](./docs/):

- 📄 [**API Documentation (`frontend/docs/API.md`)**](./docs/API.md) — HTTP client architecture, Axios request/response interceptors, and endpoint mapping.
- 📄 [**Architecture (`frontend/docs/ARCHITECTURE.md`)**](./docs/ARCHITECTURE.md) — Tech stack, directory breakdown, theme design tokens, and state flow.
- 📄 [**Route Map (`frontend/docs/ROUTES.md`)**](./docs/ROUTES.md) — Complete public, admin (`/admin/*`), and student (`/student/*`) route specifications.
- 📄 [**Test Status (`frontend/docs/TEST_STATUS.md`)**](./docs/TEST_STATUS.md) — Audit matrix covering builds, security guards, responsive UI, and component verification.

---

## 🏛️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | React 19 (`react` & `react-dom`) |
| **Build Tooling** | Vite 8 + `@vitejs/plugin-react` |
| **Design System** | Material-UI (MUI v9) + `@emotion/react` & `@emotion/styled` |
| **Routing** | React Router v7 (`react-router-dom`) |
| **Data Visualization** | Recharts (`recharts`) |
| **HTTP Client** | Axios (`axios`) with JWT Bearer Request/Response Interceptors |
| **Icons & Media** | MUI Icons (`@mui/icons-material`), Lucide Icons (`lucide-react`) & Cloudinary Upload API |
| **Date & Time** | Dayjs (`dayjs`) |

---

## 🔐 Authentication & Authorization Architecture

- **JWT Session Persistence**: Token-based authentication stored in `localStorage` (`lms_token`) and managed globally by `AuthContext`.
- **Axios Interceptor**: Automatically attaches `Authorization: Bearer <token>` to outbound requests and handles global `401 Unauthorized` token expiration events via custom browser window events (`auth:unauthorized`).
- **Role-Based Guards**:
  - `ProtectedRoute`: Guarantees user is authenticated before mounting shell.
  - `RoleRoute`: Guarantees role authorization (`ADMIN` vs `STUDENT`). Unauthorized role access attempts trigger a seamless redirect to the `403 Access Denied` view.

---

## 🎨 UI/UX Design System Guidelines

1. **Full-Width Layouts**: All pages utilize `width: 100%` and `flexGrow: 1` within `PageContent` layout wrapper to maximize desktop horizontal scanning area.
2. **Color Palette**: Curated institutional Saylani Welfare palette leveraging standard MUI theme tokens (`primary.main: #2563eb`, `background.paper: #ffffff`, borders: `#e2e8f0`, text: `#0f172a`).
3. **Standardized Header & Shell**: All administrative and student pages use the unified `<PageHeader>` and `<PageContent>` pattern for consistent visual hierarchy.
4. **Empty State Component**: Data tables and metrics views utilize the shared `<EmptyState />` component when API responses are empty (zero hardcoded mock fallbacks).

---

## ⚙️ Development & Production Setup

### 1. Install Dependencies
```bash
yarn install
```

### 2. Environment Configuration
Copy `.env.example` to `.env`:
```env
VITE_API_BASE_URL=/api/v1
```

### 3. Run Development Server
```bash
yarn dev
```

### 4. Production Build & Verification
```bash
npm run build
```
