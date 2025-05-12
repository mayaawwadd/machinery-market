import asyncHandler from 'express-async-handler';
import Auction from '../models/auctionModel.js';
import Bid from '../models/bidModel.js';
import Machinery from '../models/machineryModel.js';
import Transaction from '../models/transactionModel.js';
import { scheduleAuctionClose } from '../utils/auctionScheduler.js';

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

  // Optional extra validation:
  if (startTime && new Date(startTime) >= new Date(endTime)) {
    return res
      .status(400)
      .json({ message: 'endTime must be after startTime' });
  }

  const auction = await Auction.create({
    machine: machineryId,
    seller: req.user._id,
    startTime: startTime ? new Date(startTime) : Date.now(),
    endTime: new Date(endTime),
    startingPrice,
    minimumIncrement: minimumIncrement ?? 1,
    isActive: true,
  });

  if (!auction) {
    return res.status(500).json({ message: 'Auction creation failed' });
  }

  // Mark the machinery as “now being auctioned”
  await Machinery.findByIdAndUpdate(machineryId, { isAuction: true });

  // Schedule auto-close
  scheduleAuctionClose(auction);

  // Broadcast over sockets
  const io = req.app.get('io');
  if (io) {
    io.emit('auctionCreated', auction);
  }

  res.status(201).json({
    message: 'Auction created successfully',
    auction
  });
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

  res.status(200).json(auctions);
});

/**
 * @desc    GET auctions by id
 * @route   GET /api/auctions/:id
 * @access  Public
 */
export const getAuctionById = asyncHandler(async (req, res) => {
  const auction = await Auction.findById(req.params.id)
    .populate('machine seller', 'title equipmentDetails username');

  if (!auction) {
    return res.status(404).json({ message: 'Auction not found' });
  }

  // Load bids (sorted by time)
  const bids = await Bid.find({ auction: auction._id })
    .populate('bidder', 'username')
    .sort('bidTime');

  res.status(200).json({ auction, bids });
});

/**
 * @desc    place bid
 * @route   POST /api/auctions/:id/bid
 * @access  Buyer (protect)
 */
export const placeBid = asyncHandler(async (req, res) => {
  const { amount } = req.body;
  const userId = req.user._id;

  // Step 1: fetch + validate auction state
  const auction = await Auction.findById(req.params.id);
  if (!auction || !auction.isActive) {
    return res.status(400).json({ message: 'Auction is not active' });
  }

  const now = new Date();
  if (now < auction.startTime) {
    return res.status(400).json({ message: 'Auction has not started yet' });
  }
  if (now > auction.endTime) {
    return res.status(400).json({ message: 'Auction has ended' });
  }

  // Determine minimum valid bid
  const floor = Math.max(auction.currentBid, auction.startingPrice);
  const minNext = floor + auction.minimumIncrement;
  if (amount < minNext) {
    return res.status(400).json({ message: `Bid must be at least ${minNext}` });
  }

  // Step 2: Record the highest bid 
  const bid = await Bid.create({
    auction: auction._id,
    bidder: userId,
    amount,
  });

  // Step 3: If bid arrives in last X minutes, extend auction by X
  let extended = false;
  const EXTENSION_WINDOW_MS = 1000 * 60 * 5; // 5 minutes
  if (auction.endTime - now <= EXTENSION_WINDOW_MS) {
    auction.endTime = new Date(auction.endTime.getTime() + EXTENSION_WINDOW_MS);
    extended = true;
  }

  // Step 4: automatically bump the top-bid fields
  auction.currentBid = amount;
  auction.currentBidBy = userId;
  await auction.save();

  if (extended) {
    scheduleAuctionClose(auction);
  }

  const io = req.app.get('io');
  if (io) {
    io.to(auction._id.toString()).emit('bidPlaced', {
      auctionId: auction._id,
      currentBid: auction.currentBid,
      currentBidBy: auction.currentBidBy,
      endTime: auction.endTime,
      bid,
    });
  }

  res.json({ message: 'Bid placed', bid, currentBid: auction.currentBid });
});

/**
 * @desc    close auction
 * @route   PATCH /api/auctions/:id/closeAuction
 * @access  Seller or Admin (protect + selfOrAdmin)
 */
//this function is not involved in closing the auction automatically
//this function is used to close the auction manually by the seller or admin
export const closeAuction = asyncHandler(async (req, res) => {
  const auction = await Auction.findById(req.params.id);
  if (!auction || !auction.isActive) {
    return res.status(400).json({ message: 'Auction not available' });
  }
  auction.isActive = false;

  auction.winner = auction.currentBidBy;
  auction.winnerBid = auction.currentBid;
  await auction.save();

  const io = req.app.get('io');
  if (io) {
    io.to(auction._id.toString()).emit('auctionClosed', {
      auctionId: auction._id,
      winner: auction.winner,
      winnerBid: auction.winnerBid,
    });
  }

  res.status(200).json({ message: 'Auction closed', auction });
});

/**
 * @desc    Create a purchase for an auction winner
 * @route   POST /api/auctions/:auctionId/purchase
 * @access  Buyer (protect + selfOrAdmin?)
 */
export const purchaseAuction = asyncHandler(async (req, res) => {
  const { auctionId } = req.params;
  const userId = req.user._id;

  // 1) Find the auction
  const auction = await Auction.findById(auctionId).populate('machine seller');
  if (!auction) {
    return res.status(404).json({ message: 'Auction not found' });
  }

  // 2) Must be closed
  if (auction.isActive) {
    return res.status(400).json({ message: 'Auction not yet closed' });
  }

  // 3) Only the winner can buy
  if (auction.winner.toString() !== userId.toString()) {
    return res.status(403).json({ message: 'You are not the winner' });
  }

  // 4) Prevent duplicate purchases
  const existing = await Transaction.findOne({ auction: auctionId });
  if (existing) {
    return res
      .status(409)
      .json({ message: 'Purchase already initiated for this auction' });
  }

  // 5) Create the transaction
  const tx = await Transaction.create({
    buyer: userId,
    seller: auction.seller._id,
    machinery: auction.machine._id,
    auction: auctionId,
    amountCents: auction.winnerBid * 100,
    currency: 'USD',
    paymentMethod: 'paypal',
    paymentStatus: 'pending',
    isPaid: false,
  });

  res.status(201).json({
    message: 'Transaction created, proceed to payment',
    transaction: tx,
  });
});
