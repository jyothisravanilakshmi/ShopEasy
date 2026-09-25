const mongoose = require("mongoose");
const Order = require("../models/Order");

// In-memory fallback if DB is not connected
let memoryOrders = [];

// 1. GET ALL ORDERS (Optional filter by userEmail)
const getOrders = async (req, res) => {
  try {
    const { userEmail } = req.query;
    const filter = {};
    if (userEmail) {
      filter.userEmail = userEmail.trim().toLowerCase();
    }

    if (mongoose.connection.readyState === 1) {
      const orders = await Order.find(filter).sort({ createdAt: -1 });
      return res.status(200).json(orders);
    }

    // Fallback
    let orders = [...memoryOrders];
    if (userEmail) {
      orders = orders.filter(
        (o) => o.userEmail.toLowerCase() === userEmail.trim().toLowerCase()
      );
    }
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. GET ORDER BY ID (supports orderId or _id)
const getOrderById = async (req, res) => {
  try {
    const id = req.params.id;

    if (mongoose.connection.readyState === 1) {
      let order = null;
      if (mongoose.Types.ObjectId.isValid(id)) {
        order = await Order.findById(id);
      }
      if (!order) {
        order = await Order.findOne({ orderId: id });
      }

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      return res.status(200).json(order);
    }

    // Fallback
    const order = memoryOrders.find(
      (o) => o._id === id || o.orderId === id
    );
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(400).json({ message: "Invalid order ID" });
  }
};

// 3. CREATE ORDER
const createOrder = async (req, res) => {
  try {
    const {
      userEmail,
      customerName,
      phone,
      deliveryAddress,
      items,
      totalAmount,
      paymentMethod,
      paymentStatus
    } = req.body;

    if (!userEmail || !customerName || !phone || !deliveryAddress || !items || items.length === 0) {
      return res.status(400).json({
        message: "Please provide all required fields: userEmail, customerName, phone, deliveryAddress, items"
      });
    }

    if (!deliveryAddress.address || !deliveryAddress.city || !deliveryAddress.pincode) {
      return res.status(400).json({
        message: "Delivery address must include address, city, and pincode"
      });
    }

    const orderId = `ORD-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    const isCod = paymentMethod === "cod" || paymentMethod === "Cash on Delivery";
    const finalPaymentStatus = paymentStatus || (isCod ? "Pending" : "Paid");
    const normalizedPaymentMethod = paymentMethod || "Cash on Delivery";

    if (mongoose.connection.readyState === 1) {
      const newOrder = await Order.create({
        orderId,
        userEmail: userEmail.trim().toLowerCase(),
        customerName: customerName.trim(),
        phone: phone.trim(),
        deliveryAddress: {
          address: deliveryAddress.address.trim(),
          city: deliveryAddress.city.trim(),
          pincode: deliveryAddress.pincode.trim(),
          coordinates: deliveryAddress.coordinates || null
        },
        items,
        totalAmount: Number(totalAmount),
        paymentMethod: normalizedPaymentMethod,
        paymentStatus: finalPaymentStatus,
        orderStatus: "Placed"
      });

      return res.status(201).json({
        message: "Order placed successfully",
        order: newOrder
      });
    }

    // Fallback
    const newMemOrder = {
      _id: "ord_" + Date.now(),
      orderId,
      userEmail: userEmail.trim().toLowerCase(),
      customerName: customerName.trim(),
      phone: phone.trim(),
      deliveryAddress: {
        address: deliveryAddress.address.trim(),
        city: deliveryAddress.city.trim(),
        pincode: deliveryAddress.pincode.trim(),
        coordinates: deliveryAddress.coordinates || null
      },
      items,
      totalAmount: Number(totalAmount),
      paymentMethod: normalizedPaymentMethod,
      paymentStatus: finalPaymentStatus,
      orderStatus: "Placed",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    memoryOrders.unshift(newMemOrder);

    res.status(201).json({
      message: "Order placed successfully",
      order: newMemOrder
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. UPDATE ORDER STATUS
const updateOrderStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const { orderStatus, paymentStatus } = req.body;

    const validStatuses = ["Placed", "Confirmed", "Shipped", "Out for Delivery", "Delivered"];
    if (orderStatus && !validStatuses.includes(orderStatus)) {
      return res.status(400).json({
        message: `Invalid orderStatus. Must be one of: ${validStatuses.join(", ")}`
      });
    }

    if (mongoose.connection.readyState === 1) {
      let updatedOrder = null;
      const updateData = {};
      if (orderStatus) updateData.orderStatus = orderStatus;
      if (paymentStatus) updateData.paymentStatus = paymentStatus;

      if (mongoose.Types.ObjectId.isValid(id)) {
        updatedOrder = await Order.findByIdAndUpdate(id, updateData, { new: true });
      }
      if (!updatedOrder) {
        updatedOrder = await Order.findOneAndUpdate({ orderId: id }, updateData, { new: true });
      }

      if (!updatedOrder) {
        return res.status(404).json({ message: "Order not found" });
      }
      return res.status(200).json({
        message: "Order status updated successfully",
        order: updatedOrder
      });
    }

    // Fallback
    const orderIndex = memoryOrders.findIndex((o) => o._id === id || o.orderId === id);
    if (orderIndex === -1) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (orderStatus) memoryOrders[orderIndex].orderStatus = orderStatus;
    if (paymentStatus) memoryOrders[orderIndex].paymentStatus = paymentStatus;
    memoryOrders[orderIndex].updatedAt = new Date().toISOString();

    res.status(200).json({
      message: "Order status updated successfully",
      order: memoryOrders[orderIndex]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus
};
