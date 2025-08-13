import React, { useContext, useMemo, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { ThemeProvider, CssBaseline, Container } from "@mui/material";
import { getAppTheme } from "./styles/theme";
import Header from "./components/Header";
import Login from "./pages/Login";
import RepoExplorer from "./pages/RepoExplorer";
import SummaryList from "./pages/SummaryList";
import CodePreview from "./pages/CodePreview";
import { AuthContext } from "./contexts/AuthContext";
import { AnimatePresence, motion } from "framer-motion";
import ProtectedRoute from "./components/ProtectedRoute.jsx"; 

export default function App() {
  const [mode, setMode] = useState(localStorage.getItem("theme") || "light");
  const theme = useMemo(() => getAppTheme(mode), [mode]);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header mode={mode} setMode={(m) => { setMode(m); localStorage.setItem("theme", m); }} />
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <AnimatePresence mode="wait">
          <motion.div key={location.pathname} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
            <Routes>
              <Route path="/" element={<ProtectedRoute><RepoExplorer /></ProtectedRoute>} />
              <Route path="/summaries" element={<ProtectedRoute><SummaryList /></ProtectedRoute>} />
              <Route path="/preview" element={<ProtectedRoute><CodePreview /></ProtectedRoute>} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </Container>
    </ThemeProvider>
  );
}
