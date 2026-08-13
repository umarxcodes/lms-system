import React from "react";
import { Box, Stack, Typography, Breadcrumbs, Link } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Link as RouterLink } from "react-router-dom";

export default function PageHeader({ title, description, breadcrumbs = [], actions }) {
  return (
    <Box sx={{ mb: 3 }}>
      {breadcrumbs.length > 0 && (
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
          sx={{ mb: 1 }}
        >
          {breadcrumbs.map((b, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return isLast ? (
              <Typography key={idx} color="text.primary" variant="caption" sx={{ fontWeight: 600 }}>
                {b.label}
              </Typography>
            ) : (
              <Link
                key={idx}
                component={RouterLink}
                underline="hover"
                color="inherit"
                to={b.to || "#"}
                variant="caption"
              >
                {b.label}
              </Link>
            );
          })}
        </Breadcrumbs>
      )}

      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
      >
        <Box>
          <Typography
            component="h1"
            variant="h4"
            sx={{ fontWeight: 700, color: "text.primary", letterSpacing: "-0.01em" }}
          >
            {title}
          </Typography>
          {description && (
            <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
              {description}
            </Typography>
          )}
        </Box>

        {actions && <Box sx={{ flexShrink: 0 }}>{actions}</Box>}
      </Stack>
    </Box>
  );
}
