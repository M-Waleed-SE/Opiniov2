import express from "express";
import { Blog } from "../models/blog.models.js";
import { User } from "../models/user.models.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/newBlog", verifyJWT, async (req, res) => {
  try {
    const { email, title, content, imageUrl, category } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ error: "Image URL is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify that the logged in user matches the email provided
    if (user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const newBlog = new Blog({
      heading: title,
      content,
      image: imageUrl,
      category,
      blogger: user._id,
    });

    const savedBlog = await newBlog.save();
    user.numBlogs += 1;
    user.blog.push(savedBlog._id);
    await user.save();

    res.status(201).json(savedBlog);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/articles/user-by-email", verifyJWT, async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const articles = await Blog.find({ blogger: user._id })
      .sort({ createdAt: -1 })
      .select("heading category createdAt featured _id")
      .exec();

    res.status(200).json({ articles });
  } catch (err) {
    console.error("Error fetching articles by email:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/articles/:id", async (req, res) => {
  try {
    const article = await Blog.findById(req.params.id)
      .select("heading content category createdAt image blogger")
      .populate("blogger", "username")
      .exec();

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    res.status(200).json({
      success: true,
      heading: article.heading,
      content: article.content,
      category: article.category,
      createdAt: article.createdAt,
      image: article.image,
      author: article.blogger.username,
      bloggerId: article.blogger._id
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
});

router.delete("/articles/:id", verifyJWT, async (req, res) => {
  try {
    const { id } = req.params;
    
    const article = await Blog.findById(id);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    if (article.blogger.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Unauthorized to delete this article" });
    }

    await Blog.findByIdAndDelete(id);
    res.status(200).json({ message: "Article deleted successfully", deletedArticle: article });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.put("/articles/:id", verifyJWT, async (req, res) => {
  try {
    const { id } = req.params;

    const article = await Blog.findById(id);
    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    if (article.blogger.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Unauthorized to update this article" });
    }

    const { heading, content, category } = req.body;

    if (heading !== undefined) article.heading = heading;
    if (content !== undefined) article.content = content;
    if (category !== undefined) article.category = category;

    await article.save();

    res.status(200).json({
      success: true,
      message: "Article updated successfully",
      article,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
});

router.get("/articles", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;
    const { search, category } = req.query;

    const query = {};

    if (search) {
      query.heading = { $regex: search, $options: "i" }; // case-insensitive
    }

    if (category) {
      query.category = category;
    }

    const articles = await Blog.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({ articles });
  } catch (err) {
    console.error("Error fetching articles:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/posts/category/:category", async (req, res) => {
  const { category } = req.params;
  try {
    const articles = await Blog.find({ category }).sort({ createdAt: -1 });
    res.status(200).json(articles);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch articles by category" });
  }
});

router.get("/featured-posts", async (req, res) => {
  try {
    const featuredPosts = await Blog.find({ featured: true })
      .sort({ createdAt: -1 })
      .limit(10);
    res.status(200).json(featuredPosts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch featured posts" });
  }
});

export default router;
