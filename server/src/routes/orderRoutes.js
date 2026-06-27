// src/routes/orderRoutes.js
import express from 'express';
import { upload } from '../middleware/upload.js';
import { checkShopAvailability } from '../middleware/checkShopAvailability.js';
import { protectShopOwner } from '../middleware/auth.js';
import {
  initiateOrder,
  verifyAndCreateOrder,
  getOrderStatus,
  getShopOrders,
  acceptOrder,
  markPrinting,
  markReady,
  markCompleted,
  rejectOrder,
} from '../controllers/orderController.js';

const router = express.Router();

// --- Student-facing ---
router.post('/initiate', upload.array('files', 3), checkShopAvailability, initiateOrder);
router.post('/verify-payment', verifyAndCreateOrder);
router.get('/track/:orderId', getOrderStatus); // polling target, e.g. ORD-2026-0001

// --- Shop-owner-facing (protected) ---
router.get('/shop/mine', protectShopOwner, getShopOrders);
router.patch('/:id/accept', protectShopOwner, acceptOrder);
router.patch('/:id/printing', protectShopOwner, markPrinting);
router.patch('/:id/ready', protectShopOwner, markReady);
router.patch('/:id/complete', protectShopOwner, markCompleted);
router.patch('/:id/reject', protectShopOwner, rejectOrder);

export default router;
