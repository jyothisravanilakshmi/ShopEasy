const mongoose = require("mongoose");
const Product = require("../models/Product");
const initialProducts = require("../data/seedData");

// In-memory fallback if DB is not connected
let memoryProducts = [...initialProducts];

// Helper to format product with consistent numeric ID and valid image URL
const formatProduct = (p, index = 0) => {
  const doc = p.toObject ? p.toObject() : { ...p };

  // Resolve numeric ID safely - NEVER convert ObjectId string to Number
  let numericId = doc.id;
  if (numericId === undefined || numericId === null || isNaN(Number(numericId))) {
    const match = initialProducts.find(
      (ip) => ip.name && doc.name && ip.name.toLowerCase() === doc.name.toLowerCase()
    );
    numericId = match ? match.id : index + 1;
  } else {
    numericId = Number(numericId);
  }

  // Resolve image URL
  let img = doc.image || "";
  if (!img) {
    const match = initialProducts.find(
      (ip) => ip.name && doc.name && ip.name.toLowerCase() === doc.name.toLowerCase()
    );
    img = match ? match.image : "/images/headphone.jpg";
  }
  if (img && !img.startsWith("/") && !img.startsWith("http")) {
    img = "/" + img;
  }

  return {
    ...doc,
    id: numericId,
    image: img
  };
};

let isSeeded = false;

// Auto-seed MongoDB Atlas if empty and ensure all initial products exist
const seedProductsIfEmpty = async () => {
  if (isSeeded) return;
  try {
    if (mongoose.connection.readyState === 1) {
      const count = await Product.countDocuments();
      if (count === 0) {
        console.log("Seeding products into MongoDB Atlas...");
        await Product.insertMany(initialProducts);
        console.log("Products seeded successfully into MongoDB Atlas.");
      } else if (count < initialProducts.length) {
        // Ensure all initial products (1-24) exist in MongoDB Atlas without creating duplicates
        for (const p of initialProducts) {
          const exists = await Product.findOne({
            $or: [{ id: p.id }, { name: p.name }]
          });
          if (!exists) {
            await Product.create(p);
          } else if (!exists.id || exists.id !== p.id || !exists.image) {
            await Product.updateOne(
              { _id: exists._id },
              { $set: { id: p.id, image: exists.image || p.image } }
            );
          }
        }
      }
      isSeeded = true;
    }
  } catch (err) {
    console.error("Auto-seed error:", err.message);
  }
};

// Listen for DB connection to auto-seed
mongoose.connection.on("connected", () => {
  seedProductsIfEmpty();
});

// 1. GET ALL PRODUCTS
const getAllProducts = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      await seedProductsIfEmpty();
      const products = await Product.find();
      const formatted = products.map((p, idx) => formatProduct(p, idx));
      return res.status(200).json(formatted);
    }
    // Fallback if DB not connected
    const formatted = memoryProducts.map((p, idx) => formatProduct(p, idx));
    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. GET PRODUCT BY ID
