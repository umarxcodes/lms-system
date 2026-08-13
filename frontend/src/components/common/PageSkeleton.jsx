import React from "react";
import { Box, Card, Skeleton, Stack, Grid } from "@mui/material";

export default function PageSkeleton({ type = "table" }) {
  if (type === "dashboard") {
    return (
      <Stack spacing={3}>
        <Skeleton variant="rounded" height={80} />
        <Grid container spacing={3}>
          {[1, 2, 3, 4].map((i) => (
            <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
              <Skeleton variant="rounded" height={120} />
            </Grid>
          ))}
        </Grid>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Skeleton variant="rounded" height={280} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Skeleton variant="rounded" height={280} />
          </Grid>
        </Grid>
      </Stack>
    );
  }

  if (type === "cards") {
    return (
      <Grid container spacing={3}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
            <Skeleton variant="rounded" height={200} />
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Card sx={{ p: 3 }}>
      <Stack spacing={2}>
        <Stack direction="row" justifyContent="space-between">
          <Skeleton variant="rounded" width={200} height={36} />
          <Skeleton variant="rounded" width={120} height={36} />
        </Stack>
        <Skeleton variant="rounded" height={40} />
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} variant="rounded" height={48} />
        ))}
      </Stack>
    </Card>
  );
}
