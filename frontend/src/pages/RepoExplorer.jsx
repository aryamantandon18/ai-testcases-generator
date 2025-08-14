import React, { useContext, useEffect, useState, useMemo, useCallback } from "react";
import {
  Box,
  Paper,
  Grid,
  TextField,
  Typography,
  CircularProgress,
  Chip,
  Tooltip,
  IconButton,
  Collapse,
  Alert,
  Stack,
  Avatar,
  useTheme,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  Snackbar,
  Button,
  alpha
} from "@mui/material";
import {
  Refresh as RefreshIcon,
  Folder as FolderIcon,
  Code as CodeIcon,
  GitHub as GitHubIcon,
  AccountTree as AccountTreeIcon,
  Storage as BranchIcon,
  Summarize as SummarizeIcon,
  Search as SearchIcon,
  InsertDriveFile as FileIcon,
  Clear as ClearIcon,
  ContentCopy as ContentCopyIcon,
  AutoAwesome as AutoAwesomeIcon
} from "@mui/icons-material";
import API, { setAuth } from "../api/api";
import { AuthContext } from "../contexts/AuthContext";
import FileTree from "../components/FileTree";
import AnimatedButton from "../components/AnimatedButton";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function RepoExplorer() {
  const { token } = useContext(AuthContext);
  const theme = useTheme();
  const navigate = useNavigate();

  // form fields
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");
  const [branch, setBranch] = useState("main");

  // data
  const [files, setFiles] = useState([]);
  const [selected, setSelected] = useState([]);

  // ui states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [copySnackOpen, setCopySnackOpen] = useState(false);

  useEffect(() => {
    setAuth(token);
  }, [token]);

  useEffect(() => {
    const t = setTimeout(() => setSearchTerm(searchInput.trim()), 250);
    return () => clearTimeout(t);
  }, [searchInput]);

  const filteredFiles = useMemo(() => {
    if (!searchTerm) return files;
    return files.filter((f) => f.path.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [files, searchTerm]);

  const fetchFiles = useCallback(async () => {
    if (!owner || !repo) {
      setError("Please provide both owner and repository name.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await API.get("/api/github/files", { params: { owner, repo, branch } });
      setFiles(res.data || []);
      setSuccess(`Found ${res.data?.length || 0} files`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Error fetching files: " + (err?.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  }, [owner, repo, branch]);

  const generateSummaries = useCallback(async () => {
    if (selected.length === 0) {
      setError("Please select at least one file to summarize.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const contents = [];
      for (const path of selected) {
        const r = await API.get("/api/github/file", { params: { owner, repo, path, ref: branch } });
        contents.push({ path, content: r.data.content });
      }

      const resp = await API.post("/api/ai/summaries", { files: contents });
      sessionStorage.setItem(
        "tcg_summaries",
        JSON.stringify({ summaries: resp.data.summaries, files: contents })
      );

      navigate("/summaries");
    } catch (err) {
      setError("Error generating summaries: " + (err?.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  }, [selected, owner, repo, branch, navigate]);

  const toggleSelect = (path) => {
    setSelected((prev) => (prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path]));
  };

  const allVisibleSelected = filteredFiles.length > 0 && filteredFiles.every((f) => selected.includes(f.path));
  const toggleSelectAllVisible = () => {
    if (allVisibleSelected) {
      setSelected((prev) => prev.filter((p) => !filteredFiles.some((f) => f.path === p)));
    } else {
      setSelected((prev) => Array.from(new Set([...prev, ...filteredFiles.map((f) => f.path)])));
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySnackOpen(true);
    } catch (e) {
      setError("Failed to copy to clipboard");
    }
  };

  return (
    <Paper
      sx={{
        p: { xs: 2, md: 4 },
        borderRadius: 4,
        boxShadow: theme.shadows[2],
        background: theme.palette.background.paper,
        minHeight: "70vh",
        border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
        position: 'relative',
        overflow: 'hidden',
        '&:before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 6,
          background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
        }
      }}
    >
      {/* Header */}
      <Stack direction={{ xs: "column", sm: "row" }} alignItems="center" spacing={2} mb={3}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Avatar sx={{ 
            bgcolor: theme.palette.mode === 'dark' ? 
              theme.palette.secondary.main : 
              theme.palette.primary.main,
            width: 44,
            height: 44
          }}>
            <AutoAwesomeIcon />
          </Avatar>
          <Typography 
            variant="h5" 
            fontWeight="800"
            sx={{
              background: `linear-gradient(90deg, ${theme.palette.text.primary}, ${alpha(theme.palette.text.primary, 0.8)})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            AI Test Case Generator
          </Typography>
        </Stack>

        <Box sx={{ flex: 1 }} />

        <Stack direction="row" spacing={1} alignItems="center">
          <Tooltip title="Reset form">
            <IconButton 
              onClick={() => { setOwner(""); setRepo(""); setBranch("main"); setFiles([]); setSelected([]); }}
              color="inherit"
              sx={{
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.1)
                }
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Open on GitHub">
            <IconButton
              onClick={() => {
                if (owner && repo) window.open(`https://github.com/${owner}/${repo}`, "_blank");
              }}
              disabled={!owner || !repo}
              color="inherit"
              sx={{
                '&:hover': {
                  bgcolor: alpha(theme.palette.secondary.main, 0.1)
                }
              }}
            >
              <GitHubIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      <Typography variant="subtitle1" color="text.secondary" mb={3}>
        Select files from your GitHub repository to generate intelligent test cases automatically
      </Typography>

      <Collapse in={!!error} sx={{ mb: 2 }}>
        <Alert 
          severity="error" 
          onClose={() => setError(null)}
          sx={{ 
            border: `1px solid ${theme.palette.error.dark}`,
            background: alpha(theme.palette.error.main, 0.1),
            backdropFilter: 'blur(8px)'
          }}
        >
          {error}
        </Alert>
      </Collapse>

      <Collapse in={!!success} sx={{ mb: 2 }}>
        <Alert 
          severity="success" 
          onClose={() => setSuccess(null)}
          sx={{ 
            border: `1px solid ${theme.palette.success.dark}`,
            background: alpha(theme.palette.success.main, 0.1),
            backdropFilter: 'blur(8px)'
          }}
        >
          {success}
        </Alert>
      </Collapse>

      <Grid container spacing={3} sx={{ alignItems: "stretch" }}>
        {/* Inputs */}
        <Grid item xs={12}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 3, 
              borderRadius: 3,
              background: alpha(theme.palette.background.default, 0.8),
              border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
              backdropFilter: 'blur(8px)'
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={3}>
                <TextField
                  label="Owner"
                  value={owner}
                  onChange={(e) => setOwner(e.target.value)}
                  fullWidth
                  size="small"
                  InputProps={{ 
                    startAdornment: <GitHubIcon sx={{ mr: 1, color: "action.active" }} />,
                    sx: { borderRadius: 2 }
                  }}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  label="Repository"
                  value={repo}
                  onChange={(e) => setRepo(e.target.value)}
                  fullWidth
                  size="small"
                  InputProps={{ 
                    startAdornment: <FolderIcon sx={{ mr: 1, color: "action.active" }} />,
                    sx: { borderRadius: 2 }
                  }}
                />
              </Grid>

              <Grid item xs={8} md={3}>
                <TextField
                  label="Branch"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  fullWidth
                  size="small"
                  InputProps={{ 
                    startAdornment: <BranchIcon sx={{ mr: 1, color: "action.active" }} />,
                    sx: { borderRadius: 2 }
                  }}
                />
              </Grid>

              <Grid item xs={4} md={3} sx={{ display: "flex", gap: 1 }}>
                <AnimatedButton
                  onClick={fetchFiles}
                  startIcon={<SearchIcon />}
                  loading={loading}
                  loadingPosition="start"
                  variant="contained"
                  size="medium"
                  fullWidth
                  disabled={!owner || !repo}
                  sx={{
                    borderRadius: 2,
                    height: '40px',
                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.2)}`
                  }}
                >
                  Explore
                </AnimatedButton>

                <Button
                  variant="outlined"
                  size="medium"
                  onClick={() => { setFiles([]); setSelected([]); setSearchInput(""); }}
                  sx={{ 
                    borderRadius: 2,
                    height: '40px',
                    borderColor: alpha(theme.palette.divider, 0.5)
                  }}
                >
                  Clear
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* File Browser */}
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 3, 
              borderRadius: 3, 
              height: "100%", 
              display: "flex", 
              flexDirection: "column", 
              background: alpha(theme.palette.background.default, 0.8),
              border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
              backdropFilter: 'blur(8px)'
            }}
          >
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <FolderIcon color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Repository Files
                </Typography>

                {files.length > 0 && (
                  <Chip 
                    label={`${filteredFiles.length}/${files.length} files`} 
                    size="small" 
                    sx={{ ml: 1 }} 
                    color="primary"
                    variant="outlined"
                  />
                )}
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center">
                <Checkbox
                  size="small"
                  checked={allVisibleSelected}
                  onChange={toggleSelectAllVisible}
                  disabled={filteredFiles.length === 0}
                  color="primary"
                />
                <TextField
                  size="small"
                  placeholder={files.length ? "Search files..." : "Explore repository to search"}
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  sx={{ width: 220 }}
                  InputProps={{ 
                    startAdornment: <SearchIcon sx={{ mr: 1 }} />,
                    sx: { borderRadius: 2 }
                  }}
                />
                <Tooltip title="Clear search">
                  <IconButton 
                    size="small" 
                    onClick={() => setSearchInput("")}
                    color="inherit"
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Stack>

            <Box 
              sx={{ 
                flex: 1, 
                borderRadius: 2, 
                border: `1px solid ${alpha(theme.palette.divider, 0.2)}`, 
                overflow: "hidden", 
                background: theme.palette.background.paper 
              }}
            >
              {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height={240}>
                  <CircularProgress color="primary" />
                </Box>
              ) : files.length > 0 ? (
                <Box sx={{ height: { xs: 360, md: 520 }, overflow: "auto" }}>
                  <FileTree 
                    files={filteredFiles} 
                    selected={selected} 
                    setSelected={setSelected} 
                    toggleSelect={toggleSelect} 
                  />
                </Box>
              ) : (
                <Box 
                  display="flex" 
                  justifyContent="center" 
                  alignItems="center" 
                  height={240} 
                  flexDirection="column" 
                  color="text.secondary"
                >
                  <FolderIcon fontSize="large" />
                  <Typography mt={1} variant="body1">
                    {owner && repo ? "No files found for this branch" : "Enter repository details to explore"}
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Selected Files */}
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 3, 
              borderRadius: 3, 
              height: "100%", 
              display: "flex", 
              flexDirection: "column", 
              background: alpha(theme.palette.background.default, 0.8),
              border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
              backdropFilter: 'blur(8px)'
            }}
          >
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <SummarizeIcon color="secondary" />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Selected for Testing
                </Typography>
                <Chip 
                  label={`${selected.length} selected`} 
                  color="secondary" 
                  size="small" 
                  sx={{ ml: 1 }} 
                  variant="outlined"
                />
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center">
                <Tooltip title="Clear selected">
                  <IconButton 
                    size="small" 
                    onClick={() => setSelected([])} 
                    disabled={selected.length === 0}
                    color="inherit"
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Stack>

            <Box 
              sx={{ 
                flex: 1, 
                borderRadius: 2, 
                border: `1px solid ${alpha(theme.palette.divider, 0.2)}`, 
                overflow: "auto", 
                background: theme.palette.background.paper 
              }}
            >
              {selected.length === 0 ? (
                <Box 
                  display="flex" 
                  justifyContent="center" 
                  alignItems="center" 
                  height={240} 
                  flexDirection="column" 
                  color="text.secondary"
                >
                  <FileIcon fontSize="large" />
                  <Typography mt={1} variant="body1">No files selected</Typography>
                  <Typography variant="body2" sx={{ mt: 1, textAlign: "center", maxWidth: "80%" }}>
                    Select files from the repository to generate intelligent test cases.
                  </Typography>
                </Box>
              ) : (
                <List dense>
                  {selected.map((path) => (
                    <ListItem
                      key={path}
                      secondaryAction={
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Tooltip title="Copy path">
                            <IconButton 
                              size="small" 
                              onClick={() => copyToClipboard(path)}
                              color="inherit"
                              sx={{
                                '&:hover': {
                                  color: theme.palette.primary.main
                                }
                              }}
                            >
                              <ContentCopyIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Remove">
                            <IconButton 
                              size="small" 
                              onClick={() => setSelected((s) => s.filter((p) => p !== path))}
                              color="inherit"
                              sx={{
                                '&:hover': {
                                  color: theme.palette.error.main
                                }
                              }}
                            >
                              <ClearIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      }
                      sx={{ 
                        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.2)}`, 
                        '&:last-child': { borderBottom: 'none' },
                        '&:hover': {
                          background: alpha(theme.palette.primary.main, 0.05)
                        }
                      }}
                    >
                      <ListItemIcon>
                        <FileIcon fontSize="small" color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={path.split('/').pop()} 
                        secondary={path} 
                        secondaryTypographyProps={{ noWrap: true }} 
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>

            <Box mt={2}>
              <AnimatedButton
                onClick={generateSummaries}
                startIcon={<CodeIcon />}
                loading={loading}
                loadingPosition="start"
                variant="contained"
                color="secondary"
                size="large"
                fullWidth
                disabled={selected.length === 0 || loading}
                sx={{
                  height: '48px',
                  borderRadius: 2,
                  fontSize: '1rem',
                  background: `linear-gradient(90deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
                  boxShadow: `0 4px 15px ${alpha(theme.palette.secondary.main, 0.3)}`,
                  '&:hover': {
                    boxShadow: `0 6px 20px ${alpha(theme.palette.secondary.main, 0.4)}`
                  }
                }}
              >
                Generate Test Cases
              </AnimatedButton>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Snackbar
        open={copySnackOpen}
        onClose={() => setCopySnackOpen(false)}
        autoHideDuration={2200}
        message="Copied to clipboard"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        ContentProps={{
          sx: {
            background: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[700],
            color: theme.palette.common.white,
            borderRadius: 2
          }
        }}
      />
    </Paper>
  );
}