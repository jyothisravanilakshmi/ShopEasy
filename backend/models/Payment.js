const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true
    },
    userEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    amount: {
      type: Number,
      required: true
    },
    method: {
      type: String,
      required: true,
      enum: ["cod", "upi", "card", "UPI", "Cash on Delivery", "Credit / Debit Card", "Card"]
    },
    status: {
      type: String,
      default: "Success",
      enum: ["Success", "Pending", "Failed", "Paid", "Completed"]
    },
    transactionId: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Payment", paymentSchema);
