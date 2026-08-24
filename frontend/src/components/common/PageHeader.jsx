import React from "react";
import { Box, Stack, Typography, Breadcrumbs, Link } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { Link as RouterLink } from "react-router-dom";

/**
 * PageHeader — Consistent page-level header for all admin and student pages.
 *
 * Features:
 * - Breadcrumb trail with home icon on first crumb
 * - Bold, tight-tracked page title
 * - Optional subtitle description
 * - Optional right-side actions slot
 */
export default function PageHeader({ title, description, breadcrumbs = [], actions }) {
  return (
    <Box sx={{ mb: 0.5 }}>
      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <Breadcrumbs
          separator={<NavigateNextIcon sx={{ fontSize: 13, color: "text.disabled" }} />}
          aria-label="breadcrumb"
          sx={{ mb: 1.25 }}
        >
          {breadcrumbs.map((b, idx) => {
            const isFirst = idx === 0;
            const isLast = idx === breadcrumbs.length - 1;

            return isLast ? (
              <Typography
                key={idx}
                sx={{ fontSize: "0.775rem", fontWeight: 700, color: "text.primary" }}
              >
                {b.label}
              </Typography>
            ) : (
              <Link
                key={idx}
                component={RouterLink}
                underline="hover"
                to={b.to || "#"}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.4,
                  fontSize: "0.775rem",
                  fontWeight: 600,
                  color: "text.secondary",
                  transition: "color 0.15s ease",
                  "&:hover": { color: "primary.main" },
                }}
              >
                {isFirst && <HomeOutlinedIcon sx={{ fontSize: 13 }} />}
                {b.label}
              </Link>
            );
          })}
        </Breadcrumbs>
      )}

      {/* Title row */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
      >
        <Box>
          <Typography
            component="h1"
            sx={{
              fontSize: { xs: "1.25rem", md: "1.4rem" },
              fontWeight: 800,
              color: "text.primary",
              letterSpacing: "-0.025em",
              lineHeight: 1.2,
            }}
          >
            {title}
          </Typography>
          {description && (
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", mt: 0.5, fontSize: "0.825rem", lineHeight: 1.5 }}
            >
              {description}
            </Typography>
          )}
        </Box>

        {actions && (
          <Box sx={{ flexShrink: 0, alignSelf: { xs: "flex-start", sm: "auto" } }}>
            {actions}
          </Box>
        )}
      </Stack>
    </Box>
  );
}
