const mongoose = require('mongoose');
const crypto = require('crypto');

const VendorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Vendor name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/\S+@\S+\.\S+/, "Invalid email format"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  apiKey: {
    type: String,
    default: () => crypto.randomBytes(32).toString('hex'), // ✅ Auto-generate API key
  },
}, { timestamps: true });

module.exports = mongoose.model('Vendor', VendorSchema);
