import express from 'express';
import {
  createReview,
  getSellerReviews,
  getAllReviews,
  deleteReview,
  filterReviewsByRating,
  getAverageRating,
  flagReview,
} from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';
import { selfOrAdmin } from '../middleware/selfOrAdmin.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.post('/', protect, createReview);
router.get('/seller/:sellerId', getSellerReviews);
router.get('/', getAllReviews);
router.delete('/', protect, selfOrAdmin, deleteReview);
router.post('/filter-by-rating', filterReviewsByRating);
router.post('/average', getAverageRating);
router.patch('/flag', protect, adminOnly, flagReview);

export default router;
