//this is a test file to test the socket connection and the auction events
// as i dont have a client side yet
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000'; // Replace with your server URL

const auctionId = '681e56f8f28d40e11595299d'; // Replace with your auction ID
const socket = io(SOCKET_URL, {
  path: '/socket.io',
  transports: ['websocket'],
  withCredentials: true,
});

socket.on('connect', () => {
  console.log('Connected to server', socket.id);

  // Join the auction room
  socket.emit('joinAuction', auctionId);
  console.log(`Joined auction room: ${auctionId}`);
});
socket.on('auctionCreated', (auction) => {
  console.log('Auction created:', auction);
});

socket.on('bidPlaced', (bid) => {
  console.log('New bid placed:', bid);
});
socket.on('auctionClosed', (data) => {
  console.log('Auction closed:', data);
});
socket.on('error', (error) => {
  console.error('Socket error:', error);
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});
socket.on('connect_error', (error) => {
  console.error('Connection error:', error);
});
