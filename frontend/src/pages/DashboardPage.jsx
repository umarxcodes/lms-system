import Header, {
  UserProfile,
  DateButton,
  NotificationButton,
} from "../components/Header";
import { PageContent } from "../components/AppLayout";
import { Box } from "@mui/material";
// import { useState } from "react";

export default function DashboardPage() {
  // Replace this with useContext variables
  // const [name, setName] = useState("Ali");
  return (
    <>
      <Header
        title="Admin Dashboard"
        // subtitle={`Welcome Back, ${name}!`}
        subtitle="Welcome Back, Ali!"
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
