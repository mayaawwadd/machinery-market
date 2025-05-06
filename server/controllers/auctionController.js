import asyncHandler from 'express-async-handler';
import Auction from '../models/auctionModel.js';

/**
 * @desc    create auction
 * @route   POST /api/auctions
 * @access  Seller (protect)
 */
export const createAuction = asyncHandler(async (req, res) => {
  const { machineryId, startTime, endTime, startingPrice, minimumIncrement } =
    req.body;
  if (!machineryId || !endTime || startingPrice == null) {
    return res
      .status(400)
      .json({ message: 'machineryId, endTime & startingPrice are required' });
  }
  const auction = await Auction.create({
    machine: machineryId,
    seller: req.user._id,
    startTime: startTime || Date.now(),
    endTime,
    startingPrice,
    minimumIncrement: minimumIncrement ?? 1,
    isActive: true,
  });
  if (!auction) {
    return res.status(401).json({ message: 'auction creation failed' });
  }
  res.status(201).json({ message: 'auction created successfully' }, auction);
});

/**
 * @desc    GET all auctions
 * @route   GET /api/auctions
 * @access  Public
 */
export const getAllAuctions = asyncHandler(async (req, res) => {
  const auctions = await Auction.find().populate(
    'machine seller',
    'title equipmentDetails username'
  );

  if (auctions.length === 0) {
    return res.status(404).json({ message: 'no auctions available' });
  }
  res.status(200).json(auctions);
});

/**
 * @desc    GET all live auctions
 * @route   GET /api/auctions/getLiveAuctions
 * @access  Public
 */
export const getLiveAuctions = asyncHandler(async (req, res) => {
  const auctions = await Auction.find({ isActive: true }).populate(
    'machine seller',
    'title equipmentDetails username'
  );
  if (auctions.length === 0) {
    return res.status(404).json({ message: 'no auctions available' });
  }

  res.status(200).json(auctions);
});

/**
 * @desc    GET auctions by id
 * @route   GET /api/auctions/:id
 * @access  Public
 */
export const getAuctionById = asyncHandler(async (req, res) => {
  const auction = await Auction.findById(req.params.id)
    .populate('machine seller', 'title equipmentDetails username')
    .populate('bids.bidder', 'username');
  if (!auction) {
    return res.status(404).json({ message: 'Auction not found' });
  }
  res.status(200).json(auction);
});

/**
 * @desc    place bid
 * @route   POST /api/auctions/:id/bid
 * @access  Buyer (protect)
 */
export const placeBid = asyncHandler(async (req, res) => {
  const { amount } = req.body;
  const userId = req.user._id;
  const auction = await Auction.findById(req.params.id);
  if (!auction || !auction.isActive) {
    return res.status(400).json({ message: 'Auction is not active' });
  }

  const now = new Date();
  /* if (now < auction.startTime) {
    return res.status(400).json({ message: 'Auction has not started yet' });
  }
  if (now > auction.endTime) {
    return res.status(400).json({ message: 'Auction has already ended' });
  }
    */

  // Determine minimum valid bid
  const currentHigh = auction.highestBid ?? auction.startingPrice;
  const minNext = currentHigh + auction.minimumIncrement;
  if (amount < minNext) {
    return res.status(400).json({
      message: `Bid must be at least ${minNext}`,
    });
  }
  auction.highestBid = amount;
  auction.highestBidBy = userId;

  // If bid arrives in last X minutes, extend auction by X
  const EXTENSION_WINDOW_MS = 1000 * 60 * 5; // 5 minutes
  if (auction.endTime - now <= EXTENSION_WINDOW_MS) {
    auction.endTime = new Date(auction.endTime.getTime() + EXTENSION_WINDOW_MS);
  }

  // Record the bid
  auction.bids.push({
    bidder: userId,
    amount,
    timestamp: now,
  });
  auction.highestBid = amount;
  auction.highestBidBy = userId;

  await auction.save();

  res.json({ message: 'Bid placed', auction });
});
