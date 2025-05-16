import asyncHandler from 'express-async-handler';
import Auction from '../models/auctionModel.js';
import Bid from '../models/bidModel.js';
import User from '../models/userModel.js';
import { sendMail } from '../utils/emailService.js';
import Machinery from '../models/machineryModel.js';
import Transaction from '../models/transactionModel.js';
import { scheduleAuctionClose } from '../utils/auctionScheduler.js';

/**
 * @desc    create auction
 * @route   POST /api/auctions
 * @access  Seller (protect)
 */
export const createAuction = asyncHandler(async (req, res) => {
  let {
    machineryId,
    startTime,
    endTime,
    startingPrice,
    minimumIncrement = 1,
    title,
    serialNumber,
    usedHours,
    condition,
    qualityDescription,
    origin,
    voltage,
    category,
    equipmentDetails,
    originalInvoice,
    manufacturingDate,
    manufacturer,
    priceCents,
    location,
    images,
    video,
  } = req.body;

  // 1) If no machineryId was passed, create the Machinery record first
  if (!machineryId) {
    // validate required machine fields...
    if (!title || !serialNumber || priceCents == null) {
      return res.status(400).json({ message: 'Missing required machine fields' });
    }
    const machine = await Machinery.create({
      title,
      serialNumber,
      usedHours,
      condition,
      qualityDescription,
      origin,
      voltage,
      category,
      equipmentDetails,
      originalInvoice,
      manufacturingDate,
      manufacturer,
      priceCents,
      location,
      images,
      video,
      seller: req.user._id,
      isAuction: true,       // mark it as auctioned
    });
    machineryId = machine._id;
  } else {
    // if machine already exists, flip its isAuction flag
    await Machinery.findByIdAndUpdate(machineryId, { isAuction: true });
  }

  // 2) Validate auction-specific inputs
  if (!endTime || startingPrice == null) {
    return res.status(400).json({
      message: 'endTime and startingPrice are required for auction'
    });
  }
  if (startTime && new Date(startTime) >= new Date(endTime)) {
    return res.status(400).json({ message: 'endTime must come after startTime' });
  }

  // 3) Create the auction
  const auction = await Auction.create({
    machine: machineryId,
    seller: req.user._id,
    startTime: startTime ? new Date(startTime) : Date.now(),
    endTime: new Date(endTime),
    startingPrice,
    minimumIncrement,
    isActive: true,
  });

  // 4) Schedule auto-close & notify
  scheduleAuctionClose(auction);
  const io = req.app.get('io');
  io?.emit('auctionCreated', auction);

  res.status(201).json({
    message: 'Machine and auction created successfully',
    auction,
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
    .populate('machine')
    .populate('seller', 'username');

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
  const auction = await Auction.findById(req.params.id)
    .populate('machine seller')
    .populate('seller', 'username');
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

  const previousBid = floor;
  const previousBidder = auction.currentBidBy;
  auction.currentBid = amount;
  auction.currentBidBy = userId;
  await auction.save();

  const bidderUser = await User.findById(userId);
  if (bidderUser?.email) {
    await sendMail({
      to: bidderUser.email,
      from: process.env.SMTP_FROM,
      subject: `You placed a bid on "${auction.machine.title}"`,
      text: `You placed a bid of $${amount} on "${auction.machine.title}"`,
      html: `
      <p>Hi ${bidderUser.username},</p>
      <p>Your bid of <strong>$${amount}</strong> on 
         <em>${auction.machine.title}</em> has been placed successfully.</p>
      <p><a href="${process.env.CLIENT_URL}/auctions/${auction._id}">
         View your bid in the auction &rarr;
      </a></p>
    `,
    });
  }

  if (previousBidder && previousBidder.toString() !== userId.toString()) {
    const outbidUser = await User.findById(previousBidder);
    if (outbidUser?.email) {
      await sendMail({
        to: outbidUser.email,
        from: process.env.SMTP_FROM,
        subject: `You’ve been outbid on "${auction.machine.title}"`,
        text: `Your bid of $${previousBid} was topped by another bidder. The new high bid is $${amount}.`,
        html: `<p>Hi ${outbidUser.username},</p>
                <p>Your $${previousBid} bid on <strong>${auction.machine.title}</strong> has been outbid.</p>
                <p><a href="${process.env.CLIENT_URL}/auctions/${auction._id}">View the auction</a></p>`,
      });
    }
  }

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
  const auction = await Auction.findById(req.params.id)
    .populate('machine', 'title')
    .populate('seller', 'username');
  if (!auction || !auction.isActive) {
    return res.status(400).json({ message: 'Auction not available' });
  }
  auction.isActive = false;

  auction.winner = auction.currentBidBy;
  auction.winnerBid = auction.currentBid;
  await auction.save();

  if (auction.currentBidBy) {
    const winner = await User.findById(auction.currentBidBy);
    if (winner?.email) {
      await sendMail({
        to: winner.email,
        from: process.env.SMTP_FROM,
        subject: `🎉 You won "${auction.machine.title}"!`,
        text: `Congrats! You won with a bid of $${auction.currentBid}.`,
        html: `
          <p>Hi ${winner.username},</p>
          <p>Your bid of <strong>$${auction.currentBid}</strong> won the auction for
             <em>${auction.machine.title}</em>.</p>
          <p><a href="${process.env.CLIENT_URL}/auctions/${auction._id}">
             View your purchase →</a></p>
        `,
      });
    }
  }

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
 * @desc    Delete an auction (and its machinery)
 * @route   DELETE /api/auctions/:id
 * @access  Seller (protect + ownership)
 */
export const deleteAuction = asyncHandler(async (req, res) => {
  const auction = await Auction.findById(req.params.id);
  if (!auction) {
    return res.status(404).json({ message: 'Auction not found' });
  }
  // only the auction owner can delete
  if (auction.seller.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized to delete this auction' });
  }

  // grab the machine id before deleting the auction
  const machineId = auction.machine;

  // delete auction…
  await auction.deleteOne();

  // …then delete the machine (or just flip isAuction: false if you’d rather keep the listing)
  await Machinery.findByIdAndDelete(machineId);

  res.status(200).json({ message: 'Auction and its machinery deleted successfully' });
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
  if (auction.currentBidBy.toString() !== userId.toString()) {
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
    amountCents: auction.currentBid * 100,
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
