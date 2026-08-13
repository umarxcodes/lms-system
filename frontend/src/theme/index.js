import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1e40af", // SMIT Navy/Royal Blue
      light: "#3b82f6",
      dark: "#1e3a8a",
      contrastText: "#ffffff",
      50: "#eff6ff",
      100: "#dbeafe",
      200: "#bfdbfe",
    },
    secondary: {
      main: "#0284c7", // Sky blue accent
      light: "#38bdf8",
      dark: "#0369a1",
      contrastText: "#ffffff",
      50: "#f0f9ff",
    },
    background: {
      default: "#f8fafc",
      paper: "#ffffff",
    },
    text: {
      primary: "#0f172a",
      secondary: "#64748b",
      disabled: "#94a3b8",
    },
    divider: "#e2e8f0",
    grey: {
      50: "#f8fafc",
      100: "#f1f5f9",
      200: "#e2e8f0",
      300: "#cbd5e1",
      400: "#94a3b8",
      500: "#64748b",
      600: "#475569",
      700: "#334155",
      800: "#1e293b",
      900: "#0f172a",
    },
    status: {
      present: "#16a34a",
      absent: "#dc2626",
      late: "#d97706",
      excused: "#0284c7",
      pending: "#64748b",
      inProgress: "#2563eb",
      completed: "#16a34a",
      onHold: "#eab308",
    },
  },
  typography: {
    fontFamily: [
      '"Plus Jakarta Sans"',
      '"Inter"',
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      "sans-serif",
    ].join(","),
    h1: { fontSize: "2.1rem", fontWeight: 800, letterSpacing: "-0.025em" },
    h2: { fontSize: "1.75rem", fontWeight: 800, letterSpacing: "-0.02em" },
    h3: { fontSize: "1.4rem", fontWeight: 700, letterSpacing: "-0.015em" },
    h4: { fontSize: "1.2rem", fontWeight: 700, letterSpacing: "-0.01em" },
    h5: { fontSize: "1.05rem", fontWeight: 700 },
    h6: { fontSize: "0.9rem", fontWeight: 700 },
    subtitle1: { fontSize: "0.95rem", color: "#64748b" },
    subtitle2: { fontSize: "0.85rem", color: "#64748b", fontWeight: 500 },
    body1: { fontSize: "0.925rem", color: "#0f172a" },
    body2: { fontSize: "0.85rem", color: "#475569" },
    button: { textTransform: "none", fontWeight: 700, letterSpacing: "0.01em" },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    "none",
    "0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px 0 rgba(0, 0, 0, 0.02)",
    "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
    "0 10px 15px -3px rgba(0, 0, 0, 0.07), 0 4px 6px -2px rgba(0, 0, 0, 0.03)",
    "0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
    ...Array(19).fill("0 10px 15px -3px rgba(0, 0, 0, 0.07)"),
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#f8fafc",
          scrollbarColor: "#cbd5e1 transparent",
          "&::-webkit-scrollbar": {
            width: "8px",
            height: "8px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#cbd5e1",
            borderRadius: "4px",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: "8px 18px",
          fontWeight: 700,
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 4px 12px rgba(30, 64, 175, 0.18)",
            transform: "translateY(-1px)",
          },
        },
        containedPrimary: {
          background: "linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%)",
          "&:hover": {
            background: "linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)",
          },
        },
        outlinedPrimary: {
          borderColor: "#cbd5e1",
          color: "#1e40af",
          "&:hover": {
            borderColor: "#1e40af",
            backgroundColor: "rgba(30, 64, 175, 0.04)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: "1px solid #e2e8f0",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)",
          transition: "box-shadow 0.2s ease, transform 0.2s ease",
          backgroundImage: "none",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 700,
          color: "#475569",
          backgroundColor: "#f8fafc",
          borderBottom: "1px solid #e2e8f0",
          fontSize: "0.78rem",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          padding: "12px 16px",
        },
        body: {
          color: "#0f172a",
          fontSize: "0.875rem",
          borderBottom: "1px solid #f1f5f9",
          padding: "14px 16px",
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: "background-color 0.15s ease",
          "&:hover": {
            backgroundColor: "rgba(30, 64, 175, 0.02) !important",
          },
          "&:last-child td": {
            borderBottom: "none",
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          backgroundColor: "#ffffff",
          "& fieldset": {
            borderColor: "#cbd5e1",
          },
          "&:hover fieldset": {
            borderColor: "#94a3b8",
          },
          "&.Mui-focused fieldset": {
            borderColor: "#1e40af",
            borderWidth: "1.5px",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 700,
          borderRadius: 8,
          fontSize: "0.75rem",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20,
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "#0f172a",
          borderRadius: 6,
          fontSize: "0.75rem",
          fontWeight: 600,
          padding: "6px 10px",
        },
      },
    },
  },
});

export default theme;
