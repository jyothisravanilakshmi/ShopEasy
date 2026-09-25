const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    price: {
      type: Number,
      required: true
    },

    category: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true,
      trim: true
    },

    id: {
      type: Number
    },

    image: {
      type: String,
      default: ""
    },

    stock: {
      type: Number,
      default: 10
    }
  },
  {
    timestamps: true,
    id: false, // Prevents default Mongoose virtual "id" that overrides the numeric id with ObjectId string
    toJSON: { virtuals: false },
    toObject: { virtuals: false }
  }
);

module.exports = mongoose.model("Product", productSchema);
