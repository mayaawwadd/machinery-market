// Import required modules using ES Modules syntax
import express from 'express';
import {
  registerUser,
  loginUser,
  getAllUsers,
  updateUser,
  deleteUser,
} from '../controllers/userController.js';

// Create a new Express router instance
const router = express.Router();

router.route('/').get(getAllUsers).patch(updateUser).delete(deleteUser);

// @route   POST /api/users/register
// @desc    Register a new user
router.post('/register', registerUser);

// @route   POST /api/users/login
// @desc    Authenticate user and return user info
router.post('/login', loginUser);

// Export the router
export default router;
