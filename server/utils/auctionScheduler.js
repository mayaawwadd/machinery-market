import Auction from '../models/auctionModel.js';
import { io } from 'socket.io-client';

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
  const auction = await Auction.findById(auctionId);
  if (!auction || !auction.isActive) {
    return;
  }
  auction.isActive = false;
  auction.winner = auction.highestBidBy;
  auction.winnerBid = auction.highestBid;
  await auction.save();
  io.to(auctionId).emit('auctionClosed', {
    auctionId: auction._id,
    winner: auction.winner,
    winnerBid: auction.winnerBid,
  });
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
