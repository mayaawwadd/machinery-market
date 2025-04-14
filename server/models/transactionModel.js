import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    machinery: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Machinery',
      required: true,
    },
    amountCents: {
      type: Number,
      required: true,
      min: [1, 'Amount must be at least 1 cent'],
    },
    currency: {
      type: String,
      default: 'JOD',
    },
    paymentMethod: {
      type: String,
      enum: ['paypal', 'cash', 'bankTransfer', 'other'],
      default: 'paypal',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: {
      type: Date,
    },

    //specific to PayPal
    paypalTransactionId: {
      type: String,
      default: null,
    },
    payerEmail: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;
