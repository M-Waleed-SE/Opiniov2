import express from "express";
import jwt from "jsonwebtoken";
import { Admin } from "../models/admin.model.js";
import { User } from "../models/user.models.js";
import { Blog } from "../models/blog.models.js";
import { verifyAdminJWT } from "../middlewares/admin.middleware.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isPasswordValid = await admin.isPasswordCorrect(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const accessToken = jwt.sign(
      {
        _id: admin._id,
        email: admin.email,
        username: admin.username,
        role: "admin"
      },
      process.env.ACCESS_TOKEN_SECRET || "fallback_secret",
      { expiresIn: "1d" }
    );

    const loggedInAdmin = await Admin.findById(admin._id).select("-password");

    return res.status(200).json({
      admin: loggedInAdmin,
      token: accessToken,
      message: "Admin logged in successfully"
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/users", verifyAdminJWT, async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/users/:id/block", verifyAdminJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const { block } = req.body; // boolean
    
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isBlocked = block;
    await user.save();

    res.status(200).json({ message: `User ${block ? 'blocked' : 'unblocked'} successfully`, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/articles/:id", verifyAdminJWT, async (req, res) => {
  try {
    const { id } = req.params;
    
    const article = await Blog.findById(id);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    // Admin can delete any article
    await Blog.findByIdAndDelete(id);
    res.status(200).json({ message: "Article deleted successfully by Admin" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.put("/articles/:id/feature", verifyAdminJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const { featured } = req.body; // boolean
    
    const article = await Blog.findById(id);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    article.featured = featured;
    await article.save();

    res.status(200).json({ message: `Article ${featured ? 'featured' : 'unfeatured'} successfully`, article });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/articles", verifyAdminJWT, async (req, res) => {
  try {
    const articles = await Blog.find()
      .populate("blogger", "username email")
      .sort({ createdAt: -1 });
    res.status(200).json(articles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
