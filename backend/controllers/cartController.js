const mongoose = require("mongoose");
const Cart = require("../models/Cart");

// In-memory fallback if DB is not connected
let memoryCarts = [];

// Helper to recalculate cart total
const calculateCartTotal = (items) => {
  return items.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0
  );
};

// 1. GET CART FOR USER
const getCart = async (req, res) => {
  try {
    const userEmail = req.query.userEmail || (req.body && req.body.userEmail);
    if (!userEmail) {
      return res.status(400).json({ message: "userEmail is required" });
    }

    const cleanEmail = userEmail.trim().toLowerCase();

    if (mongoose.connection.readyState === 1) {
      let cart = await Cart.findOne({ userEmail: cleanEmail });
      if (!cart) {
        cart = await Cart.create({ userEmail: cleanEmail, items: [], totalAmount: 0 });
      }
      return res.status(200).json(cart);
    }

    // Fallback
    let cart = memoryCarts.find((c) => c.userEmail === cleanEmail);
    if (!cart) {
      cart = {
        _id: "cart_" + Date.now(),
        userEmail: cleanEmail,
        items: [],
        totalAmount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      memoryCarts.push(cart);
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. ADD / SYNC ITEMS TO CART
// If single item is provided and already exists, increment quantity!
const addToCart = async (req, res) => {
  try {
    const { userEmail, item, items } = req.body;

    if (!userEmail) {
      return res.status(400).json({ message: "userEmail is required" });
    }

    const cleanEmail = userEmail.trim().toLowerCase();

    // If an entire items array is passed (e.g. bulk sync)
    if (Array.isArray(items)) {
      const totalAmount = calculateCartTotal(items);

      if (mongoose.connection.readyState === 1) {
        let cart = await Cart.findOne({ userEmail: cleanEmail });
        if (cart) {
          cart.items = items;
          cart.totalAmount = totalAmount;
          await cart.save();
        } else {
          cart = await Cart.create({
            userEmail: cleanEmail,
            items,
            totalAmount
          });
        }
        return res.status(200).json({ message: "Cart updated successfully", cart });
      }

      // Fallback
      let cartIndex = memoryCarts.findIndex((c) => c.userEmail === cleanEmail);
      const updatedCart = {
        _id: cartIndex !== -1 ? memoryCarts[cartIndex]._id : "cart_" + Date.now(),
        userEmail: cleanEmail,
        items,
        totalAmount,
        updatedAt: new Date().toISOString()
      };
      if (cartIndex !== -1) {
        memoryCarts[cartIndex] = updatedCart;
      } else {
        memoryCarts.push(updatedCart);
      }
      return res.status(200).json({ message: "Cart updated successfully", cart: updatedCart });
    }

    // Single item add flow
    const itemToAdd = item || req.body;
    if (!itemToAdd || (itemToAdd.productId === undefined && itemToAdd.id === undefined)) {
      return res.status(400).json({
        message: "Item details with productId, name, and price are required"
      });
    }

    const pId = itemToAdd.productId !== undefined ? itemToAdd.productId : itemToAdd.id;
    const addQty = Number(itemToAdd.quantity) || 1;

    if (mongoose.connection.readyState === 1) {
      let cart = await Cart.findOne({ userEmail: cleanEmail });
      if (!cart) {
        cart = new Cart({
          userEmail: cleanEmail,
          items: [],
          totalAmount: 0
        });
      }

      const existingIndex = cart.items.findIndex(
        (i) => String(i.productId) === String(pId)
      );

      if (existingIndex > -1) {
        // Increment quantity instead of creating duplicates
        cart.items[existingIndex].quantity =
          Number(cart.items[existingIndex].quantity) + addQty;
      } else {
        // Add new item
        cart.items.push({
          productId: pId,
          name: itemToAdd.name,
          price: Number(itemToAdd.price),
          quantity: addQty,
          image: itemToAdd.image || ""
        });
      }

      cart.totalAmount = calculateCartTotal(cart.items);
      await cart.save();

      return res.status(200).json({
        message: "Item added to cart successfully",
        cart
      });
    }

    // Fallback
    let cart = memoryCarts.find((c) => c.userEmail === cleanEmail);
    if (!cart) {
      cart = {
        _id: "cart_" + Date.now(),
        userEmail: cleanEmail,
        items: [],
        totalAmount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      memoryCarts.push(cart);
    }

    const existingIndex = cart.items.findIndex(
      (i) => String(i.productId) === String(pId)
    );

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity =
        Number(cart.items[existingIndex].quantity) + addQty;
    } else {
      cart.items.push({
        productId: pId,
        name: itemToAdd.name,
        price: Number(itemToAdd.price),
        quantity: addQty,
        image: itemToAdd.image || ""
      });
    }

    cart.totalAmount = calculateCartTotal(cart.items);
    cart.updatedAt = new Date().toISOString();

    res.status(200).json({
      message: "Item added to cart successfully",
      cart
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. UPDATE CART ITEM QUANTITY
const updateCartItem = async (req, res) => {
  try {
    const userEmail = req.body.userEmail || req.query.userEmail;
    const productId = req.body.productId !== undefined ? req.body.productId : req.query.productId;
    const quantity = req.body.quantity !== undefined ? req.body.quantity : req.query.quantity;

    if (!userEmail || productId === undefined || quantity === undefined) {
      return res.status(400).json({
        message: "Please provide userEmail, productId, and quantity"
      });
    }

    const cleanEmail = userEmail.trim().toLowerCase();
    const newQty = Number(quantity);

    if (mongoose.connection.readyState === 1) {
      let cart = await Cart.findOne({ userEmail: cleanEmail });
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }

      const itemIndex = cart.items.findIndex(
        (i) => String(i.productId) === String(productId)
      );

      if (itemIndex > -1) {
        if (newQty <= 0) {
          cart.items.splice(itemIndex, 1);
        } else {
          cart.items[itemIndex].quantity = newQty;
        }
        cart.totalAmount = calculateCartTotal(cart.items);
        await cart.save();
        return res.status(200).json({ message: "Cart updated", cart });
      } else {
        return res.status(404).json({ message: "Item not found in cart" });
      }
    }

    // Fallback
    const cart = memoryCarts.find((c) => c.userEmail === cleanEmail);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    const itemIndex = cart.items.findIndex(
      (i) => String(i.productId) === String(productId)
    );
    if (itemIndex > -1) {
      if (newQty <= 0) {
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].quantity = newQty;
      }
      cart.totalAmount = calculateCartTotal(cart.items);
      cart.updatedAt = new Date().toISOString();
      return res.status(200).json({ message: "Cart updated", cart });
    }
    res.status(404).json({ message: "Item not found in cart" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. REMOVE SINGLE ITEM FROM CART
const removeCartItem = async (req, res) => {
  try {
    const userEmail = req.body?.userEmail || req.query?.userEmail;
    const productId =
      req.body?.productId !== undefined
        ? req.body.productId
        : req.query?.productId !== undefined
        ? req.query.productId
        : req.params?.id;

    if (!userEmail || productId === undefined) {
      return res.status(400).json({
        message: "Please provide userEmail and productId"
      });
    }

    const cleanEmail = userEmail.trim().toLowerCase();

    if (mongoose.connection.readyState === 1) {
      let cart = await Cart.findOne({ userEmail: cleanEmail });
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }

      cart.items = cart.items.filter(
        (i) => String(i.productId) !== String(productId)
      );
      cart.totalAmount = calculateCartTotal(cart.items);
      await cart.save();

      return res.status(200).json({ message: "Item removed from cart", cart });
    }

    // Fallback
    const cart = memoryCarts.find((c) => c.userEmail === cleanEmail);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (i) => String(i.productId) !== String(productId)
    );
    cart.totalAmount = calculateCartTotal(cart.items);
    cart.updatedAt = new Date().toISOString();

    res.status(200).json({ message: "Item removed from cart", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 5. CLEAR CART
const clearCart = async (req, res) => {
  try {
    const userEmail = req.body?.userEmail || req.query?.userEmail;
    if (!userEmail) {
      return res.status(400).json({ message: "userEmail is required" });
    }

    const cleanEmail = userEmail.trim().toLowerCase();

    if (mongoose.connection.readyState === 1) {
      const cart = await Cart.findOneAndUpdate(
        { userEmail: cleanEmail },
        { items: [], totalAmount: 0 },
        { new: true }
      );
      return res.status(200).json({ message: "Cart cleared successfully", cart });
    }

    // Fallback
    const cart = memoryCarts.find((c) => c.userEmail === cleanEmail);
    if (cart) {
      cart.items = [];
      cart.totalAmount = 0;
      cart.updatedAt = new Date().toISOString();
    }
    res.status(200).json({ message: "Cart cleared successfully", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart
};
