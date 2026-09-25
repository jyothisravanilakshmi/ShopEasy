const mongoose = require("mongoose");
const Address = require("../models/Address");

// In-memory fallback if DB is not connected
let memoryAddresses = [];

// 1. GET ADDRESSES (Optional filter by userEmail)
const getAddresses = async (req, res) => {
  try {
    const { userEmail } = req.query;
    const filter = {};
    if (userEmail) filter.userEmail = userEmail.trim().toLowerCase();

    if (mongoose.connection.readyState === 1) {
      const addresses = await Address.find(filter).sort({ createdAt: -1 });
      return res.status(200).json(addresses);
    }

    // Fallback
    let addresses = [...memoryAddresses];
    if (userEmail) {
      addresses = addresses.filter(
        (a) => a.userEmail.toLowerCase() === userEmail.trim().toLowerCase()
      );
    }
    res.status(200).json(addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. CREATE ADDRESS
const createAddress = async (req, res) => {
  try {
    const { userEmail, fullName, phone, address, city, pincode, isDefault } = req.body;

    if (!userEmail || !fullName || !phone || !address || !city || !pincode) {
      return res.status(400).json({
        message: "Please provide userEmail, fullName, phone, address, city, and pincode"
      });
    }

    const cleanEmail = userEmail.trim().toLowerCase();

    if (mongoose.connection.readyState === 1) {
      if (isDefault) {
        await Address.updateMany({ userEmail: cleanEmail }, { isDefault: false });
      }

      const newAddress = await Address.create({
        userEmail: cleanEmail,
        fullName: fullName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        city: city.trim(),
        pincode: pincode.trim(),
        isDefault: !!isDefault
      });

      return res.status(201).json({
        message: "Address saved successfully",
        address: newAddress
      });
    }

    // Fallback
    if (isDefault) {
      memoryAddresses.forEach((a) => {
        if (a.userEmail === cleanEmail) a.isDefault = false;
      });
    }

    const newMemAddress = {
      _id: "addr_" + Date.now(),
      userEmail: cleanEmail,
      fullName: fullName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      city: city.trim(),
      pincode: pincode.trim(),
      isDefault: !!isDefault,
      createdAt: new Date().toISOString()
    };
    memoryAddresses.push(newMemAddress);

    res.status(201).json({
      message: "Address saved successfully",
      address: newMemAddress
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. UPDATE ADDRESS
const updateAddress = async (req, res) => {
  try {
    const id = req.params.id;
    const { fullName, phone, address, city, pincode, isDefault } = req.body;

    if (mongoose.connection.readyState === 1) {
      const updatedAddress = await Address.findByIdAndUpdate(
        id,
        {
          ...(fullName && { fullName: fullName.trim() }),
          ...(phone && { phone: phone.trim() }),
          ...(address && { address: address.trim() }),
          ...(city && { city: city.trim() }),
          ...(pincode && { pincode: pincode.trim() }),
          ...(isDefault !== undefined && { isDefault })
        },
        { new: true }
      );

      if (!updatedAddress) {
        return res.status(404).json({ message: "Address not found" });
      }
      return res.status(200).json({ message: "Address updated successfully", address: updatedAddress });
    }

    // Fallback
    const index = memoryAddresses.findIndex((a) => a._id === id);
    if (index === -1) {
      return res.status(404).json({ message: "Address not found" });
    }
    memoryAddresses[index] = {
      ...memoryAddresses[index],
      ...(fullName && { fullName: fullName.trim() }),
      ...(phone && { phone: phone.trim() }),
      ...(address && { address: address.trim() }),
      ...(city && { city: city.trim() }),
      ...(pincode && { pincode: pincode.trim() }),
      ...(isDefault !== undefined && { isDefault })
    };
    res.status(200).json({ message: "Address updated successfully", address: memoryAddresses[index] });
  } catch (error) {
    res.status(400).json({ message: "Invalid address ID" });
  }
};

// 4. DELETE ADDRESS
const deleteAddress = async (req, res) => {
  try {
    const id = req.params.id;

    if (mongoose.connection.readyState === 1) {
      const deleted = await Address.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ message: "Address not found" });
      }
      return res.status(200).json({ message: "Address deleted successfully" });
    }

    // Fallback
    const index = memoryAddresses.findIndex((a) => a._id === id);
    if (index === -1) {
      return res.status(404).json({ message: "Address not found" });
    }
    memoryAddresses.splice(index, 1);
    res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Invalid address ID" });
  }
};

module.exports = {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress
};
