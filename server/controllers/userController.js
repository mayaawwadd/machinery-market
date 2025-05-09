import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';

/**
 * @desc Register a new user and return token
 * @route POST /api/users/register
 * @access Public
 *
 * This function creates a new user after validating input,
 * checking for duplicate email or username, and hashing the password.
 */
export const registerUser = asyncHandler(async (req, res) => {
  // Use object destructuring to get the username, email and password out of the request body
  const { username, email, password, phone } = req.body;

  // Check if all required fields are provided
  if (!username || !email || !password || !phone) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Check if a user with the same email or username already exists
  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  }).lean();

  if (existingUser) {
    if (existingUser.email === email) {
      return res.status(409).json({ message: 'Email already exists' });
    }
    if (existingUser.username === username) {
      return res.status(409).json({ message: 'Username already taken' });
    }
  }

  // Hash the password before saving
  const hashedPassword = await bcrypt.hash(password, 10);

  const userObject = {
    username,
    email,
    password: hashedPassword,
    phone,
    profileImage: req.body.profileImage,
  };

  // Create the user in the database
  const user = await User.create(userObject);

  if (user) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
      token: generateToken(user._id),
      message: `User ${username} has been created`,
    });
  } else {
    res.status(400).json({ message: 'Invalid data received' });
  }
});

/**
 * @desc    Log in a user
 * @route   POST /users/login
 * @access  Public
 *
 * Authenticates user credentials and returns a JWT if valid.
 */
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await User.findOne({ email });

  // Simple password check (for demo only – use hashing in production)
  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
      token: generateToken(user._id),
      message: 'Login successful',
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
});

/**
 * @desc    Get logged-in user's profile
 * @route   GET /api/users/profile
 * @access  Private
 */
export const getUserProfile = asyncHandler(async (req, res) => {
  // req.user is set by protect middleware
  const user = await User.findById(req.user._id).select('-password');

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.status(200).json(user);
});

/**
 * @desc    Update a user
 * @route   PATCH /users
 * @access  Private
 *
 * This function updates an existing user’s details. It checks for
 * the user’s existence, ensures the username is not duplicated,
 * and hashes the password if it's being updated.
 */
export const updateUser = asyncHandler(async (req, res) => {
  const { username, email, phone, password } = req.body;

  // Get the logged-in user's id from the JWT to prevent users from updating other people's accounts
  const _id = req.user._id;

  if (!username || !email || !phone) {
    return res
      .status(400)
      .json({ message: 'All fields are required except password' });
  }

  // Find the user by ID
  const user = await User.findById(_id).exec();

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Check for duplicate username (excluding the current user's own username)
  const duplicateUsername = await User.findOne({ username }).lean().exec();

  if (
    duplicateUsername &&
    duplicateUsername?._id.toString() !== _id.toString()
  ) {
    return res.status(409).json({ message: 'Username already taken' });
  }

  // Update user fields
  user.username = username;
  user.email = email;
  user.phone = phone;

  if (password) {
    // Hash password
    user.password = await bcrypt.hash(password, 10);
  }

  await user.save();

  res.json({ message: `${username} updated` });
});

/**
 * @desc    Delete a user
 * @route   DELETE /users
 * @access  Private
 */
export const deleteUser = asyncHandler(async (req, res) => {
  // Get the ID of the user to be deleted from the request parameters
  const { _id: targetUserId } = req.params;

  // Find the user to delete by ID (validated in middleware)
  const userToDelete = await User.findById(targetUserId);

  // Check if the user the request is trying to delete exists
  if (!userToDelete) {
    return res.status(404).json({ message: 'User not found' });
  }

  // All checks passed - delete the user
  await userToDelete.deleteOne();

  res.status(200).json({
    message: `User ${userToDelete.username} deleted successfully`,
  });
});

/**
 * @desc    Retrieve all users
 * @route   GET /users
 * @access  Private
 *
 * This function retrieves all users from the database,
 * excluding their passwords, and returns them as JSON.
 */
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').lean(); // .lean() returns plain JS objects for better performance
  if (!users) {
    return res.status(404).json({ message: 'No users found' });
  }
  res.json(users);
});

/**
 * @desc    Upload profile image
 * @route   POST /api/users/upload-profile-image
 * @access  Private
 */
export const uploadProfileImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image file provided' });
  }

  const imagePath = `${req.protocol}://${req.get(
    'host'
  )}/public/uploads/profile/${req.file.filename}`;

  const user = await User.findById(req.user._id);
  user.profileImage = imagePath;
  await user.save();

  res.status(200).json({
    message: 'Profile image uploaded successfully',
    profileImage: imagePath,
  });
});
