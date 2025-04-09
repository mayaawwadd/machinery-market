import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'buyer ID is required'],
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Seller ID is required'],
    },

    machine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Machinery',
      default: null, // optional
    },

    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },

    comment: {
      type: String,
      required: [true, 'Comment is required'],
      minlength: [5, 'Comment must be at least 5 characters long'],
      trim: true,
    },
    isFlagged: {
      type: Boolean,
      default: false,
    },
    flagReason: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.model('Review', reviewSchema);
export default Review;
