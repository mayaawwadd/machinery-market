import mongoose from 'mongoose';
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
  //check if the user already submitted a review for this machine
  const existingReview = await Review.findOne({
    buyer: req.user._id,
    machine,
  });
  if (existingReview) {
    return res.status(400).json({
      message: 'You have already submitted a review for this machine',
    });
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

  //filter out flagged reviews
  const visibleReviews = reviews.filter((r) => !r.isFlagged);

  if (!visibleReviews.length) {
    return res.status(400).json({ message: 'No visible reviews available' });
  }

  res.status(200).json(visibleReviews);
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
export const deleteReview = asyncHandler(async (req, res) => {
  const { _id: reviewId } = req.params;

  if (!reviewId) {
    res.status(400).json({ message: 'Review ID is required' });
  }

  const review = await Review.findById(reviewId);

  if (!review) {
    res.status(400).json({ message: 'Review not found' });
  }

  await review.deleteOne();
  res.status(200).json({ message: 'Review deleted successfully' });
});

// @desc    filter review by rating
// @route   POST /api/reviews/filter-by-rating
// @access  Private (buyer only)
export const filterReviewsByRating = asyncHandler(async (req, res) => {
  const { rating } = req.body;

  //validate rating input
  if (rating === undefined || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }

  const reviews = await Review.find({ rating })
    .populate('buyer', 'username email')
    .sort({ createdAt: -1 });

  //check if reviews of that rating is available
  if (!reviews.length) {
    return res
      .status(404)
      .json({ message: 'no reviews found for this rating' });
  }

  res.status(200).json(reviews);
});

// @desc    get sellers average rating
// @route   POST /api/reviews/average
// @access  Private (buyer only)

//this still doesnt work correctly in postman
export const getAverageRating = asyncHandler(async (req, res) => {
  const { seller, machine } = req.body;

  if (!seller && !machine) {
    return res
      .status(400)
      .json({ message: 'Provide either seller or machine ID' });
  }

  //if seller is provided matchCriteria becomes {seller : sellerId} else machine
  let matchCriteria = {};

  if (seller) {
    matchCriteria = { seller: new mongoose.Types.ObjectId(seller) };
  } else if (machine) {
    matchCriteria = { machine: new mongoose.Types.ObjectId(machine) };
  }

  const result = await Review.aggregate([
    { $match: matchCriteria }, // This filter reviews either by seller or machine depends on whats sent
    {
      $group: {
        //groups the matched reviews
        _id: null,
        averageRating: { $avg: '$rating' }, // Calculates avg , avg is function in MongoDb
        totalReviews: { $sum: 1 }, // For each matched document , increments 1
      },
    },
  ]);

  if (!result.length) {
    return res
      .status(404)
      .json({ message: 'No reviews found for the given criteria' });
  }
  res.status(200).json({
    averageRating: result[0].averageRating.toFixed(1), //to fixed makes it look nicer ex. 4.33333 to 4.3
    totalReviews: result[0].totalReviews,
  });
});

export const flagReview = asyncHandler(async (req, res) => {
  const { _id, reason } = req.body;

  if (!_id || !reason) {
    return res
      .status(400)
      .json({ message: 'Review Id and reason are required' });
  }

  const review = await Review.findById(_id);
  if (!review) {
    return res.status(404).json({ message: 'Review not found' });
  }
  //flag the review and store the reason
  review.isFlagged = true;
  review.flagReason = reason;

  const updated = await review.save();

  res.status(200).json({
    message: 'review flagged for moderation',
    review: updated,
  });
});
