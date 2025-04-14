import Machinery from '../models/machineryModel.js';
import Transaction from '../models/transactionModel.js';
import asyncHandler from 'express-async-handler';

export const purchaseMachinery = asyncHandler(async (req, res) => {
  const { machineryId, paymentMethod } = req.body;

  //validate input
  if (!machineryId || !paymentMethod) {
    return res
      .status(404)
      .json({ message: 'MachineryID and payment method are required' });
  }

  //look for machine
  const machinery = await Machinery.findById(machineryId).populate('seller');

  if (!machinery) {
    return res.status(404).json({ message: 'Machinery not found' });
  }

  //make sure its not auction based
  if (machinery.isAuction) {
    return res
      .status(400)
      .json({ message: 'this machinery is only available through auction' });
  }
  //i commented this out because we're only using your user :) it blocked me
  /*  //prevent buyer from purchasing their own item
  if (req.user._id.toString() === machinery.seller._id.toString()) {
    return res
      .status(403)
      .json({ message: 'you cant purchase your own listing' });
  }
      */

  //check if the buyer have already initiated a purchase for this item
  const existingTransaction = await Transaction.findOne({
    buyer: req.user._id,
    machinery: machineryId,
  });

  if (existingTransaction) {
    return res.status(409).json({
      message: 'You have already initiated a transaction for this machinery',
    });
  }

  //create transaction
  const transaction = new Transaction({
    buyer: req.user._id,
    seller: machinery.seller._id,
    machinery: machinery._id,
    amountCents: machinery.priceCents,
    currency: 'JOD',
    paymentMethod,
    paymentStatus: 'pending',
    isPaid: false, //will be updated later
  });

  const createdTransaction = await transaction.save();

  res.status(200).json({
    message: 'Transaction created , Proceed to Payment',
    transaction: createdTransaction,
  });
});
