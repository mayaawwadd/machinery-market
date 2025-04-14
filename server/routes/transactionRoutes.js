import express from 'express';
import { purchaseMachinery } from '../controllers/transactionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, purchaseMachinery);

export default router;
