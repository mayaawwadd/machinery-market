import mongoose from 'mongoose';

// Establish a connection with MongoDB
const connectDB = async () => {
  try {
    // Create a connection using the connection string stored in .env
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // Log the host name on successful connection
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    // Log any connection errors and exit the process in case of failure
    console.log('❌ MongoDB connection failed:', err);
    process.exit(1);
  }
};

export default connectDB;
