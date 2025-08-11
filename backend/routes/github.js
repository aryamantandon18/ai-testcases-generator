import express from "express";
import authMiddleware from "../middleware/auth.js";
import { listRepoFiles, getFileContent } from "../services/githubService.js";
import User from "../models/User.js";

const router = express.Router();

router.get("/files", authMiddleware, async (req, res) => {
  const { owner, repo, branch } = req.query;
  const user = await User.findById(req.user.id);
  try {
    const files = await listRepoFiles(user.accessToken, owner, repo, branch || "main");
    res.json(files);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error listing files", error: err.message });
  }
});

router.get("/file", authMiddleware, async (req, res) => {
  const { owner, repo, path, ref } = req.query;
  const user = await User.findById(req.user.id);
  try {
    const content = await getFileContent(user.accessToken, owner, repo, path, ref || undefined);
    res.json({ path, content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error getting file", error: err.message });
  }
});

export default router;
    