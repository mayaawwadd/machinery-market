import Machinery from '../models/machineryModel.js';
import Transaction from '../models/transactionModel.js';
import asyncHandler from 'express-async-handler';
import { payPalClient } from '../config/paypal.js';
import checkoutNodeJssdk from '@paypal/checkout-server-sdk';
import got from 'got';

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
    currency: 'USD',
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

export const updateTransactionStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  //check if the status given are valid
  const validStates = ['pending', 'completed', 'failed', 'cancelled'];
  if (!validStates.includes(status)) {
    return res.status(400).json({ message: 'invalid transaction' });
  }

  const transaction = await Transaction.findById(id);
  if (!transaction) {
    return res.status(404).json({ message: 'Transaction not found' });
  }

  transaction.paymentStatus = status;
  await transaction.save();

  res.status(200).json({
    message: 'Transaction status updated successfully',
    transaction,
  });
});

export const getUserTransactions = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const transaction = await Transaction.find({ buyer: userId })
    .populate('machinery', 'title price')
    .sort({ createdAt: -1 });

  if (!transaction.length) {
    return res.status(404).json({ message: 'Transaction not found' });
  }

  res.status(200).json(transaction);
});

export const getAllTransactions = asyncHandler(async (req, res) => {
  const transaction = await Transaction.find();

  if (!transaction) {
    return res.status(400).json({ message: 'no transactions available' });
  }
  res.status(200).json(transaction);
});
// get the paypal access token
export const getAccessToken = async () => {
  try {
    const response = await got.post(
      `${process.env.PAYPAL_BASEURL}/v1/oauth2/token`,
      {
        form: {
          grant_type: 'client_credentials',
        },
        username: process.env.PAYPAL_CLIENT_ID,
        password: process.env.PAYPAL_CLIENT_SECRET,
      }
    );
    console.log(response.body);
    const data = JSON.parse(response.body);
    const newAccessToken = data.access_token;
    return newAccessToken;
  } catch (err) {
    throw new Error(err);
  }
};

export const createOrderTest = asyncHandler(async (req, res) => {
  try {
    const { transactionId } = req.body;
    if (!transactionId) {
      return res.status(400).json({ message: 'Transaction ID is required' });
    }

    const transaction = await Transaction.findById(transactionId)
      .populate('machinery', 'title equipmentDetails')
      .lean();
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction Not found' });
    }

    // derive unit price, etc.
    const unitValue = (transaction.amountCents / 100).toFixed(2);
    const currencyCode = 'USD';
    const name = transaction.machinery.title;
    const description = transaction.machinery.equipmentDetails.substring(
      0,
      100
    );

    const accessToken = await getAccessToken();
    const response = await got.post(
      `${process.env.PAYPAL_BASEURL}/v2/checkout/orders`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        json: {
          intent: 'CAPTURE',

          purchase_units: [
            {
              reference_id: transactionId,
              items: [
                {
                  name,
                  description,
                  quantity: '1',
                  unit_amount: {
                    currency_code: currencyCode,
                    value: unitValue,
                  },
                },
              ],
              amount: {
                currency_code: currencyCode,
                value: unitValue,
                breakdown: {
                  item_total: {
                    currency_code: currencyCode,
                    value: unitValue,
                  },
                },
              },
            },
          ],

          // ← moved out of `payment_source` and renamed:
          application_context: {
            brand_name: 'machineryMarket',
            shipping_preference: 'NO_SHIPPING',
            user_action: 'PAY_NOW',
            return_url: `${process.env.PAYPAL_REDIRECT_BASE_URL}/complete-payment`,
            cancel_url: `${process.env.PAYPAL_REDIRECT_BASE_URL}/cancel-payment`,
            payment_method_preference: 'IMMEDIATE_PAYMENT_REQUIRED',
            payment_method_selected: 'PAYPAL',
            locale: 'en-US',
          },

          // you can leave this empty if you want PayPal's default:
          payment_source: { paypal: {} },
        },
        responseType: 'json',
      }
    );

    console.log(response.body);
    const orderId = response.body.id;

    // save it back on your transaction
    await Transaction.findByIdAndUpdate(transactionId, {
      paypalOrderId: orderId,
    });

    return res.status(200).json({ orderId });
  } catch (err) {
    console.error('PayPal create-order error:', err.response?.body || err);
    return res.status(502).json({
      error: 'PayPal rejected the order',
      details: err.response?.body,
    });
  }
});

export const capturePaymentTest = asyncHandler(async (req, res) => {
  try {
    const accessToken = await getAccessToken();

    const { transactionId, paymentId } = req.params;

    const response = await got.post(
      `${process.env.PAYPAL_BASEURL}/v2/checkout/orders/${paymentId}/capture`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        json: {},
        responseType: 'json',
      }
    );

    const capture = response.body;
    await Transaction.findByIdAndUpdate(transactionId, {
      paymentStatus: 'completed',
      isPaid: true,
      paidAt: Date.now(),
      paypalCaptureId: capture.purchase_units[0].payments.captures[0].id,
    });

    return res.status(200).json({
      message: 'payment captured successfully',
      capture,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'server error',
      details: err.response?.body || err.message,
    });
  }
});
