// authMiddleware.js

// Middleware to protect routes (using session-based authentication)
exports.protect = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  return res.status(401).json({ message: 'Unauthorized: No session available' });
};