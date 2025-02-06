const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token = req.cookies?.authToken; // Check in cookies

  // If token is not in cookies, check in headers
  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]; // Extract token
  }

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    req.vendorId = decoded.vendorId; // Attach vendor ID to request
    next(); // Proceed to next middleware
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired, please log in again' });
    }
    return res.status(401).json({ message: 'Invalid token, authentication failed' });
  }
};

module.exports = protect;
