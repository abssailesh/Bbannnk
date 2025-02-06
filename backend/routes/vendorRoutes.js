const express = require('express');
const {
  vendorLogin,
  vendorRegister,
  resetPassword,  // Forgot password handler
  resetPasswordWithToken,  // Reset password with token handler
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

// Forgot password (generate reset token)
router.post('/reset-password', resetPassword);  // Forgot password route

// Reset password (use token to reset)
// router.post('/reset-password', resetPasswordWithToken);  // Reset password using token

// Generate API key (Protected route)
router.post('/generate-api-key', protect, generateApiKey);

// Update and View Profile (Protected routes)
router.get('/profile', protect, getVendorProfile);  // View profile
router.put('/profile', protect, updateVendorProfile);  // Update profile

// Vendor Transaction details (Protected route)
router.get('/transactions', protect, getVendorTransactions);

module.exports = router;
