import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import Sidebar from "./Sidebar";

/**
 * Root layout route. Wire it up in App.jsx as a layout route wrapping all
 * authenticated pages, e.g.:
 *
 *   <Route element={<AppLayout />}>
 *     <Route path="/dashboard" element={<DashboardPage />} />
 *     <Route path="/students" element={<StudentsPage />} />
 *     ...
 *   </Route>
 *
 * Each page renders its own <Header /> + <PageContent> inside the <Outlet />.
 */
export default function AppLayout() {
  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        bgcolor: "grey.50",
        color: "grey.800",
        WebkitFontSmoothing: "antialiased",
      }}
    >
      <Sidebar />

      <Box
        component="main"
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          height: "100%",
          overflow: "hidden",
          position: "relative",
          background: "#f2f4f7",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

/**
 * Scrollable content area used below <Header /> on every page.
 * Matches: <div class="flex-1 overflow-y-auto px-8 lg:px-10 pb-10 space-y-6">
 *
 * Most pages use the default padding. Students page uses px-6 lg:px-10 —
 * override via the `px` prop: <PageContent px={{ xs: 3, lg: 5 }}>
 */
export function PageContent({ children, px = { xs: 4, lg: 5 } }) {
  return (
    <Box
      sx={{
        flex: 1,
        overflowY: "auto",
        px,
        pb: 5,
        display: "flex",
        flexDirection: "column",
        gap: 3, // space-y-6 (24px)
      }}
    >
      {children}
    </Box>
  );
}
