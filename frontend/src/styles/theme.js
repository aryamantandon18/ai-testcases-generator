import { createTheme } from "@mui/material/styles";

export const getAppTheme = (mode = "light") =>
  createTheme({
    palette: {
      mode,
      ...(mode === "light"
        ? {
            primary: { main: "#1976d2" },
            background: { default: "#f7f9fc", paper: "#fff" }
          }
        : {
            primary: { main: "#90caf9" },
            background: { default: "#0b1220", paper: "#0f1724" }
          })
    },
    components: {
      MuiAppBar: { defaultProps: { elevation: 1 } }
    }
  });
