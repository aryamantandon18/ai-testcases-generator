import React from "react";
import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  Grid, 
  useTheme,
  Avatar,
  Divider,
  Chip,
  useMediaQuery,
  Button
} from "@mui/material";
import {
  Code as CodeIcon,
  GitHub as GitHubIcon,
  AutoAwesome as AutoAwesomeIcon,
  CheckCircle as CheckCircleIcon,
  Terminal as TerminalIcon,
  IntegrationInstructions as IntegrationInstructionsIcon,
  Palette as PaletteIcon,
  Devices as DevicesIcon,
  Science as ScienceIcon,
  Security as SecurityIcon,
  Bolt as BoltIcon
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const FeatureCard = ({ icon, title, description }) => {
  const theme = useTheme();
  
  return (
    <Paper 
      elevation={2}
      component={motion.div}
      whileHover={{ y: -5 }}
      sx={{
        p: 3,
        height: '100%',
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
        transition: 'all 0.3s ease',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Avatar sx={{ 
          mr: 2, 
          bgcolor: theme.palette.mode === 'dark' ? 
            theme.palette.secondary.main : 
            theme.palette.primary.light,
          color: theme.palette.getContrastText(
            theme.palette.mode === 'dark' ? 
              theme.palette.secondary.main : 
              theme.palette.primary.light
          )
        }}>
          {icon}
        </Avatar>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
      </Box>
      <Typography variant="body1" color="text.secondary">
        {description}
      </Typography>
    </Paper>
  );
};

export default function About({ mode }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const features = [
    {
      icon: <AutoAwesomeIcon />,
      title: "AI-Powered",
      description: "Leverages advanced AI to generate comprehensive test cases tailored to your code."
    },
    {
      icon: <GitHubIcon />,
      title: "GitHub Integration",
      description: "Seamlessly connect with your GitHub repositories to analyze your codebase."
    },
    {
      icon: <TerminalIcon />,
      title: "Test Generation",
      description: "Automatically creates test.spec.js files with ready-to-use test cases."
    },
    {
      icon: <ScienceIcon />,
      title: "Smart Suggestions",
      description: "Provides intelligent recommendations for edge cases and test scenarios."
    },
    {
      icon: <SecurityIcon />,
      title: "Security Checks",
      description: "Identifies potential security vulnerabilities in your test coverage."
    },
    {
      icon: <BoltIcon />,
      title: "Fast Execution",
      description: "Generates tests in seconds, saving you hours of manual work."
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box 
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{ textAlign: 'center', mb: 6 }}
      >
        <Chip 
          label="AI-Powered Tool" 
          color="primary" 
          sx={{ mb: 2, px: 2, py: 1, fontWeight: 600 }} 
        />
        <Typography 
          variant="h2" 
          sx={{ 
            fontWeight: 800, 
            mb: 2,
            color: "WindowFrame",
            fontSize: isMobile ? '2.5rem' : '3rem'
          }}
        >
          Revolutionize Your Testing Workflow
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            maxWidth: 700, 
            mx: 'auto',
            color:"InfoText",
            fontWeight: 400
          }}
        >
          Automatically generate comprehensive test cases for your JavaScript/TypeScript projects with AI assistance.
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 8 }}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <FeatureCard {...feature} />
          </Grid>
        ))}
      </Grid>

      <Paper 
        elevation={0}
        sx={{ 
          p: 4, 
          borderRadius: 3,
          backgroundColor: theme.palette.background.default,
          border: `1px solid ${theme.palette.divider}`,
          mb: 6
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
          How It Works
        </Typography>
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', mb: 3 }}>
              <Avatar sx={{ 
                mr: 2, 
                bgcolor: theme.palette.primary.main,
                color: theme.palette.getContrastText(theme.palette.primary.main),
                width: 40,
                height: 40
              }}>
                1
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Connect Your Repository
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Sign in with GitHub and browse your repositories to select files for test generation.
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', mb: 3 }}>
              <Avatar sx={{ 
                mr: 2, 
                bgcolor: theme.palette.primary.main,
                color: theme.palette.getContrastText(theme.palette.primary.main),
                width: 40,
                height: 40
              }}>
                2
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Select Files
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Choose the files you want to generate tests for from your repository.
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex' }}>
              <Avatar sx={{ 
                mr: 2, 
                bgcolor: theme.palette.primary.main,
                color: theme.palette.getContrastText(theme.palette.primary.main),
                width: 40,
                height: 40
              }}>
                3
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Generate Tests
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Our AI analyzes your code and generates comprehensive test cases in seconds.
                </Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                height: '100%',
                borderRadius: 2,
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Ready to Get Started?
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Join hundreds of developers who are saving time and improving their code quality with AI-generated tests.
              </Typography>
              <Button
                component={Link}
                to="/"
                variant="contained"
                size="large"
                sx={{
                  alignSelf: 'flex-start',
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600
                }}
              >
                Generate Your First Tests
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
      
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Built with React, Node.js, and the power of AI
        </Typography>
      </Box>
    </Container>
  );
}