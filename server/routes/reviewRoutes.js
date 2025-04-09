import express from 'express';
import {
  createReview,
  getSellerReviews,
  getAllReviews,
  deleteReview,
  filterReviewsByRating,
  getAverageRating,
} from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';
import { selfOrAdmin } from '../middleware/selfOrAdmin.js';

const router = express.Router();

router.post('/', protect, createReview);
router.get('/seller/:sellerId', getSellerReviews);
router.get('/', getAllReviews);
router.delete('/', protect, selfOrAdmin, deleteReview);
router.post('/filter-by-rating', filterReviewsByRating);
router.post('/average', getAverageRating);

export default router;
