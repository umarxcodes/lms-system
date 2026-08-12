import Header, { UserProfile, DateButton } from "../components/Header";
import { PageContent } from "../components/AppLayout";
import { Box } from "@mui/material";

export default function AttendancePage() {
  return (
    <>
      <Header
        title="Attendance Management"
        subtitle="Mark and track daily student attendance and history."
        actions={
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "absolute",
                right: 55,
                gap: 1.5,
              }}
            >
              <DateButton
                date="Oct 24, 2024"
                onClick={() => {
                  /* open date picker */
                }}
              />
              <UserProfile />
            </Box>
          </>
        }
      />
      <PageContent>{/* attendance content */}</PageContent>
    </>
  );
}
