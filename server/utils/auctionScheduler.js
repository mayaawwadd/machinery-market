import Auction from '../models/auctionModel.js';
import User from '../models/userModel.js';
import { sendMail } from './emailService.js';

const timers = new Map();

/**
 * On server startup, schedule all still‐active auctions.
 */
export function scheduleActiveAuctions(io) {
  Auction.find({ isActive: true })
    .lean()
    .then(auctions => {
      console.log(`Scheduling ${auctions.length} active auctions`);
      auctions.forEach(a => scheduleAuctionClose(a, io));
    })
    .catch(err => console.error('Error scheduling active auctions:', err));
}

/**
 * Closes the auction, emits to clients, and notifies users.
 */
export async function closeAuctionById(io, auctionId) {
  const auction = await Auction.findById(auctionId)
    .populate('machine', 'title')
    .populate('seller', 'username email')
    .populate('currentBidBy', 'username');

  if (!auction || !auction.isActive) {
    return;
  }

  auction.isActive = false;
  auction.winner = auction.currentBidBy;
  auction.winnerBid = auction.currentBid;
  await auction.save();

  // Broadcast to everyone in the auction room
  io.to(auctionId).emit('auctionClosed', {
    auctionId,
    winner: auction.currentBidBy,
    winnerBid: auction.currentBid,
  });

  // Notify Winner
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

  // Notify seller
  if (auction.seller?.email) {
    await sendMail({
      to: auction.seller.email,
      from: process.env.SMTP_FROM,
      subject: `Your Auction closed for "${auction.machine.title}"`,
      text: `The auction for "${auction.machine.title}" was closed and the final price is ${auction.currentBid}.`,
      html: `
        <p>Hi ${auction.seller.username},</p>
        <p>The auction for <strong>${auction.machine.title}</strong> has closed.</p>
        <p><a href="${process.env.CLIENT_URL}/auctions/${auction._id}">
           View the auction →</a></p>
      `,
    });
  }
}

/**
 * When a new auction is created or updated, call this to schedule its close.
 */
export function scheduleAuctionClose(auction, io) {
  const id = auction._id.toString();
  if (timers.has(id)) clearTimeout(timers.get(id));

  const ms = new Date(auction.endTime).getTime() - Date.now();
  const timeout = setTimeout(() => {
    closeAuctionById(io, id);
    timers.delete(id);
  }, Math.max(ms, 0));

  timers.set(id, timeout);
}