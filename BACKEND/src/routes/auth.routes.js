import express from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";

const router = express.Router();

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = jwt.sign(
      {
        _id: user._id,
        email: user.email,
        username: user.username,
      },
      process.env.ACCESS_TOKEN_SECRET || "fallback_secret",
      {
        expiresIn: "1d",
      }
    );
    return { accessToken };
  } catch (error) {
    throw new Error("Something went wrong while generating tokens");
  }
};

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (username.length < 4 || password.length < 4) {
      return res.status(400).json({ message: "Username and password must be at least 4 characters long" });
    }

    const existedUser = await User.findOne({ 
      $or: [{ username }, { email }] 
    });

    if (existedUser) {
      return res.status(409).json({ message: "User with email or username already exists" });
    }

    const user = await User.create({ username, email, password });
    const createdUser = await User.findById(user._id).select("-password");

    const { accessToken } = await generateAccessAndRefreshTokens(user._id);

    return res.status(201).json({ 
      user: createdUser, 
      token: accessToken,
      message: "User registered successfully" 
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: "Your account has been blocked by an administrator" });
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const { accessToken } = await generateAccessAndRefreshTokens(user._id);
    const loggedInUser = await User.findById(user._id).select("-password");

    return res.status(200).json({
      user: loggedInUser,
      token: accessToken,
      message: "User logged in successfully"
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
