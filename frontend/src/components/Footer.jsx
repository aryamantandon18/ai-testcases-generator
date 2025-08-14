import React from "react";
import { Box, Container, Typography, Button } from "@mui/material";

export default function Footer() {
  return (
    <Box component="footer" sx={{ py: 4, backgroundColor: "#181818", color: "white", mt: 5 }}>
      <Container sx={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
        <Typography>© 2025 TestCase Generator. All rights reserved.</Typography>
        <Box sx={{ display: "flex", gap: 3 }}>
          <Button color="inherit" href="#">Privacy</Button>
          <Button color="inherit" href="#">Terms</Button>
          <Button color="inherit" href="#">Contact</Button>
        </Box>
      </Container>
    </Box>
  );
}
