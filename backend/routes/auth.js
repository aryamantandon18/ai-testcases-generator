import express from "express";
import fetch from "node-fetch";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";
import authMiddleware from "../middleware/auth.js";
dotenv.config();

const router = express.Router();

// Redirect the user to GitHub OAuth page from frontend; the callback will hit this route
router.get("/github/callback", async (req, res) => {
  try {
    const code = req.query.code;
    if (!code) return res.status(400).send("Missing code");
    const tokenResp = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code
      })
    });
    const tokenJson = await tokenResp.json();
    const access_token = tokenJson.access_token;
    if (!access_token) return res.status(400).json({ tokenJson });

    // fetch profile
    const profileResp = await fetch("https://api.github.com/user", {
      headers: { Authorization: `token ${access_token}`, Accept: "application/vnd.github.v3+json" }
    });
    const profile = await profileResp.json();

    let user = await User.findOne({ githubId: profile.id });
    if (!user) {
      user = new User({ githubId: profile.id, login: profile.login, accessToken: access_token });
    } else {
      user.accessToken = access_token;
    }
    await user.save();

    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    if (!jwtToken) {
      console.error("JWT token not generated");
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=token_failure`);
    }
    
    console.log("Successful authentication, redirecting with token");
    // redirect to frontend with token
    return res.redirect(`${process.env.FRONTEND_URL}/?token=${jwtToken}`);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "OAuth callback error", error: err.message });
  }
});

router.get("/me",authMiddleware,async(req,res)=>{
  res.json({user:req.user});
})

export default router;
