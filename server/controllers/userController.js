import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';

/**
 * @desc update a user
 * @route patch /users
 * @access Private
 *
 * This function retrieves all users from the database,
 * excluding their passwords, and returns them as JSON.
 */
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').lean(); // .lean() returns plain JS objects for better performance
  if (!users) {
    return res.status(400).json({ message: 'No users found' });
  }
  res.json(users);
});

/**
 * @desc update a user
 * @route patch /users
 * @access Private
 *
 * This function creates a new user after validating input,
 * checking for duplicate email or username, and hashing the password.
 */
export const registerUser = asyncHandler(async (req, res) => {
  // Use object destructuring to get the username, email and password out of the request body
  const { username, email, password, phone } = req.body;

  try {
    // Check if all required fields are provided
    if (!username || !email || !password || !phone) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    // Check if a user with the same email or username already exists
    const userExists = await User.findOne({ email });
    const duplicateUsername = await User.findOne({ username }).lean().exec();

    if (userExists) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    if (duplicateUsername) {
      return res.status(400).json({ message: 'User already taken' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    const userObject = {
      username,
      email,
      password: hashedPassword,
      phone,
    };

    // Create the user in the database
    const user = await User.create(userObject);

    if (user) {
      res.status(201).json({ message: `User ${username} has been created` });
    } else {
      res.status(400).json({ message: 'Invalid data received' });
    }
  } catch (err) {
    console.error('❌ Register error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @desc update a user
 * @route patch /users
 * @access Private
 *
 * This function updates an existing user’s details. It checks for
 * the user’s existence, ensures the username is not duplicated,
 * and hashes the password if it's being updated.
 */

export const updateUser = asyncHandler(async (req, res) => {
  const { _id, username, email, phone, password } = req.body;

  if (!_id || !username || !email || !phone) {
    return res
      .status(400)
      .json({ message: 'All fields are required except password' });
  }

  // Find the user by ID
  const user = await User.findById(_id).exec();
  if (!user) {
    return res.status(400).json({ message: 'no user found' });
  }

  // Check for duplicate username (excluding the current user's own username)
  const duplicateUsername = await User.findOne({ username }).lean().exec();

  if (duplicateUsername && duplicateUsername?._id.toString() !== _id) {
    return res.status(409).json({ message: 'Duplicate username' });
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
 * @desc delete a user
 * @route delete /users
 * @access Private
 *
 * This function is intended to delete a user. Currently, it is unimplemented.
 */
export const deleteUser = asyncHandler(async (req, res) => {
  const { _id } = req.body;
  //confirm data
  if (!_id) {
    res.status(400).json({ message: 'User Id is required ' });
  }
  const user = await User.findById(_id).exec();
  //check if user exists
  if (!user) {
    res.status(400).json({ message: 'User not found' });
  }
  await user.deleteOne();
  const reply = `Username ${user.username} with ID ${_id} deleted`;
  res.status(200).json(reply);
});

/**
 * @desc    Log in a user
 * @route   POST /users/login
 * @access  Public
 *
 * Authenticates user credentials and returns a JWT if valid.
 */
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
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
        token: generateToken(user.id),
        message: 'Login successful',
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
