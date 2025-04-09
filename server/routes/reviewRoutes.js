import express from 'express';
import {
  createReview,
  getSellerReviews,
  getAllReviews,
  deleteReview,
} from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';
import { selfOrAdmin } from '../middleware/selfOrAdmin.js';

const router = express.Router();

router.post('/', protect, createReview);
router.get('/seller/:sellerId', getSellerReviews);
router.get('/', getAllReviews);
router.delete('/', protect, selfOrAdmin, deleteReview);

export default router;
