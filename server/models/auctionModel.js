// models/auctionModel.js
import mongoose from 'mongoose';

const auctionSchema = new mongoose.Schema(
  {
    machine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Machinery',
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    startingPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    currentBid: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    currentBidBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    minimumIncrement: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
      validate: {
        validator: function (v) {
          return v > this.startTime;
        },
        message: 'End time must come after start time',
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    winnerBid: {
      type: Number,
      default: null,
    },
    previousBidBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// single‐field indexes
// Indexes on isActive and endTime for fast “live” queries
auctionSchema.index({ isActive: 1 });
auctionSchema.index({ endTime: 1 });

const Auction = mongoose.model('Auction', auctionSchema);
export default Auction;
