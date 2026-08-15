import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AppLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const location = useLocation();

  const handleMobileNavToggle = () => {
    setMobileNavOpen((prev) => !prev);
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
        <Sidebar mobileOpen={mobileNavOpen} onMobileClose={() => setMobileNavOpen(false)} />

        <Box
          component="main"
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            height: "100%",
            overflowY: "auto",
            position: "relative",
          }}
        >
          <Box
            key={location.pathname}
            sx={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              animation: "fadeInUp 250ms cubic-bezier(0.16, 1, 0.3, 1)",
              "@keyframes fadeInUp": {
                "0%": { opacity: 0, transform: "translateY(8px)" },
                "100%": { opacity: 1, transform: "translateY(0)" },
              },
              "@media (prefers-reduced-motion: reduce)": {
                animation: "none",
              },
            }}
          >
            <Outlet context={{ onMobileNavOpen: handleMobileNavToggle }} />
          </Box>
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
