import express from 'express';
import {
  createAuction,
  getAllAuctions,
  getLiveAuctions,
  getAuctionById,
  placeBid,
} from '../controllers/auctionController.js';

import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createAuction);
router.get('/', getAllAuctions);
router.get('/getLiveAuctions', getLiveAuctions);
router.get('/:id', getAuctionById);
router.post('/:id/placeBid', protect, placeBid);

export default router;
