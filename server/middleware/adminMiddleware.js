/**
 * Middleware that allows only admin users to proceed.
 * Should be used after 'protect' to ensure user is authenticated first.
 */

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role == 'admin') {
    next(); // Allows the admin to proceed
  } else {
    res.status(403).json({ message: 'Access denied: Admins only' });
  }
};
