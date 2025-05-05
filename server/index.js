// Load environment variables from .env
import dotenv from 'dotenv';
dotenv.config();

// Core dependencies
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Custom modules
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import machineryRoutes from './routes/machineryRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';

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

// Routes
app.use('/api/users', userRoutes);
app.use('/api/machinery', machineryRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/transactions', transactionRoutes);

// Test route
app.get('/api', (req, res) => {
  res.send('🚀 API is running...');
});

// Initialize server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
