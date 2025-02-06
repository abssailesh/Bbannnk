const express = require('express');
const {
  vendorLogin,
  vendorRegister,
  resetPassword,  // Forgot password handler (Send OTP)
  resetPasswordWithOtp,  // Reset password using OTP
  generateApiKey,
  getVendorProfile,
  updateVendorProfile,
  getVendorTransactions
} = require('../controllers/vendorController');  // Ensure this file exists
const protect = require('../middleware/protect');  // Ensure this file exists

const router = express.Router();

// Vendor registration route
router.post('/register', vendorRegister);

// Vendor login route
router.post('/login', vendorLogin);

// Forgot password (send OTP to vendor's email)
router.post('/reset-password', resetPassword);  // Forgot password route (Generate OTP)

// Reset password using OTP
router.post('/reset-password-with-otp', resetPasswordWithOtp);  // New route to reset password with OTP

// Generate API key (Protected route)
router.post('/generate-api-key', protect, generateApiKey);

// Update and View Profile (Protected routes)
router.get('/profile', protect, getVendorProfile);  // View profile
router.put('/profile', protect, updateVendorProfile);  // Update profile

// Vendor Transaction details (Protected route)
router.get('/transactions', protect, getVendorTransactions);

module.exports = router;
