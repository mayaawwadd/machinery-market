import express from 'express';
import {
  createAuction,
  getAllAuctions,
  getLiveAuctions,
  getAuctionById,
  placeBid,
  closeAuction,
  purchaseAuction,
} from '../controllers/auctionController.js';
import { protect } from '../middleware/authMiddleware.js';
import { selfOrAdmin } from '../middleware/selfOrAdmin.js';

const router = express.Router();

router.post('/', protect, createAuction);
router.get('/', getAllAuctions);
router.get('/getLiveAuctions', getLiveAuctions);
router.get('/:id', getAuctionById);
router.post('/:id/bid', protect, placeBid);
router.patch('/:id/closeAuction', protect, selfOrAdmin, closeAuction);
router.delete('/:id', protect, deleteAuction);
router.post('/:auctionId/purchaseAuction', protect, purchaseAuction);

export default router;
