import Auction from '../models/auctionModel.js';
import { io } from 'socket.io-client';
import User from '../models/userModel.js';
import { sendMail } from './emailService.js';

const timers = new Map();

//this function is not used yet , but its a clean code practice that i will use in the future
export function scheduleActiveAuctions(io) {
  Auction.find({ isActive: true })
    .lean()
    .then((auctions) => {
      auctions.forEach((auction) => scheduleAuctionClose(auction, io));
      console.log(`Scheduled active auctions ${auctions.length}`);
    })
    .catch((err) => {
      console.error('Error scheduling active auctions:', err);
    });
}

// Function to close an auction by ID
// This function is called when the auction time is up
export async function closeAuctionById(io, auctionId) {
  const auction = await Auction.findById(auctionId)
    .populate('machine', 'title')
    .populate('seller', 'username');
  if (!auction || !auction.isActive) {
    return;
  }
  auction.isActive = false;
  await auction.save();
  io.to(auctionId).emit('auctionClosed', {
    auctionId: auction._id,
    currentBidBy: auction.currentBidBy,
    currentBid: auction.currentBid,
  });

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

// Function to schedule the closing of an auction
// This function is called when an auction is created or updated
export function scheduleAuctionClose(auction, io) {
  if (timers.has(auction._id)) {
    clearTimeout(timers.get(auction._id));
  }
  const msUntilEnd = new Date(auction.endTime).getTime() - Date.now();
  const handle = setTimeout(() => {
    closeAuctionById(io, auction._id);
    timers.delete(auction._id);
  }, Math.max(msUntilEnd, 0));
  timers.set(auction._id, handle);
}
