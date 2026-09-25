const express = require("express");
const router = express.Router();
const {
  getPayments,
  processPayment
} = require("../controllers/paymentController");

// GET payments (supports ?userEmail=... or ?orderId=...)
router.get("/", getPayments);

// POST process payment
router.post("/process", processPayment);
router.post("/", processPayment);

module.exports = router;
