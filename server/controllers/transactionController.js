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

/*export const createPayPalOrder = asyncHandler(async (req, res) => {
  const { transactionId } = req.body;

  const transaction = await Transaction.findById(transactionId).populate(
    'machinery',
    'price'
  );
  if (!transaction) {
    return res.status(404).json({ message: 'Transaction Not found' });
  }

  const value = (transaction.amountCents / 100).toFixed(2);

  //build the paypal order
  const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
  request.prefer('return=representation');
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [
      {
        reference_id: transactionId,
        amount: {
          currency_code: transaction.currency,
          value,
        },
      },
    ],
  });
  const order = await payPalClient.execute(request);
  res.status(200).json({
    orderId: order.result.id,
    transactionId: transaction._id,
  });
});

export const capturePayPalOrder = asyncHandler(async (req, res) => {
  const { orderId, transactionId } = req.body;
  const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(orderId);
  request.requestBody({});

  const capture = await payPalClient.execute(request);
  if (capture.statusCode !== 200) {
    return res.status(400).json({ message: 'Capture failed' });
  }

  await Transaction.findByIdAndUpdate(transactionId, {
    status: 'completed',
    isPaid: true,
    paidAt: Date.now(),
    paypalCaptureId: capture.result.purchase_units[0].payments.captures[0].id,
  });

  res.status(200).json({ message: 'Payment Captured', capture });
});
*/
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
              items: [
                {
                  name: 'test1',
                  description: 'test1234',
                  quantity: '1',
                  unit_amount: {
                    currency_code: 'USD',
                    value: '50.00',
                  },
                },
              ],
              amount: {
                currency_code: 'USD',
                value: '50.00',
                breakdown: {
                  item_total: {
                    currency_code: 'USD',
                    value: '50.00',
                  },
                },
              },
            },
          ],
          payment_source: {
            paypal: {
              experience_context: {
                payment_method_preference: 'IMMEDIATE_PAYMENT_REQUIRED',
                payment_method_selected: 'PAYPAL',
                brand_name: 'machineryMarket',
                shipping_preference: 'NO_SHIPPING',
                locale: 'en-US',
                user_action: 'PAY_NOW',
                return_url: `${process.env.PAYPAL_REDIRECT_BASE_URL}/complete-payment`,
                cancel_url: `${process.env.PAYPAL_REDIRECT_BASE_URL}/cancel-payment`,
              },
            },
          },
        },
        responseType: 'json',
      }
    );
    console.log(response.body);
    const orderId = response.body?.id;
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

    const { paymentId } = req.params;

    const response = await got.post(
      `${process.env.PAYPAL_BASEURL}/v2/checkout/orders/${paymentId}/capture`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        responseType: 'json',
      }
    );

    const paymentData = response.body;

    if (paymentData.status !== 'COMPLETED') {
      return res.status(400).json({
        error: 'paypal payment incomplete or failed',
      });
    }
    return res.status(200).json({
      message: 'success',
      user: {
        email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'server error' });
  }
});
