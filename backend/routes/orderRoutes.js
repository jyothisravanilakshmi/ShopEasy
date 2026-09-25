const express = require("express");
const router = express.Router();
const {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus
} = require("../controllers/orderController");

// GET all orders (supports ?userEmail=...)
router.get("/", getOrders);

// GET order by id / orderId
router.get("/:id", getOrderById);

// POST create order
router.post("/", createOrder);

// PUT update order status
router.put("/:id/status", updateOrderStatus);

module.exports = router;
