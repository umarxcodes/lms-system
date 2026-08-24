import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import Sidebar from "./Sidebar";
import Header from "./Header";
import PageTransition from "../common/PageTransition";

export default function AppLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem("sidebar_collapsed") === "true";
    } catch {
      return false;
    }
  });

  const handleMobileNavToggle = () => {
    setMobileNavOpen((prev) => !prev);
  };

  const handleSidebarCollapseToggle = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("sidebar_collapsed", String(next));
      } catch {
        // Silently catch storage errors
      }
      return next;
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        bgcolor: "background.default",
        color: "text.primary",
        WebkitFontSmoothing: "antialiased",
      }}
    >
      {/* Full Top Header across whole screen */}
      <Header onMobileNavOpen={handleMobileNavToggle} />

      {/* Main Body below Header */}
      <Box sx={{ display: "flex", flex: 1, overflow: "hidden", width: "100%" }}>
        <Sidebar
          mobileOpen={mobileNavOpen}
          onMobileClose={() => setMobileNavOpen(false)}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={handleSidebarCollapseToggle}
        />

        <Box
          component="main"
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            height: "100%",
            overflowY: "auto",
            position: "relative",
            transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <PageTransition>
            <Outlet context={{ onMobileNavOpen: handleMobileNavToggle }} />
          </PageTransition>
        </Box>
      </Box>
    </Box>
  );
}

export function PageContent({ children, px = { xs: 2.5, md: 4 } }) {
  return (
    <Box
      sx={{
        flex: 1,
        overflowY: "auto",
        px,
        py: 3,
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      {children}
    </Box>
  );
}
