import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import Sidebar from "./Sidebar";

export default function AppLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleMobileNavToggle = () => {
    setMobileNavOpen((prev) => !prev);
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        bgcolor: "background.default",
        color: "text.primary",
        WebkitFontSmoothing: "antialiased",
      }}
    >
      <Sidebar mobileOpen={mobileNavOpen} onMobileClose={() => setMobileNavOpen(false)} />

      <Box
        component="main"
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          height: "100%",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <Outlet context={{ onMobileNavOpen: handleMobileNavToggle }} />
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
        py: 4,
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      {children}
    </Box>
  );
}
