// Load environment variables from .env
import dotenv from 'dotenv';
dotenv.config();

// Core dependencies
import express from 'express';
import http from 'http';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { Server as SocketIOServer } from 'socket.io';

// Custom modules
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import machineryRoutes from './routes/machineryRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import auctionRoutes from './routes/auctionRoutes.js';
import emailRoutes from './routes/testEmail.js';
import mongoose, { mongo } from 'mongoose';
import Auction from './models/auctionModel.js';
import { scheduleAuctionClose } from './utils/auctionScheduler.js';
import uploadRoutes from './routes/uploadRoutes.js';
import adminRoutes from './routes/adminRoutes.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors()); // Enable Cross-Origin requests
app.use(express.json()); // Parse JSON request bodies

// Serve static files from /public
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/machinery', machineryRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/auctions', auctionRoutes);
app.use('/api', uploadRoutes);
app.use('/api', emailRoutes);
app.use('/api/admin', adminRoutes);


const server = http.createServer(app);

export const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

app.set('io', io);

//constant call to refresh the timeout for the active auctions
// This will be called when the server starts and every time a new auction is created or updated
// so that we can schedule the closing of the auction
// and emit the auctionClosed event to the clients
mongoose.connection.once('open', async () => {
  const active = await Auction.find({ isActive: true }).lean();
  active.forEach((auction) => scheduleAuctionClose(auction, io));
  console.log('Connected to MongoDB and scheduled active auctions');
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log(`New client connected: ${socket.id}`);

  socket.on('joinAuction', (auctionId) => {
    socket.join(auctionId);
    console.log(`Client ${socket.id} joined auction ${auctionId}`);
  });

  socket.on('leaveAuction', (auctionId) => {
    socket.leave(auctionId);
    console.log(`Client ${socket.id} left auction ${auctionId}`);
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Test route
app.get('/api', (req, res) => {
  res.send('🚀 API is running...');
});

// Initialize server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
