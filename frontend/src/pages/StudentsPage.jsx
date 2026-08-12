// pages/StudentsPage.jsx
import { Box } from "@mui/material";
// import AddIcon from "@mui/icons-material/Add";
import Header, { UserProfile, NotificationButton } from "../components/Header";
import { PageContent } from "../components/AppLayout";

export default function StudentsPage() {
  return (
    <>
      <Header
        title="Students Management"
        subtitle="Manage student roster, enrollment, and cohort assignments."
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
              <NotificationButton
                onClick={() => {
                  /* open notifications */
                }}
              />
              <UserProfile showDetails={true} />
            </Box>
          </>
        }
      />

      <PageContent>{/* summary cards, table, etc. */}</PageContent>
    </>
  );
}
