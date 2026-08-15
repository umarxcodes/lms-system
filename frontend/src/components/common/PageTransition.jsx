import React from "react";
import { Box } from "@mui/material";
import { useLocation } from "react-router-dom";

/**
 * PageTransition Component
 * Encapsulates clean, professional, hardware-accelerated route entrance transitions.
 * - 250ms smooth fade (opacity: 0 -> 1)
 * - 8px subtle vertical translation (translateY: 8px -> 0)
 * - Respects prefers-reduced-motion
 */
export default function PageTransition({ children }) {
  const location = useLocation();

  return (
    <Box
      key={location.pathname}
      sx={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        width: "100%",
        animation: "pageEntrance 250ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
        willChange: "opacity, transform",
        "@keyframes pageEntrance": {
          "0%": {
            opacity: 0,
            transform: "translateY(8px)",
          },
          "100%": {
            opacity: 1,
            transform: "translateY(0)",
          },
        },
        "@media (prefers-reduced-motion: reduce)": {
          animation: "none",
        },
      }}
    >
      {children}
    </Box>
  );
}
