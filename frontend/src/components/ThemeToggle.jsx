import React from "react";
import { IconButton } from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { motion } from "framer-motion";

export default function ThemeToggle({ mode, setMode }) {
  return (
    <motion.div whileTap={{ scale: 0.9 }} style={{ display: "inline-block", marginRight: 12 }}>
      <IconButton 
        onClick={() => setMode(mode === "light" ? "dark" : "light")}  
        sx={{
          color: (theme) => theme.palette.mode === 'light'
            ? theme.palette.text.primary
            : theme.palette.text.primary, // You can pick secondary or primary.main if you want
        }}
      >
        {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
      </IconButton>
    </motion.div>
  );
}
