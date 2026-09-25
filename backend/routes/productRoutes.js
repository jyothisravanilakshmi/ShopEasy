const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require("../controllers/productController");

// ==========================================
// PRODUCT ROUTES (/api/products)
// ==========================================

// GET /api/products -> Get all products
// POST /api/products -> Create a new product
router.route("/")
  .get(getAllProducts)
  .post(createProduct);

// GET /api/products/:id -> Get single product by ID
// PUT /api/products/:id -> Update a product by ID
// DELETE /api/products/:id -> Delete a product by ID
router.route("/:id")
  .get(getProductById)
  .put(updateProduct)
  .delete(deleteProduct);

module.exports = router;
