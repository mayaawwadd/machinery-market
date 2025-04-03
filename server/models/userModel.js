import mongoose from 'mongoose';

// Define the User schema
const userSchema = new mongoose.Schema(
  {
    // Username is required for all users
    username: {
      type: String,
      required: true,
      trim: true,
    },

    // Email must be unique, stored in lowercase, and required for login
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    // Password is required (should be hashed before saving)
    password: {
      type: String,
      required: true,
    },

    // Phone number is required as per FR-1.1
    phone: {
      type: String,
      required: true,
    },

    // Optional profile image (can be used in user listings and profiles)
    profileImage: {
      type: String,
      default: 'http://localhost:5000/public/images/default.png',
    },

    // Role defines system-level privileges: 'admin' or general 'user'
    // A 'user' can both buy and sell — selling/buying is a feature, not a role
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
  },
  {
    // Automatically include createdAt and updatedAt fields
    timestamps: true,
  }
);

// Compile the schema into a model and export it
const User = mongoose.model('User', userSchema);
export default User;
