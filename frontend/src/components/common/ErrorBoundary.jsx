import React from "react";
import { Box, Typography, Button, Container, Paper } from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught React boundary error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="sm" sx={{ py: 10 }}>
          <Paper
            elevation={0}
            sx={{
              p: 5,
              textAlign: "center",
              borderRadius: 4,
              border: "1px solid",
              borderColor: "grey.200",
              bgcolor: "background.paper",
            }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                bgcolor: "error.50",
                color: "error.main",
                display: "grid",
                placeItems: "center",
                mx: "auto",
                mb: 2,
              }}
            >
              <ErrorIcon sx={{ fontSize: 36 }} />
            </Box>

            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: "text.primary" }}>
              Something went wrong
            </Typography>

            <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
              An unexpected application error occurred. Please refresh or return to the home screen.
            </Typography>

            {this.state.error && (
              <Box
                sx={{
                  p: 2,
                  mb: 3,
                  bgcolor: "grey.100",
                  borderRadius: 2,
                  textAlign: "left",
                  fontFamily: "monospace",
                  fontSize: "0.8rem",
                  color: "error.main",
                  overflowX: "auto",
                  wordBreak: "break-word",
                }}
              >
                {this.state.error.toString()}
              </Box>
            )}

            <Button variant="contained" color="primary" onClick={this.handleReset}>
              Back to Home
            </Button>
          </Paper>
        </Container>
      );
    }

    return this.props.children;
  }
}
