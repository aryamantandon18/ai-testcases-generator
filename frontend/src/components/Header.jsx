import React, { useContext } from "react";
import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import ThemeToggle from "./ThemeToggle";
import { AuthContext } from "../contexts/AuthContext";
import { Link, useLocation } from "react-router-dom";

export default function Header({ mode, setMode }) {
  const { token, logout } = useContext(AuthContext);
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  const tabs = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
  ];

  return (
    <AppBar  position="static"
        color="default"
        sx={{
          backgroundColor: (theme) =>
            mode === "light" ? theme.palette.background.paper : theme.palette.background.default,
          borderBottom: 1,
          borderColor: "divider",
        }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            cursor: "pointer",
            color: (theme) => theme.palette.text.primary, // dynamic text color
          }}

          onClick={() => (window.location.href = "/")}
        >
          TestCase Generator
        </Typography>

        {/* Navigation Tabs */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {tabs.map((tab) => (
            <Button
              key={tab.label}
              component={Link}
              to={tab.path}
               sx={{
                fontWeight: location.pathname === tab.path ? 700 : 400,
                color: location.pathname === tab.path ? "primary.main" : "text.primary",
              }}
            >
              {tab.label}
            </Button>
          ))}

          {/* Only show logout if logged in */}
          {token && token.length > 0 ? (
            <Button onClick={handleLogout} sx={{ ml: 2 , color:(theme)=>theme.palette.text.primary}}>
              Logout
            </Button>
          ) : null}

          {/* Theme Toggle */}
          <ThemeToggle mode={mode} setMode={setMode} />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
