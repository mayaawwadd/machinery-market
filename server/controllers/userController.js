const User = require('../models/userModel');

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // look if email exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const user = await User.create({ username, email, password }); //create new user with these credentials

    res.status(201).json({
      // 201 indicates a success operation and sends it as JSON
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  } catch (err) {
    // 500 server error and handle it
    console.error('register error :', err);
    res.status(500).json({ message: 'server error' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user && user.password == password) {
      res.status(200).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        message: 'Login Successful',
      });
    } else {
      res.status(401).json({ message: 'invalid email or password' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'server error' });
  }
};

module.exports = { registerUser, loginUser };
