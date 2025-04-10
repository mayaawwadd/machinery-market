import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUser,
  deleteUser,
  getAllUsers,
  uploadProfileImage,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';
import { selfOrAdmin } from '../middleware/selfOrAdmin.js';
import { upload } from '../middleware/uploadMiddleware.js';

// Create a new Express router instance
const router = express.Router();

// Public Routes

// @route   POST /api/users/register
// @desc    Register a new user
router.post('/register', registerUser);

// @route   POST /api/users/login
// @desc    Login and return token
router.post('/login', loginUser);

// Protected Routes (require login)

// @route   GET /api/users/profile
// @desc    Get logged-in user's profile
router.get('/profile', protect, getUserProfile);

// @route   Patch /api/users/profile
// @desc    Update logged-in user's profile
router.patch('/profile', protect, updateUser);

// @route   DELETE /api/users/:id
// @desc    Delete logged-in user's profile
router.delete('/:id', protect, selfOrAdmin, deleteUser);

// @route   GET /api/users/profile
// @desc    Get all users
router.route('/').get(protect, adminOnly, getAllUsers);

// @route POST /api/users/upload-profile-image
// @desc Upload profile image
router.post(
  '/upload-profile-image',
  protect,
  upload.single('image'),
  uploadProfileImage
);

// Export the router
export default router;
