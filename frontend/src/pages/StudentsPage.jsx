// pages/StudentsPage.jsx
import { Box } from "@mui/material";
// import AddIcon from "@mui/icons-material/Add";
import Header, { UserProfile, NotificationButton } from "../components/Header";
import { PageContent } from "../components/AppLayout";
import StudentsTable from "../components/StudentsTable";

export default function StudentsPage() {
  const students = [
    {
      rollNumber: "102341",
      name: "Sarah Ahmed",
      email: "sarah@example.com",
      avatarSrc: "...",
      course: "Web & App Development",
      batch: "Batch 01",
      team: "Team Alpha",
    },
    {
      rollNumber: "102342",
      name: "Arsalan Khan",
      email: "arsalan@example.com",
      avatarSrc: "...",
      course: "Web & App Development",
      batch: "Batch 01",
      team: "Team Alpha",
    },
    {
      rollNumber: "102345",
      name: "Zeeshan Ali",
      email: "zeeshan@example.com",
      avatarSrc: "...",
      course: "Web & App Development",
      batch: "Batch 03",
      team: null,
    },
    // ...
  ];

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
              <UserProfile />
            </Box>
          </>
        }
      />

      <PageContent px={{ xs: 3, lg: 5 }}>
        <StudentsTable
          students={students}
          onAddStudent={() => {
            /* open add-student modal */
          }}
          // onView={(s) => {
          //   /* navigate to student detail */
          // }}
          // onEdit={(s) => {
          //   /* open edit modal */
          // }}
        />
      </PageContent>
    </>
  );
}
