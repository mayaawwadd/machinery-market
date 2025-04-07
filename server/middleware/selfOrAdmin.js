import User from '../models/userModel.js';

/**
 * Middleware that allows a user to modify their own account,
 * or an admin to modify any account.
 * Assumes 'protect' ran before and 'req.user' exists.
 */

export const selfOrAdmin = async (req, res, next) => {
  const { id: targetUserId } = req.body;
  const currentUserId = req.user._id.toString();
  const isAdmin = req.user.role === 'admin';

  if (!targetUserId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  if (targetUserId === currentUserId || isAdmin) {
    return next();
  }

  return res
    .status(403)
    .json({ message: 'Not authorized to perform this action' });
};
