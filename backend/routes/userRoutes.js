const express = require("express");
const router = express.Router();
const {
  getUsers,
  registerUser,
  loginUser
} = require("../controllers/userController");

// GET all users
router.get("/", getUsers);

// POST register user
router.post("/register", registerUser);

// POST login user
router.post("/login", loginUser);

module.exports = router;
