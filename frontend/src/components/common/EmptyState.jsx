import React from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";

export default function EmptyState({
  title = "No data found",
  description = "There are no records matching your request.",
  icon: Icon = InboxOutlinedIcon,
  actionLabel,
  onAction,
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 6,
        textAlign: "center",
        borderRadius: 3,
        border: "1px dashed",
        borderColor: "grey.300",
        bgcolor: "background.paper",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          bgcolor: "grey.100",
          color: "grey.500",
          display: "grid",
          placeItems: "center",
          mb: 2,
        }}
      >
        <Icon sx={{ fontSize: 32 }} />
      </Box>

      <Typography variant="h6" sx={{ fontWeight: 700, color: "text.primary", mb: 0.5 }}>
        {title}
      </Typography>

      <Typography variant="body2" sx={{ color: "text.secondary", maxWidth: 400, mb: 3 }}>
        {description}
      </Typography>

      {actionLabel && onAction && (
        <Button variant="contained" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </Paper>
  );
}
