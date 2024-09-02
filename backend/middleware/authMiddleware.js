const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes by verifying JWT token
exports.protect = (req, res, next) => {
  let token;

  // Check for token in the Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]; // Extract token from the Bearer string
  }

  // Return an error response if no token is found
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, token missing' });
  }

  try {
    // Verify the token using the secret key from environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded token information (user data) to the request object
    req.user = decoded;

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    // Handle token verification errors
    console.error('Token verification failed:', err);
    return res.status(401).json({ message: 'Token is not valid' });
  }
};
