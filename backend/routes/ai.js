import express from "express";
import authMiddleware from "../middleware/auth.js";
import { generateSummariesForFiles, generateCodeForSummary } from "../services/aiService.js";

const router = express.Router();

router.post("/summaries", authMiddleware, async (req, res) => {
  const { files } = req.body;
  if (!files || !Array.isArray(files)) return res.status(400).json({ message: "files required" });
  try {
    const summaries = await generateSummariesForFiles(files);
    res.json({ summaries });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

router.post("/generate", authMiddleware, async (req, res) => {
  const { files, summary } = req.body;
  if (!files || !summary) return res.status(400).json({ message: "files & summary required" });
  try {
    const result = await generateCodeForSummary(files, summary);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
