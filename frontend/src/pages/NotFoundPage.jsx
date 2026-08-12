import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";

const NotFoundPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          py: 4,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 6 },
            borderRadius: 4,
            backgroundColor: "background.paper",
            border: `1px solid ${theme.palette.divider}`,
            maxWidth: 600,
            width: "100%",
          }}
        >
          {/* Visual Highlight */}
          <Box
            sx={{
              position: "relative",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2,
            }}
          >
            <Typography
              variant="h1"
              component="div"
              sx={{
                fontSize: { xs: "6rem", sm: "9rem" },
                fontWeight: 900,
                letterSpacing: -2,
                color: "primary.main",
                opacity: 0.15,
                lineHeight: 1,
                userSelect: "none",
              }}
            >
              404
            </Typography>
            <SearchIcon
              sx={{
                position: "absolute",
                fontSize: { xs: "3rem", sm: "4.5rem" },
                color: "primary.main",
              }}
            />
          </Box>

          {/* Heading & Subtext */}
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              fontSize: { xs: "1.5rem", sm: "2.125rem" },
            }}
          >
            Page Not Found
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 4, maxWidth: 450, mx: "auto" }}
          >
            There is no route at <code>{location.pathname}</code>
          </Typography>

          {/* Action Buttons */}
          {/* Action Buttons */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
              width: "100%",
            }}
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<HomeIcon />}
              onClick={() => navigate("/")}
              fullWidth={isMobile}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                px: 3,
              }}
            >
              Back to Home
            </Button>

            <Button
              variant="outlined"
              size="large"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(-1)}
              fullWidth={isMobile}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                px: 3,
              }}
            >
              Go Back
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default NotFoundPage;
