const express = require("express");
const router = express.Router();
const {
  getReviews,
  createReview,
  updateReview,
  deleteReview
} = require("../controllers/reviewController");

// GET reviews (supports ?productId=... or ?userEmail=...)
router.get("/", getReviews);

// POST create review
router.post("/", createReview);

// PUT update review
router.put("/:id", updateReview);

// DELETE review
router.delete("/:id", deleteReview);

module.exports = router;
