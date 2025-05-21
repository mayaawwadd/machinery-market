// controllers/adminController.js
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Machinery from '../models/machineryModel.js';
import Transaction from '../models/transactionModel.js';

export const getAdminStats = asyncHandler(async (req, res) => {
    const totalUsers = await User.countDocuments();
    const totalListings = await Machinery.countDocuments({ isAuction: false });
    const totalAuctions = await Machinery.countDocuments({ isAuction: true });
    const activeListings = totalListings + totalAuctions;
    const totalTransactions = await Transaction.countDocuments();

    res.json({
        totalUsers,
        activeListings,
        totalTransactions,
    });
});
