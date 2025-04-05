import mongoose from 'mongoose';

const bidSchema = new mongoose.Schema(
  {
    bidder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Bidder is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Bid amount is required'],
      min: [1, 'Bid amount must be greater than 0'],
    },
    bidTime: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);
const auctionSchema = new mongoose.Schema(
  {
    machine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Machinery',
      required: [true, 'Machine ID is required'],
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Seller ID is required'],
    },
    startingPrice: {
      type: Number,
      required: [true, 'Starting price is required'],
      min: [0, 'Starting price cannot be negative'],
    },
    currentBid: {
      type: Number,
      default: 0,
      min: [0, 'Current bid cannot be negative'],
    },
    bids: {
      type: [bidSchema],
      default: [],
      validate: {
        validator: (arr) => Array.isArray(arr),
        message: 'Bids must be an array',
      },
    },
    startTime: {
      type: Date,
      required: [true, 'Auction start time is required'],
      validate: {
        validator: function (value) {
          return value > new Date();
        },
        message: 'Start time must be in the future',
      },
    },
    endTime: {
      type: Date,
      required: [true, 'Auction end time is required'],
      validate: {
        validator: function (value) {
          return this.startTime && value > this.startTime;
        },
        message: 'End time must be after start time',
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
  },
  {
    timestamps: true,
  }
);

const Auction = mongoose.model('Auction', auctionSchema);
export default Auction;
