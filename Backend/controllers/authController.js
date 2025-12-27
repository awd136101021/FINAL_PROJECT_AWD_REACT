// authController.js
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

export const register = async (req, res) => {
  const { fullName, email, password, role = "student" } = req.body;

  // Email validation
  if (!email || !email.includes("@")) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  // Comprehensive password validation
  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  // Check all password requirements
  if (password.length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters long" });
  }

  if (!/(?=.*[A-Z])/.test(password)) {
    return res.status(400).json({ message: "Password must contain at least one uppercase letter" });
  }

  if (!/(?=.*[a-z])/.test(password)) {
    return res.status(400).json({ message: "Password must contain at least one lowercase letter" });
  }

  if (!/(?=.*[\W_])/.test(password)) {
    return res.status(400).json({ message: "Password must contain at least one special character" });
  }

  // Validate role
  if (!["student", "admin"].includes(role)) {
    return res.status(400).json({ message: "Invalid role specified" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = await User.create({ fullName, email, password: hashed, role });

    const token = generateToken(user._id);

    res.status(201).json({
      message: `User registered successfully as ${role}`,
      user: { 
        id: user._id, 
        fullName: user.fullName, 
        email: user.email,
        role: user.role 
      },
      token
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  const { email, password, role = "student" } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: "Please provide email and password" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if user role matches the requested role
    if (user.role !== role) {
      return res.status(403).json({ 
        message: `Access denied. This account is registered as ${user.role}. Please login as ${user.role}.` 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      message: `Login successful as ${user.role}`,
      user: { 
        id: user._id, 
        fullName: user.fullName, 
        email: user.email,
        role: user.role 
      },
      token
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};