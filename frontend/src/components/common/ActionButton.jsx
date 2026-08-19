import React from "react";
import { Button, styled } from "@mui/material";

const StyledButton = styled(Button)(({ theme, ownerState }) => {
  const { color = "primary", variant = "outlined" } = ownerState || {};

  return {
    borderRadius: "8px",
    textTransform: "none",
    fontWeight: 600,
    fontSize: "0.875rem",
    padding: "6px 14px",
    transition: "all 0.15s ease",
    boxShadow: "none",
    "&:focus-visible": {
      outline: "2px solid #2563EB",
      outlineOffset: "2px",
    },
    ...(variant === "contained" && color === "primary" && {
      bgcolor: "#2563EB",
      color: "#FFFFFF",
      "&:hover": {
        bgcolor: "#1D4ED8",
        boxShadow: "none",
      },
    }),
    ...(variant === "contained" && color === "success" && {
      bgcolor: "#16A34A",
      color: "#FFFFFF",
      "&:hover": {
        bgcolor: "#15803D",
        boxShadow: "none",
      },
    }),
    ...(variant === "contained" && color === "error" && {
      bgcolor: "#DC2626",
      color: "#FFFFFF",
      "&:hover": {
        bgcolor: "#B91C1C",
        boxShadow: "none",
      },
    }),
    ...(variant === "outlined" && {
      borderColor: "#E2E8F0",
      color: "#111827",
      bgcolor: "#FFFFFF",
      "&:hover": {
        borderColor: "#2563EB",
        bgcolor: "#EFF6FF",
        color: "#2563EB",
      },
    }),
    ...(variant === "text" && {
      color: "#2563EB",
      "&:hover": {
        bgcolor: "#EFF6FF",
      },
    }),
  };
});

export default function ActionButton({ children, variant = "outlined", color = "primary", ...rest }) {
  return (
    <StyledButton variant={variant} color={color} ownerState={{ variant, color }} {...rest}>
      {children}
    </StyledButton>
  );
}

