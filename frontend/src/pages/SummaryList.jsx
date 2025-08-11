// pages/SummaryList.jsx
import React, { useContext } from "react";
import {
  Paper,
  Typography,
  Chip,
  useTheme,
  Grid,
  Box
} from "@mui/material";
import AnimatedButton from "../components/AnimatedButton";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import { motion } from "framer-motion";
import { AuthContext } from "../contexts/AuthContext";

export default function SummaryList() {
  const {token} = useContext(AuthContext);
  const navigate = useNavigate();
  const theme = useTheme();

  const data = JSON.parse(sessionStorage.getItem("tcg_summaries") || "{}");
  const summaries = data?.summaries || [];
  const files = data?.files || [];

  const generateCode = async (summary) => {
    try {
      const resp = await API.post("/api/ai/generate", {
        files,
        summary: JSON.stringify(summary)
      },{
        headers:{
          Authorization: `Bearer ${token}`,
        }
      });
      sessionStorage.setItem("tcg_generated", JSON.stringify(resp.data));
      navigate("/preview");
    } catch (err) {
      alert(
        "Error generating code: " +
          (err?.response?.data?.message || err.message)
      );
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3 }}>
        AI Suggested Test Cases
      </Typography>

      {summaries.length === 0 ? (
        <Typography color="text.secondary">
          No suggestions yet. Please run AI generation first.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {summaries.map((s, idx) => (
            <Grid item xs={12} md={6} key={idx}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Paper
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    height: "100%",
                    backgroundColor:
                      theme.palette.mode === "dark" ? "#1e1e1e" : "#ffffff",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between"
                  }}
                >
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: "bold", mb: 1 }}
                    >
                      {s.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {s.description}
                    </Typography>

                    {Array.isArray(s.targetFiles) && s.targetFiles.length > 0 && (
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 0.5,
                          mb: 2
                        }}
                      >
                        {s.targetFiles.map((file, i) => (
                          <Chip
                            key={i}
                            label={file}
                            size="small"
                            sx={{
                              backgroundColor:
                                theme.palette.mode === "dark"
                                  ? "#2a2a2a"
                                  : "#f0f0f0",
                              fontSize: "0.75rem"
                            }}
                          />
                        ))}
                      </Box>
                    )}
                  </Box>

                  <AnimatedButton onClick={() => generateCode(s)}>
                    Generate Code
                  </AnimatedButton>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
