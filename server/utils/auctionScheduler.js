import Auction from '../models/auctionModel.js';
import { io } from 'socket.io-client';

const timers = new Map();

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
