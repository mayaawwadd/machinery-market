import express from 'express';
import {
  registerUser,
  loginUser,
  getAllUsers,
  updateUser,
  deleteUser,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';
import { selfOrAdmin } from '../middleware/selfOrAdmin.js';

// Create a new Express router instance
const router = express.Router();

// Protected Routes (require login)
router
  .route('/')
  .get(protect, adminOnly, getAllUsers)
  .patch(protect, updateUser)
  .delete(protect, selfOrAdmin, deleteUser);

// Public Routes
// @route   POST /api/users/register
// @desc    Register a new user
router.post('/register', registerUser);

// @route   POST /api/users/login
// @desc    Login and return token
router.post('/login', loginUser);

// Export the router
export default router;
