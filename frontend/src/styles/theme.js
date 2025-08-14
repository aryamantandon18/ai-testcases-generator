import { createTheme } from "@mui/material/styles";

const lightShadows = [
  'none', // 0
  '0 1px 2px 0 rgba(0,0,0,0.05)', // 1
  '0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px 0 rgba(0,0,0,0.06)', // 2
  '0 1px 3px 0 rgba(0,0,0,0.12), 0 1px 2px 0 rgba(0,0,0,0.06)', // 3
  '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)', // 4
  // ... fill until index 24
];

const darkShadows = [
  'none', // 0
  '0 1px 2px 0 rgba(0,0,0,0.1)',
  '0 1px 3px 0 rgba(0,0,0,0.2), 0 1px 2px 0 rgba(0,0,0,0.12)',
  '0 1px 3px 0 rgba(0,0,0,0.25), 0 1px 2px 0 rgba(0,0,0,0.15)',
  '0 4px 6px -1px rgba(0,0,0,0.2), 0 2px 4px -1px rgba(0,0,0,0.12)',
  // ... fill until index 24
];

export const getAppTheme = (mode = "light") =>
  createTheme({
    palette: {
      mode,
      ...(mode === "light"
        ? {
            // Light theme colors
            primary: {
              main: "#4361ee",       // Vibrant blue
              light: "#4895ef",      // Lighter blue
              dark: "#3a0ca3",       // Deep purple-blue
              contrastText: "#ffffff"
            },
            secondary: {
              main: "#f72585",       // Energetic pink
              light: "#ff70a6",      // Soft pink
              dark: "#b5179e",       // Deep magenta
              contrastText: "#ffffff"
            },
            background: {
              default: "#f8f9fa",    // Very light gray
              paper: "#ffffff",      // Pure white
            },
            text: {
              primary: "#212529",     // Dark gray for text
              secondary: "#495057",   // Medium gray
            },
            success: {
              main: "#4cc9f0",       // Bright cyan-blue
              contrastText: "#ffffff"
            },
            warning: {
              main: "#f8961e",       // Vibrant orange
              contrastText: "#ffffff"
            },
            error: {
              main: "#ef233c",       // Bright red
              contrastText: "#ffffff"
            },
            info: {
              main: "#7209b7",       // Deep purple
              contrastText: "#ffffff"
            }
          }
        : {
            // Dark theme colors
            primary: {
              main: "#4895ef",       // Bright blue
              light: "#4cc9f0",      // Cyan-blue
              dark: "#4361ee",      // Deep blue
              contrastText: "#ffffff"
            },
            secondary: {
              main: "#f72585",       // Vibrant pink
              light: "#ff70a6",      // Soft pink
              dark: "#b5179e",       // Deep magenta
              contrastText: "#ffffff"
            },
            background: {
              default: "#0f172a",    // Deep navy blue
              paper: "#1e293b",      // Slightly lighter navy
            },
            text: {
              primary: "#e2e8f0",    // Light gray-blue
              secondary: "#94a3b8",   // Medium gray-blue
            },
            success: {
              main: "#10b981",       // Emerald green
              contrastText: "#ffffff"
            },
            warning: {
              main: "#f59e0b",       // Golden yellow
              contrastText: "#ffffff"
            },
            error: {
              main: "#ef4444",       // Bright red
              contrastText: "#ffffff"
            },
            info: {
              main: "#6366f1",       // Periwinkle purple
              contrastText: "#ffffff"
            }
          }),
    },
    typography: {
      fontFamily: [
        '"Inter"',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
      h1: {
        fontWeight: 800,
        fontSize: '3rem',
        lineHeight: 1.2,
      },
      h2: {
        fontWeight: 700,
        fontSize: '2.25rem',
        lineHeight: 1.3,
      },
      h3: {
        fontWeight: 600,
        fontSize: '1.75rem',
      },
      button: {
        textTransform: 'none',
        fontWeight: 600,
      }
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'light' ? '#ffffff' : '#1e293b',
            borderBottom: `1px solid ${mode === 'light' ? '#e2e8f0' : '#334155'}`,
          }
        }
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
            padding: '8px 16px',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            }
          },
          contained: {
            '&:hover': {
              transform: 'translateY(-1px)',
            }
          }
        }
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: '12px',
            boxShadow: mode === 'light' 
              ? '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)'
              : '0 1px 3px rgba(0,0,0,0.2), 0 1px 2px rgba(0,0,0,0.12)',
            transition: 'all 0.2s ease',
            '&:hover': {
              boxShadow: mode === 'light'
                ? '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)'
                : '0 4px 6px -1px rgba(0,0,0,0.2), 0 2px 4px -1px rgba(0,0,0,0.12)',
            }
          }
        }
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
            }
          }
        }
      },
      MuiAvatar: {
        styleOverrides: {
          root: {
            width: 40,
            height: 40,
          }
        }
      }
    },
    shape: {
      borderRadius: 8,
    },
  shadows: mode === 'light' ? lightShadows : darkShadows,
  });