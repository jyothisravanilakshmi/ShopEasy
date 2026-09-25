require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");

// Import Routes
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
const cartRoutes = require("./routes/cartRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const addressRoutes = require("./routes/addressRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

const app = express();

// ==========================================
// MONGODB CONNECTION
// ==========================================
const mongoUri = process.env.MONGODB_URI;

let mongoConnectionPromise = null;

const connectDB = async () => {
  if (!mongoUri) {
    throw new Error("MONGODB_URI is not set");
  }

  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (!mongoConnectionPromise) {
    mongoConnectionPromise = mongoose.connect(mongoUri);
  }

  await mongoConnectionPromise;

  console.log("MongoDB Atlas connected successfully to database: ShopEasy");
};

// ==========================================
// MIDDLEWARE
// ==========================================
app.use(cors());
app.use(express.json());

// ==========================================
// MONGODB CONNECTION MIDDLEWARE
// ==========================================
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);

    res.status(500).json({
      message: "Database connection failed",
      error: error.message
    });
  }
});

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// ==========================================
// ROOT & HEALTH ROUTE
// ==========================================
app.get("/", (req, res) => {
  res.json({
    message: "ShopEasy Backend API is running",
    status: "healthy",
    database:
      mongoose.connection.readyState === 1
        ? "Connected to MongoDB Atlas"
        : "Database Connection Failed",
    endpoints: [
      "/api/products",
      "/api/users",
      "/api/orders",
      "/api/cart",
      "/api/payments",
      "/api/addresses",
      "/api/reviews"
    ]
  });
});

// ==========================================
// API ROUTES
// ==========================================
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/reviews", reviewRoutes);

// ==========================================
// 404 HANDLER
// ==========================================
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found"
  });
});

// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================
app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  res.status(500).json({
    message: err.message || "Internal Server Error"
  });
});

// ==========================================
// START SERVER
// ==========================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});