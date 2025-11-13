import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#2D3748", light: "#4A5568", dark: "#1A202C" },
    secondary: { main: "#E53E3E", light: "#FC8181", dark: "#C53030" },
    background: { default: "#F7FAFC", paper: "#FFFFFF" },
    text: { primary: "#2D3748", secondary: "#4A5568" },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h3: { fontWeight: 800, letterSpacing: "-0.02em" },
    h4: { fontWeight: 700, letterSpacing: "-0.01em" },
    h6: { fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: "none",
          fontWeight: 600,
          boxShadow: "none",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: 16, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" },
      },
    },
    MuiChip: {
      styleOverrides: { root: { borderRadius: 20, fontWeight: 500 } },
    },
  },
});

export default theme;
