import express from 'express';
import {
  createMachinery,
  getAllMachinery,
  getMachineryById,
  updateMachinery,
  deleteMachinery,
  getMyMachinery,
} from '../controllers/machineryController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';
import { selfOrAdmin } from '../middleware/selfOrAdmin.js';
import { ownerOrAdmin } from '../middleware/ownerOrAdmin.js';

const router = express.Router();

/**
 * @route   POST /api/machinery
 * @desc    Create a new machinery listing
 * @access  Protected
 */
router.post('/', protect, createMachinery);

/**
 * @route   GET /api/machinery
 * @desc    Fetch all machinery listings
 * @access  Public
 */
router.get('/', protect, adminOnly, getAllMachinery);

/**
 * @route   GET /api/machinery/my
 * @desc    Get machinery listings for the current logged-in user
 * @access  Protected
 */
router.get('/my', protect, getMyMachinery);

/**
 * @route   GET /api/machinery/:id
 * @desc    Fetch a single machinery listing by ID
 * @access  Public
 */
router.get('/:id', getMachineryById);

/**
 * @route   PATCH /api/machinery/:id
 * @desc    Partially update a machinery listing
 * @access  Protected (only the seller or admin)
 */
router.patch('/:id', protect, ownerOrAdmin, updateMachinery);

/**
 * @route   DELETE /api/machinery/:id
 * @desc    Delete a machinery listing
 * @access  Protected (only the seller or admin)
 */
router.delete('/:id', protect, ownerOrAdmin, deleteMachinery);

export default router;
