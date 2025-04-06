import Review from '../models/reviewModel.js';
import asyncHandler from 'express-async-handler';

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private (buyer only)
export const createReview = asyncHandler(async (req, res) => {
  const { seller, machine, rating, comment } = req.body;

  if (!rating || !comment || !seller) {
    return res
      .status(400)
      .json({ message: 'all required fields must be filled' });
  }
  //fill the review
  const review = new Review({
    buyer: req.user._id,
    seller,
    machine: machine || null,
    rating,
    comment,
  });
  const savedReview = await review.save();
  res.status(200).json(savedReview);
});

// @desc    Get all reviews for a seller
// @route   GET /api/reviews/seller/:sellerId
// @access  Public
export const getSellerReviews = asyncHandler(async (req, res) => {
  const sellerId = req.params.sellerId;

  if (!sellerId) {
    res.status(400).json({ message: 'seller ID is required' });
  }

  const reviews = await Review.find({ seller: sellerId })
    .populate('buyer', 'username email')
    .sort({ createdAt: -1 });

  if (!reviews || reviews.length === 0) {
    res.status(400).json({ message: 'no reviews available' });
  }

  res.status(200).json(reviews);
});

// @desc    Get all reviews
// @route   GET /api/reviews/
// @access  Public
export const getAllReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find()
    .populate('buyer', 'username email')
    .populate('seller', 'username email')
    .populate('machine', 'title');

  res.status(200).json(reviews);
});

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Admin or Review Owner
export const deleteReview = asyncHandler(async (req, res) => {});
