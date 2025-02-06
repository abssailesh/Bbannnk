const Vendor = require('../models/vendor');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const Transaction = require('../models/Transaction');

let otpStore = {};  // Temporarily storing OTPs (use Redis/DB in production)

// 🔹 Forgot Password (Generate OTP & Send Email)
exports.resetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const vendor = await Vendor.findOne({ email });
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });

    // Generate OTP
    const otp = await createOtp();
    otpStore[email] = otp; // Store OTP temporarily (Consider using Redis or DB for persistence)
    console.log("OTP sent to vendor: ", otp);

    // Send OTP email using nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: "nevergiveupmrkboys@gmail.com",  // Email address
        pass: "ogki qkbk ycuu bkth"            // Password (not recommended for production)
      }
    });

    const mailOptions = {
      to: vendor.email,
      subject: 'Password Reset Request',
      html: `<p>Your OTP to reset your password is: <strong>${otp}</strong></p>`
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('Email sending error:', err);
        return res.status(500).json({ message: 'Failed to send OTP email', error: err });
      }
      res.json({ message: 'OTP sent successfully. Please check your email.' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 🔹 Reset Password Using OTP (Validate OTP & Reset Password)
exports.resetPasswordWithOtp = async (req, res) => {
  const { email, otp, newPassword } = req.body; // Vendor provides email, OTP, and new password
  try {
    if (!otp || !newPassword || !email) {
      return res.status(400).json({ message: 'OTP, email, and new password are required' });
    }

    // Validate OTP
    if (otpStore[email] !== parseInt(otp)) {
      return res.status(400).json({ message: 'Invalid OTP. Please try again.' });
    }

    // Find the vendor by email and reset the password
    const vendor = await Vendor.findOne({ email });
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });

    // Hash the new password and update it
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    vendor.password = hashedPassword;
    await vendor.save();

    // Clear OTP after successful password reset
    delete otpStore[email]; // Delete OTP after use

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 🔹 Vendor login
exports.vendorLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const vendor = await Vendor.findOne({ email });
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    const isMatch = await bcrypt.compare(password, vendor.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { vendorId: vendor._id },
      'your-jwt-secret', // Use your actual JWT secret here
      { expiresIn: '1h' } // Token expiration time
    );

    res.cookie('authToken', token, {
      httpOnly: true,
      secure: false,  // Set to true if you are using HTTPS
      sameSite: 'strict',
      maxAge: 3600000, // 1 hour
    });

    res.json({
      message: 'Login successful',
      vendor: {
        id: vendor._id,
        name: vendor.name,
        email: vendor.email,
        apiKey: vendor.apiKey,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// 🔹 Vendor registration
exports.vendorRegister = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Input validation
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingVendor = await Vendor.findOne({ email });
    if (existingVendor) {
      return res.status(400).json({ message: 'Vendor already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newVendor = await Vendor.create({
      email,
      password: hashedPassword,
      name,
    });

    res.status(201).json({
      message: 'Vendor registered successfully',
      vendor: {
        id: newVendor._id,
        name: newVendor.name,
        email: newVendor.email,
        apiKey: newVendor.apiKey,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};

const createOtp = async () => {
  let otp = await Math.floor(1000 + Math.random() * 9000); // Generate a random 4-digit OTP
  return otp;
};

// 🔹 Get Vendor Profile (Protected)
exports.getVendorProfile = async (req, res) => {
  try {
    if (!req.vendorId) {
      return res.status(400).json({ message: 'No vendor ID, authorization denied' });
    }

    const vendor = await Vendor.findById(req.vendorId).select('-password');

    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    res.json(vendor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 🔹 Update Vendor Profile
exports.updateVendorProfile = async (req, res) => {
  const { name, email } = req.body;
  try {
    const vendor = await Vendor.findById(req.vendorId);
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });

    if (name) vendor.name = name;
    if (email) vendor.email = email;

    await vendor.save();
    res.json({ message: 'Profile updated successfully', vendor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update profile', error: error.message });
  }
};

// 🔹 Get Vendor Transactions
exports.getVendorTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ vendorId: req.vendorId });
    if (!transactions || transactions.length === 0) {
      return res.status(404).json({ message: 'No transactions found' });
    }

    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching transactions', error: error.message });
  }
};

// 🔹 Generate API Key
exports.generateApiKey = async (req, res) => {
  try {
    if (!req.vendorId) {
      return res.status(400).json({ message: 'No vendor ID, authorization denied' });
    }

    const vendor = await Vendor.findById(req.vendorId);
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });

    const apiKey = crypto.randomBytes(32).toString('hex');
    vendor.apiKey = apiKey;
    await vendor.save();

    res.json({ message: 'API key generated successfully', apiKey });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error generating API key', error: error.message });
  }
};
