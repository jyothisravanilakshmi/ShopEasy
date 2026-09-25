const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// In-memory fallback if DB is not connected
let memoryUsers = [];

// 1. GET ALL USERS (Excluding passwords)
const getUsers = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const users = await User.find().select("-password");
      return res.status(200).json(users);
    }

    const safeUsers = memoryUsers.map(({ password, ...rest }) => rest);
    res.status(200).json(safeUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. REGISTER USER
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please provide all required fields: name, email, password"
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    if (mongoose.connection.readyState === 1) {
      const existingUser = await User.findOne({ email: cleanEmail });
      if (existingUser) {
        return res.status(400).json({
          message: "User with this email already exists"
        });
      }

      // Hash password with bcryptjs
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = await User.create({
        name: name.trim(),
        email: cleanEmail,
        password: hashedPassword,
        phone: phone ? phone.trim() : "",
        role: "customer"
      });

      return res.status(201).json({
        message: "User registered successfully",
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          role: newUser.role
        }
      });
    }

    // Fallback
    const existingMemUser = memoryUsers.find((u) => u.email === cleanEmail);
    if (existingMemUser) {
      return res.status(400).json({
        message: "User with this email already exists"
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newMemUser = {
      _id: "usr_" + Date.now(),
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      phone: phone ? phone.trim() : "",
      role: "customer",
      createdAt: new Date().toISOString()
    };
    memoryUsers.push(newMemUser);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: newMemUser._id,
        name: newMemUser.name,
        email: newMemUser.email,
        phone: newMemUser.phone,
        role: newMemUser.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. LOGIN USER
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide both email and password"
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ email: cleanEmail });
      if (!user) {
        return res.status(401).json({
          message: "Invalid email or password"
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          message: "Invalid email or password"
        });
      }

      return res.status(200).json({
        message: "Login successful",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role
        }
      });
    }

    // Fallback
    const memUser = memoryUsers.find((u) => u.email === cleanEmail);
    if (!memUser) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const isMatch = await bcrypt.compare(password, memUser.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: memUser._id,
        name: memUser.name,
        email: memUser.email,
        phone: memUser.phone,
        role: memUser.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUsers,
  registerUser,
  loginUser
};
