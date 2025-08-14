import React, { useContext } from "react";
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  Button, 
  IconButton, 
  Menu, 
  MenuItem, 
  useTheme,
  useMediaQuery,
  Divider,
  Slide,
  useScrollTrigger,
  alpha,
  ListItemIcon
} from "@mui/material";
import { 
  Menu as MenuIcon,
  GitHub as GitHubIcon,
  Logout as LogoutIcon,
  Home as HomeIcon,
  Info as InfoIcon
} from "@mui/icons-material";
import ThemeToggle from "./ThemeToggle";
import { AuthContext } from "../contexts/AuthContext";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export default function Header({ mode, setMode }) {
  const { token, logout } = useContext(AuthContext);
  const theme = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
  };

  const tabs = [
    { label: "Home", path: "/", icon: <HomeIcon fontSize="small" /> },
    { label: "About", path: "/about", icon: <InfoIcon fontSize="small" /> },
  ];

  // Hide header on scroll down
  const trigger = useScrollTrigger();

  return (
    <>
      <Slide appear={false} direction="down" in={!trigger}>
        <AppBar 
          position="fixed"
          elevation={0}
          sx={{
            backgroundColor: theme.palette.background.default,
            borderBottom: `1px solid ${theme.palette.divider}`,
            backdropFilter: 'blur(8px)',
            zIndex: theme.zIndex.drawer + 1
          }}
        >
          <Toolbar sx={{ 
            display: "flex", 
            justifyContent: "space-between",
            px: { xs: 2, md: 4 },
            py: 1
          }}>
            {/* Logo/Title */}
            <Box 
              component={motion.div}
              whileHover={{ scale: 1.05 }}
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="home"
                onClick={() => window.location.href = "/"}
                sx={{ mr: 1 }}
              >
                <GitHubIcon sx={{ 
                  color: theme.palette.mode === 'dark' ? 
                    theme.palette.secondary.main : 
                    theme.palette.primary.main 
                }} />
              </IconButton>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{
                  fontWeight: 800,
                  cursor: "pointer",
                  color: theme.palette.text.primary,
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                TestCaseGen
              </Typography>
            </Box>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ 
                display: "flex", 
                alignItems: "center", 
                gap: 1,
                ml: 'auto',
                mr: 2
              }}>
                {tabs.map((tab) => (
                  <Button
                    key={tab.label}
                    component={Link}
                    to={tab.path}
                    startIcon={tab.icon}
                    sx={{
                      fontWeight: location.pathname === tab.path ? 700 : 500,
                      color: location.pathname === tab.path ? 
                        theme.palette.primary.main : 
                        theme.palette.text.secondary,
                      borderRadius: 2,
                      px: 2,
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.1)
                      }
                    }}
                  >
                    {tab.label}
                  </Button>
                ))}

                {token && token.length > 0 && (
                  <Button 
                    onClick={handleLogout}
                    startIcon={<LogoutIcon />}
                    sx={{
                      color: theme.palette.text.secondary,
                      borderRadius: 2,
                      px: 2,
                      ml: 1,
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.error.main, 0.1),
                        color: theme.palette.error.main
                      }
                    }}
                  >
                    Logout
                  </Button>
                )}
              </Box>
            )}

            {/* Theme Toggle - Always visible */}
            <ThemeToggle mode={mode} setMode={setMode} />

            {/* Mobile Menu */}
            {isMobile && (
              <>
                <IconButton
                  size="large"
                  aria-label="menu"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  sx={{
                  ml: 1 ,
                  color: (theme) => theme.palette.mode === 'light'
                    ? theme.palette.text.primary
                    : theme.palette.text.primary,
                }}
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={open}
                  onClose={handleClose}
                  PaperProps={{
                    sx: {
                      backgroundColor: theme.palette.background.paper,
                      border: `1px solid ${theme.palette.divider}`,
                      minWidth: 200,
                      mt: 5
                    }
                  }}
                >
                  {tabs.map((tab) => (
                    <MenuItem 
                      key={tab.label}
                      component={Link}
                      to={tab.path}
                      onClick={handleClose}
                      selected={location.pathname === tab.path}
                      sx={{
                        color: location.pathname === tab.path ? 
                          theme.palette.primary.main : 
                          theme.palette.text.primary,
                        fontWeight: location.pathname === tab.path ? 600 : 400,
                        py: 1.5,
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.1)
                        }
                      }}
                    >
                      <ListItemIcon sx={{ color: 'inherit' }}>
                        {tab.icon}
                      </ListItemIcon>
                      {tab.label}
                    </MenuItem>
                  ))}
                  {token && token.length > 0 && (
                    <>
                      <Divider sx={{ my: 1 }} />
                      <MenuItem 
                        onClick={handleLogout}
                        sx={{
                          color: theme.palette.error.main,
                          py: 1.5,
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.error.main, 0.1)
                          }
                        }}
                      >
                        <ListItemIcon sx={{ color: 'inherit' }}>
                          <LogoutIcon />
                        </ListItemIcon>
                        Logout
                      </MenuItem>
                    </>
                  )}
                </Menu>
              </>
            )}
          </Toolbar>
        </AppBar>
      </Slide>
      
      {/* Add margin spacer to prevent content from being hidden behind the fixed header */}
      <Toolbar sx={{ mb: 2 }} />
    </>
  );
}