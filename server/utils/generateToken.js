// server/utils/generateToken.js
import jwt from 'jsonwebtoken';

/**
 * Generates a JWT token from a user ID.
 * @param {string} id - MongoDB user ID
 * @returns {string} - Signed JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

export default generateToken;
