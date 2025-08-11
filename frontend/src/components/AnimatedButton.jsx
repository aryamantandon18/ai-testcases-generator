import React from "react";
import { Button } from "@mui/material";
import { motion } from "framer-motion";

export default function AnimatedButton({ children, href, onClick }) {
  return (
    <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
      <Button variant="contained" color="primary" href={href} onClick={onClick} sx={{ ml: 2 }}>
        {children}
      </Button>
    </motion.div>
  );
}
