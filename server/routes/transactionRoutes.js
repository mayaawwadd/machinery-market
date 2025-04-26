import express from 'express';
import {
  purchaseMachinery,
  updateTransactionStatus,
  getUserTransactions,
  getAllTransactions,
  createOrderTest,
  capturePaymentTest,
} from '../controllers/transactionController.js';
import { protect } from '../middleware/authMiddleware.js';
import { selfOrAdmin } from '../middleware/selfOrAdmin.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.post('/', protect, purchaseMachinery);
router.patch('/:id/status', protect, updateTransactionStatus);
router.get('/user/:userId', getUserTransactions);
router.get('/', protect, adminOnly, getAllTransactions);

// router.post('/paypal/createOrder', protect, createPayPalOrder);
// router.post('/paypal/capture-order', protect, capturePayPalOrder);

router.post('/paypal/createOrderTest', createOrderTest);
router.get('/paypal/capturePaymentTest/:paymentId', capturePaymentTest);

export default router;
