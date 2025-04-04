import express from 'express';
import {
  createMachinery,
  getAllMachinery,
  getMachineryById,
} from '../controllers/machineryController.js';

// Initialize the router instance
const router = express.Router();

/**
 * @route   POST /api/machinery
 * @desc    Create a new machinery listing
 * @access  Protected (requires authentication)
 *
 * Expected in req.body:
 * - All required machinery fields (e.g., title, priceFils, images, etc.)
 * - Seller ID should come from req.user (via auth middleware, later)
 */
router.post('/', createMachinery);

/**
 * @route   GET /api/machinery
 * @desc    Fetch all machinery listings
 * @access  Public
 *
 * Returns an array of all machinery documents from the database,
 * including seller info (populated from User model).
 */
router.get('/', getAllMachinery);

/**
 * @route   GET /api/machinery/:id
 * @desc    Fetch a single machinery listing by ID
 * @access  Public
 *
 * :id should be a valid MongoDB ObjectId.
 * If the machinery with that ID exists, it returns the full object;
 * otherwise, returns 404.
 */
router.get('/:id', getMachineryById);

// Export the router so it can be mounted in index.js
export default router;
