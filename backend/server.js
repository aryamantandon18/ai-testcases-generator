import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import githubRoutes from "./routes/github.js";
import aiRoutes from "./routes/ai.js";

dotenv.config({
  path: `.env.${process.env.NODE_ENV || "local"}`
});

console.log("Loaded MONGO URI:", process.env.MONGODB_URI); // 👈 add this to debug
const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173", credentials: true }));
app.use(express.json({ limit: "4mb" }));

app.use("/api/auth", authRoutes);
app.use("/api/github", githubRoutes);
app.use("/api/ai", aiRoutes);

const PORT = process.env.PORT || 4000;
mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => console.log(`Backend running on ${PORT}`));
  })
  .catch((err) => console.error("DB connection error:", err));