const getProductById = async (req, res) => {
  try {
    const id = req.params.id;

    if (mongoose.connection.readyState === 1) {
      let product = null;
      if (!isNaN(Number(id))) {
        product = await Product.findOne({ id: Number(id) });
      }
      if (!product && mongoose.Types.ObjectId.isValid(id)) {
        product = await Product.findById(id);
      }
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      return res.status(200).json(formatProduct(product));
    }

    // Fallback
    const product = memoryProducts.find(
      (p) => String(p.id) === String(id) || String(p._id) === String(id)
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(formatProduct(product));
  } catch (error) {
    res.status(400).json({ message: "Invalid product ID" });
  }
};

// 3. CREATE PRODUCT
const createProduct = async (req, res) => {
  try {
    const { name, price, category, description, image, stock } = req.body;

    if (!name || price === undefined || !category || !description) {
      return res.status(400).json({
        message:
          "Please provide all required fields: name, price, category, description"
      });
    }

    if (isNaN(Number(price))) {
      return res.status(400).json({
        message: "Price must be a valid number"
      });
    }

    let img = image ? image.trim() : "";
    if (img && !img.startsWith("/") && !img.startsWith("http")) {
      img = "/" + img;
    }

    if (mongoose.connection.readyState === 1) {
      const highestProduct = await Product.findOne({ id: { $exists: true, $ne: null } }).sort({ id: -1 });
      const nextId = highestProduct && typeof highestProduct.id === "number" ? highestProduct.id + 1 : Date.now();

      const newProduct = await Product.create({
        id: nextId,
        name: name.trim(),
        price: Number(price),
        category: category.trim(),
        description: description.trim(),
        image: img || "/images/headphone.jpg",
        stock: stock !== undefined ? Number(stock) : 10
      });

      return res.status(201).json(formatProduct(newProduct));
    }

    // Fallback
    const nextId = memoryProducts.length > 0
      ? Math.max(...memoryProducts.map((p) => (typeof p.id === "number" ? p.id : 0))) + 1
      : 1;

    const newProduct = {
      _id: "mem_" + Date.now(),
      id: nextId,
      name: name.trim(),
      price: Number(price),
      category: category.trim(),
      description: description.trim(),
      image: img || "/images/headphone.jpg",
      stock: stock !== undefined ? Number(stock) : 10
    };
    memoryProducts.push(newProduct);
    res.status(201).json(formatProduct(newProduct));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. UPDATE PRODUCT
const updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, price, category, description, image, stock } = req.body;

    if (price !== undefined && isNaN(Number(price))) {
      return res.status(400).json({ message: "Price must be a valid number" });
    }

    let img = image !== undefined ? image.trim() : undefined;
    if (img && !img.startsWith("/") && !img.startsWith("http")) {
      img = "/" + img;
    }

    if (mongoose.connection.readyState === 1) {
      let updatedProduct = null;
      const updatePayload = {
        ...(name !== undefined && { name: name.trim() }),
        ...(price !== undefined && { price: Number(price) }),
        ...(category !== undefined && { category: category.trim() }),
        ...(description !== undefined && { description: description.trim() }),
        ...(img !== undefined && { image: img }),
        ...(stock !== undefined && { stock: Number(stock) })
      };

      if (!isNaN(Number(id))) {
        updatedProduct = await Product.findOneAndUpdate(
          { id: Number(id) },
          updatePayload,
          { new: true, runValidators: true }
        );
      }
      if (!updatedProduct && mongoose.Types.ObjectId.isValid(id)) {
        updatedProduct = await Product.findByIdAndUpdate(
          id,
          updatePayload,
          { new: true, runValidators: true }
        );
      }

      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      return res.status(200).json(formatProduct(updatedProduct));
    }

    // Fallback
    const index = memoryProducts.findIndex(
      (p) => String(p._id) === id || String(p.id) === id
    );
    if (index === -1) {
      return res.status(404).json({ message: "Product not found" });
    }
    memoryProducts[index] = {
      ...memoryProducts[index],
      ...(name !== undefined && { name: name.trim() }),
      ...(price !== undefined && { price: Number(price) }),
      ...(category !== undefined && { category: category.trim() }),
      ...(description !== undefined && { description: description.trim() }),
      ...(img !== undefined && { image: img }),
      ...(stock !== undefined && { stock: Number(stock) })
    };
    res.status(200).json(formatProduct(memoryProducts[index]));
  } catch (error) {
    res.status(400).json({ message: "Invalid product ID or data" });
  }
};

// 5. DELETE PRODUCT
const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;

    if (mongoose.connection.readyState === 1) {
      let deletedProduct = null;
      if (!isNaN(Number(id))) {
        deletedProduct = await Product.findOneAndDelete({ id: Number(id) });
      }
      if (!deletedProduct && mongoose.Types.ObjectId.isValid(id)) {
        deletedProduct = await Product.findByIdAndDelete(id);
      }
      if (!deletedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      return res.status(200).json({ message: "Product deleted successfully" });
    }

    // Fallback
    const index = memoryProducts.findIndex(
      (p) => String(p._id) === id || String(p.id) === id
    );
    if (index === -1) {
      return res.status(404).json({ message: "Product not found" });
    }
    memoryProducts.splice(index, 1);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Invalid product ID" });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  seedProductsIfEmpty
};