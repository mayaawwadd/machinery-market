import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import asyncHandler from 'express-async-handler';

// @desc get all users
// @route get /users
// @access Private
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').lean(); //lean will exclude some methods from showing and provide json like data
  if (!users) {
    return res.status(400).json({ message: 'no users found' });
  }
  res.json(users);
});
/**
 * Controller to register a new user
 * Validates if user with the same email exists, then creates the user
 */
// @desc Create new user
// @route POST /users
// @access Private
export const registerUser = asyncHandler(async (req, res) => {
  // Use object destructuring to get the username, email and password out of the request body
  const { username, email, password, phone } = req.body;

  try {
    //checks if any of the fields are empty
    if (!username || !email || !password || !phone) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    // Check if a user with the given email already exists
    const userExists = await User.findOne({ email });
    //checks if somneone has the same user
    const duplicateUsername = await User.findOne({ username }).lean().exec();

    if (userExists) {
      return res.status(400).json({ message: 'email already exists' });
    }
    if (duplicateUsername) {
      return res.status(400).json({ message: 'User already taken' });
    }

    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const userObject = {
      username,
      email,
      password: hashedPassword,
      phone,
    };
    // Create a new user document
    const user = await User.create(userObject);

    if (user) {
      res.status(201).json({ message: `user ${username} has been created` });
    } else {
      res.status(400).json({ message: 'Invalid data received' });
    }

    // Respond with user details (excluding password)
  } catch (err) {
    console.error('❌ Register error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
// @desc update a user
// @route patch /users
// @access Private
export const updateUser = asyncHandler(async (req, res) => {
  const { _id, username, email, phone, password } = req.body;

  if (!_id || !username || !email || !phone) {
    return res
      .status(400)
      .json({ message: 'all fields are required except password' });
  }
  //check to see if user exists
  const user = await User.findById(_id).exec();
  if (!user) {
    return res.status(400).json({ message: 'no user found' });
  }
  //check for duplicate username
  const duplicateUsername = await User.findOne({ username }).lean().exec();

  if (duplicateUsername && duplicateUsername?._id.toString() !== _id) {
    return res.status(409).json({ message: 'Duplicate username' });
  }
  //updating user
  user.username = username;
  user.email = email;
  user.phone = phone;

  if (password) {
    //hash password
    user.password = await bcrypt.hash(password, 10);
  }
  await user.save();

  res.json({ message: `${username} updated` });
});
// @desc delete a user
// @route delete /users
// @access Private
export const deleteUser = asyncHandler(async (req, res) => {});

/**
 * Controller to log in a user
 * Validates email/password and returns basic user info on success
 */
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });

    // Simple password check (for demo only – use hashing in production)
    if (user && user.password === password) {
      res.status(200).json({
        _id: user._id,
        username: user.username,
        email: user.email,
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
