import React, { useState } from "react";
import { Box, Typography, Paper } from "@mui/material";
import AnimatedButton from "../components/AnimatedButton";

export default function Login() {
  const [isLoading,setIsLoading] = useState(false);
  const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
  const redirect = `${import.meta.env.VITE_BACKEND_URL || "http://localhost:4000"}/api/auth/github/callback`;
  const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirect)}&scope=repo`;

  const handleLogin = () =>{
    setIsLoading(true);
    window.location.href = url;
  }
  return (
    <Box display="flex" alignItems="center" justifyContent="center" minHeight="50vh">
      <Paper sx={{ p: 4, width: 680 }}>
        <Typography variant="h4" gutterBottom>Sign in with GitHub</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Connect your GitHub account to browse a repository, select files and generate suggested test cases with AI.
        </Typography>
        <AnimatedButton onClick={handleLogin}  disabled={isLoading}>
          {isLoading ? "Redirecting..." : "Continue with GitHub"}
        </AnimatedButton>
      </Paper>
    </Box>
  );
}
