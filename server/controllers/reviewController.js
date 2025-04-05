import Review from '../models/reviewModel.js';
import asyncHandler from 'express-async-handler';

export const createReview = asyncHandler(async (req, res) => {
  const { seller, machine, rating, comment } = req.body;

  if (!rating || !comment || !seller) {
    return res
      .status(400)
      .json({ message: 'all required fields must be filled' });
  }

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
