import React, { useState, useMemo, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline, Container, IconButton, Box } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Home from "./pages/Home";
import ErrorPage from "./pages/ErrorPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [mode, setMode] = useState(() => {
    // Get saved theme from localStorage or default to 'light'
    return localStorage.getItem("theme") || "light";
  });

  // Save theme to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("theme", mode);
  }, [mode]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: "#1db954", // Spotify green
          },
          secondary: {
            main: "#191414", // Spotify black
          },
          background: {
            default: mode === "light" ? "#f9f9f9" : "#121212",
            paper: mode === "light" ? "#ffffff" : "#282828",
          },
        },
        components: {
          MuiContainer: {
            styleOverrides: {
              root: {
                backgroundColor: mode === "light" ? "#ffffff" : "#282828",
                borderRadius: 8,
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                padding: "24px",
                marginTop: "24px",
                transition: "all 0.3s ease-in-out",
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                transition: "all 0.3s ease-in-out",
              },
            },
          },
          MuiIconButton: {
            variants: [
              {
                props: { className: "rotate-hover" },
                style: {
                  transition: "transform 0.3s ease-in-out",
                  "&:hover": {
                    transform: "rotate(180deg)",
                  },
                },
              },
            ],
          },
        },
      }),
    [mode]
  );

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
          transition: "background-color 0.3s ease-in-out",
        }}
      >
        <IconButton
          onClick={toggleTheme}
          sx={{
            position: "fixed",
            top: 16,
            right: 16,
            color: mode === "light" ? "grey.800" : "grey.200",
          }}
        >
          {mode === "light" ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </Router>
      </Box>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </ThemeProvider>
  );
};

export default App;
