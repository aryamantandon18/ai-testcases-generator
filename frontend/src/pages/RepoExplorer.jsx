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
  Button
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
  ContentCopy as ContentCopyIcon
} from "@mui/icons-material";
import API, { setAuth } from "../api/api";
import { AuthContext } from "../contexts/AuthContext";
import FileTree from "../components/FileTree";
import AnimatedButton from "../components/AnimatedButton";
import { useNavigate } from "react-router-dom";

// Improved RepoExplorer UI
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

  // wire auth once
  useEffect(() => {
    setAuth(token);
  }, [token]);

  // debounce search input so typing doesn't re-filter on every keystroke
  useEffect(() => {
    const t = setTimeout(() => setSearchTerm(searchInput.trim()), 250);
    return () => clearTimeout(t);
  }, [searchInput]);

  // memoized filtered file list for performance
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

      // fetch contents sequentially (keeps it simple, can be parallelized later)
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

  // helper to toggle a single selection (keeps API used by FileTree simple)
  const toggleSelect = (path) => {
    setSelected((prev) => (prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path]));
  };

  // select/deselect all visible files
  const allVisibleSelected = filteredFiles.length > 0 && filteredFiles.every((f) => selected.includes(f.path));
  const toggleSelectAllVisible = () => {
    if (allVisibleSelected) {
      // remove visible from selected
      setSelected((prev) => prev.filter((p) => !filteredFiles.some((f) => f.path === p)));
    } else {
      setSelected((prev) => Array.from(new Set([...prev, ...filteredFiles.map((f) => f.path)])));
    }
  };

  // copy path helper
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
        borderRadius: 3,
        boxShadow: theme.shadows[2],
        background: theme.palette.background.paper,
        minHeight: "70vh"
      }}
    >
      {/* header */}
      <Stack direction={{ xs: "column", sm: "row" }} alignItems="center" spacing={2} mb={3}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
            <GitHubIcon />
          </Avatar>
          <Typography variant="h5" fontWeight="700">
            Repository Explorer
          </Typography>
        </Stack>

        <Box sx={{ flex: 1 }} />

        <Stack direction="row" spacing={1} alignItems="center">
          <Tooltip title="Refresh values">
            <IconButton onClick={() => { setOwner(""); setRepo(""); setBranch("main"); setFiles([]); setSelected([]); }}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Open on GitHub">
            <IconButton
              onClick={() => {
                if (owner && repo) window.open(`https://github.com/${owner}/${repo}`, "_blank");
              }}
              disabled={!owner || !repo}
            >
              <GitHubIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      <Collapse in={!!error} sx={{ mb: 2 }}>
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Collapse>

      <Collapse in={!!success} sx={{ mb: 2 }}>
        <Alert severity="success" onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      </Collapse>

      <Grid container spacing={3} sx={{ alignItems: "stretch" }}>
        {/* inputs */}
        <Grid item xs={12}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 2, background: theme.palette.background.default }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={3}>
                <TextField
                  label="Owner"
                  value={owner}
                  onChange={(e) => setOwner(e.target.value)}
                  fullWidth
                  size="small"
                  InputProps={{ startAdornment: <GitHubIcon sx={{ mr: 1, color: "action.active" }} /> }}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  label="Repository"
                  value={repo}
                  onChange={(e) => setRepo(e.target.value)}
                  fullWidth
                  size="small"
                  InputProps={{ startAdornment: <FolderIcon sx={{ mr: 1, color: "action.active" }} /> }}
                />
              </Grid>

              <Grid item xs={8} md={3}>
                <TextField
                  label="Branch"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  fullWidth
                  size="small"
                  InputProps={{ startAdornment: <BranchIcon sx={{ mr: 1, color: "action.active" }} /> }}
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
                >
                  Explore
                </AnimatedButton>

                <Button
                  variant="outlined"
                  size="medium"
                  onClick={() => { setFiles([]); setSelected([]); setSearchInput(""); }}
                >
                  Clear
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* file browser */}
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 2, height: "100%", display: "flex", flexDirection: "column", background: theme.palette.background.default }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <FolderIcon />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Repository Files
                </Typography>

                {files.length > 0 && (
                  <Chip label={`${filteredFiles.length}/${files.length} files`} size="small" sx={{ ml: 1 }} />
                )}
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center">
                <Checkbox
                  size="small"
                  checked={allVisibleSelected}
                  onChange={toggleSelectAllVisible}
                  disabled={filteredFiles.length === 0}
                />
                <TextField
                  size="small"
                  placeholder={files.length ? "Search files..." : "Explore repository to search"}
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  sx={{ width: 220 }}
                  InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1 }} /> }}
                />
                <Tooltip title="Clear search">
                  <IconButton size="small" onClick={() => setSearchInput("")}>
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Stack>

            <Box sx={{ flex: 1, borderRadius: 1, border: `1px solid ${theme.palette.divider}`, overflow: "hidden", background: theme.palette.background.paper }}>
              {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height={240}>
                  <CircularProgress />
                </Box>
              ) : files.length > 0 ? (
                <Box sx={{ height: { xs: 360, md: 520 }, overflow: "auto" }}>
                  <FileTree files={filteredFiles} selected={selected} setSelected={setSelected} toggleSelect={toggleSelect} />
                </Box>
              ) : (
                <Box display="flex" justifyContent="center" alignItems="center" height={240} flexDirection="column" color="text.secondary">
                  <FolderIcon fontSize="large" />
                  <Typography mt={1}>{owner && repo ? "No files found for this branch" : "Enter repository details to explore"}</Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* selected files */}
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 2, height: "100%", display: "flex", flexDirection: "column", background: theme.palette.background.default }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <SummarizeIcon />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Selected Files
                </Typography>
                <Chip label={`${selected.length} selected`} color="primary" size="small" sx={{ ml: 1 }} />
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center">
                <Tooltip title="Clear selected">
                  <IconButton size="small" onClick={() => setSelected([])} disabled={selected.length === 0}>
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Stack>

            <Box sx={{ flex: 1, borderRadius: 1, border: `1px solid ${theme.palette.divider}`, overflow: "auto", background: theme.palette.background.paper }}>
              {selected.length === 0 ? (
                <Box display="flex" justifyContent="center" alignItems="center" height={240} flexDirection="column" color="text.secondary">
                  <FileIcon fontSize="large" />
                  <Typography mt={1}>No files selected</Typography>
                  <Typography variant="body2" sx={{ mt: 1, textAlign: "center", maxWidth: "80%" }}>
                    Select files from the repository to generate summaries.
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
                            <IconButton size="small" onClick={() => copyToClipboard(path)}>
                              <ContentCopyIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Remove">
                            <IconButton size="small" onClick={() => setSelected((s) => s.filter((p) => p !== path))}>
                              <ClearIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      }
                      sx={{ borderBottom: `1px solid ${theme.palette.divider}`, '&:last-child': { borderBottom: 'none' } }}
                    >
                      <ListItemIcon>
                        <FileIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={path.split('/').pop()} secondary={path} secondaryTypographyProps={{ noWrap: true }} />
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
              >
                Generate Summaries
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
      />
    </Paper>
  );
}
