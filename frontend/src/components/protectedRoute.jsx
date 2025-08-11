import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { Box, CircularProgress } from "@mui/material";

export default function ProtectedRoute({ children }) {
  const { token,loading } = useContext(AuthContext);
    if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
