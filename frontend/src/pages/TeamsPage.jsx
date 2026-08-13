// pages/TeamsPage.jsx
import { Button, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Header, { UserProfile } from "../components/Header";
import { PageContent } from "../components/AppLayout";

export default function TeamsPage() {
  return (
    <>
      <Header
        title="Teams & Projects"
        subtitle="Organize students into teams and track their project milestones."
        actions={
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "absolute",
                right: 55,
              }}
            >
              <Button
                variant="contained"
                startIcon={<AddIcon sx={{ fontSize: 16 }} />}
                sx={{
                  bgcolor: "#2563eb", // brand-600
                  "&:hover": { bgcolor: "#1d4ed8" }, // brand-700
                  borderRadius: 2, // 8px, matches rounded-lg
                  px: 2, // px-4
                  mr: 1,
                  height: 35,
                  fontSize: 14,
                  fontWeight: 600,
                  textTransform: "none",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)", // shadow-sm
                  whiteSpace: "nowrap",
                }}
              >
                Create New Team
              </Button>
              <UserProfile showDetails={false} />
            </Box>
          </>
        }
      />

      <PageContent>{/* Write your code */}</PageContent>
    </>
  );
}
