import React, { useMemo, useState, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider, CssBaseline, Container, Box } from "@mui/material";
import { getAppTheme } from "./styles/theme";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./pages/Login";
const RepoExplorer = React.lazy(() => import("./pages/RepoExplorer"));
import SummaryList from "./pages/SummaryList";
import CodePreview from "./pages/CodePreview";
import { AnimatePresence, motion } from "framer-motion";
import ProtectedRoute from "./components/Protected";
import About from "./components/About";

export default function App() {
  const location = useLocation();
  const [mode, setMode] = useState(localStorage.getItem("theme") || "light");
  const theme = useMemo(() => getAppTheme(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box display="flex" flexDirection="column" minHeight="100vh">
        {/* Header */}
        <Header mode={mode} setMode={(m) => { setMode(m); localStorage.setItem("theme", m); }} />

        {/* Main Content */}
        <Box component="main" flexGrow={1}>
          <Container maxWidth="xl" sx={{ mt: 4 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
              >
                <Suspense fallback={<div>Loading...</div>}>
                  <Routes location={location} key={location.pathname}>
                    <Route
                      path="/"
                      element={
                        <ProtectedRoute>
                          <RepoExplorer />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/summaries"
                      element={
                        <ProtectedRoute>
                          <SummaryList />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/preview"
                      element={
                        <ProtectedRoute>
                          <CodePreview />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/about" element={<About mode/>}/>
                    <Route path="/login" element={<Login mode={mode} setMode={setMode} />} />
                  </Routes>
                </Suspense>
              </motion.div>
            </AnimatePresence>
          </Container>
        </Box>

        {/* Footer */}
        <Footer />
      </Box>
    </ThemeProvider>
  );
}
