const express = require("express");
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart
} = require("../controllers/cartController");

// GET cart by ?userEmail=...
router.get("/", getCart);

// POST add/sync cart (increments quantity if item already in cart)
router.post("/", addToCart);

// PUT update cart item quantity
router.put("/item", updateCartItem);

// DELETE single cart item
router.delete("/item", removeCartItem);

// DELETE clear entire cart
router.delete("/", clearCart);

module.exports = router;
