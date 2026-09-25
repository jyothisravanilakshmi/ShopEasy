const mongoose = require("mongoose");
const Review = require("../models/Review");

// In-memory fallback if DB is not connected
let memoryReviews = [];

// 1. GET REVIEWS (Optional filter by productId or userEmail)
const getReviews = async (req, res) => {
  try {
    const { productId, userEmail } = req.query;
    const filter = {};
    if (productId !== undefined) filter.productId = productId;
    if (userEmail) filter.userEmail = userEmail.trim().toLowerCase();

    if (mongoose.connection.readyState === 1) {
      const reviews = await Review.find(filter).sort({ createdAt: -1 });
      return res.status(200).json(reviews);
    }

    // Fallback
    let reviews = [...memoryReviews];
    if (productId !== undefined) {
      reviews = reviews.filter((r) => String(r.productId) === String(productId));
    }
    if (userEmail) {
      reviews = reviews.filter(
        (r) => r.userEmail.toLowerCase() === userEmail.trim().toLowerCase()
      );
    }
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. CREATE REVIEW
const createReview = async (req, res) => {
  try {
    const { productId, userName, userEmail, rating, comment } = req.body;

    if (productId === undefined || !userName || !userEmail || rating === undefined || !comment) {
      return res.status(400).json({
        message: "Please provide productId, userName, userEmail, rating, and comment"
      });
    }

    if (Number(rating) < 1 || Number(rating) > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    if (mongoose.connection.readyState === 1) {
      const newReview = await Review.create({
        productId,
        userName: userName.trim(),
        userEmail: userEmail.trim().toLowerCase(),
        rating: Number(rating),
        comment: comment.trim()
      });

      return res.status(201).json({
        message: "Review added successfully",
        review: newReview
      });
    }

    // Fallback
    const newMemReview = {
      _id: "rev_" + Date.now(),
      productId,
      userName: userName.trim(),
      userEmail: userEmail.trim().toLowerCase(),
      rating: Number(rating),
      comment: comment.trim(),
      createdAt: new Date().toISOString()
    };
    memoryReviews.push(newMemReview);

    res.status(201).json({
      message: "Review added successfully",
      review: newMemReview
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. UPDATE REVIEW
const updateReview = async (req, res) => {
  try {
    const id = req.params.id;
    const { rating, comment } = req.body;

    if (rating !== undefined && (Number(rating) < 1 || Number(rating) > 5)) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    if (mongoose.connection.readyState === 1) {
      const updatedReview = await Review.findByIdAndUpdate(
        id,
        {
          ...(rating !== undefined && { rating: Number(rating) }),
          ...(comment && { comment: comment.trim() })
        },
        { new: true }
      );

      if (!updatedReview) {
        return res.status(404).json({ message: "Review not found" });
      }
      return res.status(200).json({ message: "Review updated successfully", review: updatedReview });
    }

    // Fallback
    const index = memoryReviews.findIndex((r) => r._id === id);
    if (index === -1) {
      return res.status(404).json({ message: "Review not found" });
    }
    if (rating !== undefined) memoryReviews[index].rating = Number(rating);
    if (comment) memoryReviews[index].comment = comment.trim();

    res.status(200).json({ message: "Review updated successfully", review: memoryReviews[index] });
  } catch (error) {
    res.status(400).json({ message: "Invalid review ID" });
  }
};

// 4. DELETE REVIEW
const deleteReview = async (req, res) => {
  try {
    const id = req.params.id;

    if (mongoose.connection.readyState === 1) {
      const deleted = await Review.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ message: "Review not found" });
      }
      return res.status(200).json({ message: "Review deleted successfully" });
    }

    // Fallback
    const index = memoryReviews.findIndex((r) => r._id === id);
    if (index === -1) {
      return res.status(404).json({ message: "Review not found" });
    }
    memoryReviews.splice(index, 1);
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Invalid review ID" });
  }
};

module.exports = {
  getReviews,
  createReview,
  updateReview,
  deleteReview
};
