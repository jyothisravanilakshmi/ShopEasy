const mongoose = require("mongoose");
const Payment = require("../models/Payment");

// In-memory fallback if DB is not connected
let memoryPayments = [];

// 1. GET ALL PAYMENTS (Optional filter by userEmail or orderId)
const getPayments = async (req, res) => {
  try {
    const { userEmail, orderId } = req.query;
    const filter = {};
    if (userEmail) filter.userEmail = userEmail.trim().toLowerCase();
    if (orderId) filter.orderId = orderId.trim();

    if (mongoose.connection.readyState === 1) {
      const payments = await Payment.find(filter).sort({ createdAt: -1 });
      return res.status(200).json(payments);
    }

    // Fallback
    let payments = [...memoryPayments];
    if (userEmail) {
      payments = payments.filter(
        (p) => p.userEmail.toLowerCase() === userEmail.trim().toLowerCase()
      );
    }
    if (orderId) {
      payments = payments.filter((p) => p.orderId === orderId.trim());
    }
    payments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. PROCESS / RECORD PAYMENT
const processPayment = async (req, res) => {
  try {
    const { orderId, userEmail, amount, method, status } = req.body;

    if (!orderId || !userEmail || amount === undefined || !method) {
      return res.status(400).json({
        message: "Please provide orderId, userEmail, amount, and method (cod, upi, or card)"
      });
    }

    const transactionId = `TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const paymentStatus =
      status || (method === "cod" ? "Pending" : "Success");

    if (mongoose.connection.readyState === 1) {
      const newPayment = await Payment.create({
        orderId: orderId.trim(),
        userEmail: userEmail.trim().toLowerCase(),
        amount: Number(amount),
        method,
        status: paymentStatus,
        transactionId
      });

      return res.status(201).json({
        message: "Payment processed successfully",
        payment: newPayment
      });
    }

    // Fallback
    const newMemPayment = {
      _id: "pay_" + Date.now(),
      orderId: orderId.trim(),
      userEmail: userEmail.trim().toLowerCase(),
      amount: Number(amount),
      method,
      status: paymentStatus,
      transactionId,
      createdAt: new Date().toISOString()
    };
    memoryPayments.unshift(newMemPayment);

    res.status(201).json({
      message: "Payment processed successfully",
      payment: newMemPayment
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPayments,
  processPayment
};
