require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');

const app = express();

//middleware
app.use(cors());
app.use(express.json());
app.use('/api/users', userRoutes);

// Placeholder for DB connection
connectDB();

//test route
app.get('/', (req, res) => {
  res.send('API is running...');
});

//initilaize server and run
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
