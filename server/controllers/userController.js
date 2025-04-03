import User from '../models/userModel.js';

/**
 * Controller to register a new user
 * Validates if user with the same email exists, then creates the user
 */
export const registerUser = async (req, res) => {
  // Use object destructuring to get the username, email and password out of the request body
  const { username, email, password } = req.body;

  try {
    // Check if a user with the given email already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user document
    const user = await User.create({ username, email, password });

    // Respond with user details (excluding password)
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  } catch (err) {
    console.error('❌ Register error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

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
