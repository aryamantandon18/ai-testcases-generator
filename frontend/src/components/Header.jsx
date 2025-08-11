import React, { useContext } from "react";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import ThemeToggle from "./ThemeToggle";
import { AuthContext } from "../contexts/AuthContext";
import AnimatedButton from "./AnimatedButton";

export default function Header({ mode, setMode }) {
  const { token,logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
  };

  return (
    <AppBar position="static" color="transparent" sx={{ borderBottom: 1, borderColor: "divider" }}>
      <Toolbar>
        <Typography variant="h6" sx={{ fontWeight: 700, mr: 2, cursor: "pointer" }} onClick={() => (window.location.href = "/")}>
          TestCase Generator
        </Typography>
        <Box sx={{ flex: 1 }} />
        <ThemeToggle mode={mode} setMode={setMode} />
        {token && token.length>0 ? (
          <>
            <AnimatedButton href="/">Explore repos</AnimatedButton>
            <AnimatedButton sx={{ ml: 2 }} onClick={handleLogout}>
              Logout
            </AnimatedButton>
          </>
        ) : (
          // <AnimatedButton href="/login">Login</AnimatedButton>
          null
        )}
      </Toolbar>
    </AppBar>
  );
}
