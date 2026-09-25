const express = require("express");
const router = express.Router();
const {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress
} = require("../controllers/addressController");

// GET addresses (supports ?userEmail=...)
router.get("/", getAddresses);

// POST create address
router.post("/", createAddress);

// PUT update address
router.put("/:id", updateAddress);

// DELETE address
router.delete("/:id", deleteAddress);

module.exports = router;
