import React from "react";
import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  Grid, 
  useTheme,
  Avatar,
  Chip,
  useMediaQuery,
  Button,
  alpha
} from "@mui/material";
import {
  Code as CodeIcon,
  GitHub as GitHubIcon,
  AutoAwesome as AutoAwesomeIcon,
  Terminal as TerminalIcon,
  Science as ScienceIcon,
  Security as SecurityIcon,
  Bolt as BoltIcon,
  Verified as VerifiedIcon,
  Psychology as PsychologyIcon
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const FeatureCard = ({ icon, title, description, index }) => {
  const theme = useTheme();
  
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Paper 
        component={motion.div}
        whileHover={{ y: -8 }}
        sx={{
          p: 3,
          height: '100%',
          borderRadius: 4,
          border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
          backgroundColor: theme.palette.background.paper,
          boxShadow: theme.shadows[2],
          position: 'relative',
          overflow: 'hidden',
          '&:before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar 
            sx={{ 
              mr: 2,
              width: 48,
              height: 48,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              color: theme.palette.getContrastText(theme.palette.primary.main),
              boxShadow: `0 4px 20px 0 ${alpha(theme.palette.primary.main, 0.2)}`
            }}
          >
            {icon}
          </Avatar>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 700,
              color: theme.palette.text.primary
            }}
          >
            {title}
          </Typography>
        </Box>
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{ lineHeight: 1.6 }}
        >
          {description}
        </Typography>
      </Paper>
    </motion.div>
  );
};

const StepIndicator = ({ number, active }) => {
  const theme = useTheme();
  
  return (
    <Avatar
      sx={{
        width: 40,
        height: 40,
        mr: 2,
        bgcolor: active ? theme.palette.primary.main : alpha(theme.palette.text.secondary, 0.1),
        color: active ? theme.palette.getContrastText(theme.palette.primary.main) : theme.palette.text.secondary,
        fontWeight: 700,
        transition: 'all 0.3s ease'
      }}
    >
      {number}
    </Avatar>
  );
};

export default function About({ mode }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const features = [
    {
      icon: <AutoAwesomeIcon />,
      title: "AI-Powered Intelligence",
      description: "Our advanced AI engine analyzes your code structure and patterns to generate comprehensive, context-aware test cases."
    },
    {
      icon: <GitHubIcon />,
      title: "Seamless GitHub Sync",
      description: "Direct integration with GitHub repositories for real-time code analysis and test generation."
    },
    {
      icon: <TerminalIcon />,
      title: "Smart Test Generation",
      description: "Automatically creates test.spec.js files with complete coverage including edge cases."
    },
    {
      icon: <PsychologyIcon />,
      title: "Contextual Understanding",
      description: "Understands your code's purpose to generate meaningful tests that reflect actual usage."
    },
    {
      icon: <SecurityIcon />,
      title: "Security Auditing",
      description: "Identifies potential security vulnerabilities and suggests protective test cases."
    },
    {
      icon: <BoltIcon />,
      title: "Lightning Fast",
      description: "Generates complete test suites in seconds, saving you hours of manual work."
    }
  ];

  return (
    <Box sx={{ 
      overflow: 'hidden',
      backgroundColor: theme.palette.background.default,
      minHeight: '100vh'
    }}>
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Box 
          component={motion.div}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          sx={{ 
            textAlign: 'center', 
            mb: 10,
            position: 'relative'
          }}
        >
          <Chip 
            label="AI-Powered Test Generation" 
            color="primary"
            sx={{ 
              mb: 3,
              px: 3,
              py: 1,
              fontWeight: 700,
              fontSize: '0.875rem',
              backgroundColor: alpha(theme.palette.primary.main, 0.9),
              color: theme.palette.getContrastText(theme.palette.primary.main)
            }}
          />
          <Typography 
            variant="h1" 
            sx={{ 
              fontWeight: 800, 
              mb: 3,
              fontSize: isMobile ? '2.5rem' : '4rem',
              lineHeight: 1.2,
              color: theme.palette.text.primary
            }}
          >
            Revolutionize Your Testing Workflow
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              maxWidth: 800, 
              mx: 'auto',
              color: "text.secondary",
              fontWeight: 400,
              lineHeight: 1.6
            }}
          >
            Automatically generate comprehensive, intelligent test cases for your JavaScript/TypeScript projects with our AI-powered solution.
          </Typography>
        </Box>

        <Grid container spacing={4} sx={{ mb: 12 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <FeatureCard {...feature} index={index} />
            </Grid>
          ))}
        </Grid>

        <Paper 
          sx={{ 
            p: 6, 
            borderRadius: 4,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
            mb: 8,
            position: 'relative',
            overflow: 'hidden',
            '&:before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
            }
          }}
        >
          <Typography 
            variant="h2" 
            sx={{ 
              fontWeight: 800, 
              mb: 6,
              textAlign: 'center',
              fontSize: isMobile ? '2rem' : '2.5rem',
              color: theme.palette.text.primary
            }}
          >
            How It Works
          </Typography>
          
          <Grid container spacing={6}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', mb: 4 }}>
                <StepIndicator number="1" active />
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: theme.palette.text.primary }}>
                    Connect Your Repository
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    Securely sign in with GitHub OAuth and browse your repositories in our intuitive interface.
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', mb: 4 }}>
                <StepIndicator number="2" active />
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: theme.palette.text.primary }}>
                    Select Target Files
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    Choose the files or directories you want to generate tests for with our smart file explorer.
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex' }}>
                <StepIndicator number="3" active />
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: theme.palette.text.primary }}>
                    Generate & Review Tests
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    Our AI analyzes your code and generates comprehensive test cases in seconds, ready for your review.
                  </Typography>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  p: 4,
                  height: '100%',
                  borderRadius: 4,
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                  position: 'relative'
                }}
              >
                <VerifiedIcon 
                  sx={{ 
                    fontSize: 60,
                    mb: 3,
                    color: theme.palette.primary.main,
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    borderRadius: '50%',
                    p: 1
                  }} 
                />
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: theme.palette.text.primary }}>
                  Ready to Transform Your Testing?
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
                  Join thousands of developers who trust our AI to enhance their code quality and testing efficiency.
                </Typography>
                <Button
                  component={Link}
                  to="/"
                  variant="contained"
                  size="large"
                  sx={{
                    px: 5,
                    py: 1.5,
                    borderRadius: 3,
                    fontWeight: 700,
                    fontSize: '1rem',
                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    color: theme.palette.getContrastText(theme.palette.primary.main),
                    boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.3)}`,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Start Generating Tests
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      <Box 
        sx={{ 
          py: 6,
          textAlign: 'center',
          backgroundColor: theme.palette.background.paper,
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.2)}`
        }}
      >
        <Container maxWidth="md">
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Built with React, Node.js, and cutting-edge AI technologies
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}