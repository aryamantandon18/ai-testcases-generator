import React from "react";
import { List, ListItemButton, ListItemText, Checkbox } from "@mui/material";
import { motion } from "framer-motion";

export default function FileTree({ files, selected, setSelected }) {
  const toggle = (path) => {
    setSelected((s) => (s.includes(path) ? s.filter(p => p !== path) : [...s, path]));
  };

  return (
    <List component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {files.map(f => (
        <ListItemButton key={f.path} onClick={() => toggle(f.path)} sx={{ display: "flex", gap: 2 }}>
          <Checkbox checked={selected.includes(f.path)} />
          <ListItemText primary={f.path} />
        </ListItemButton>
      ))}
    </List>
  );
}
