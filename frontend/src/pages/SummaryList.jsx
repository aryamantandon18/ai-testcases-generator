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
          p: 3,
          borderRadius: 4,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
        }}
      >
        {/* Title */}
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {s.title || "Untitled Test Case"}
        </Typography>

        {/* Description */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ flexGrow: 1 }}
        >
          {s.description || "No description provided."}
        </Typography>

        {/* Files */}
        {Array.isArray(s.targetFiles) && s.targetFiles.length > 0 && (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
            {s.targetFiles.map((file, i) => (
              <Chip
                key={i}
                label={file}
                size="small"
                variant="outlined"
                sx={{
                  fontSize: "0.75rem",
                  borderRadius: "6px",
                }}
              />
            ))}
          </Box>
        )}

        {/* Button */}
        <Box display="flex" justifyContent="flex-end">
          <AnimatedButton onClick={() => generateCode(s)}>
            Generate Code
          </AnimatedButton>
        </Box>
      </Paper>
    </motion.div>
  </Grid>
))}

        </Grid>
      )}
    </Box>
  );
}
