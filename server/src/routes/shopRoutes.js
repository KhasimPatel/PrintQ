// src/routes/shopRoutes.js
import express from 'express';
import { protectShopOwner } from '../middleware/auth.js';
import {
  listShops,
  getShopById,
  registerShopOwner,
  loginShopOwner,
  updateShopStatus,
} from '../controllers/shopController.js';

const router = express.Router();

// --- Public ---
router.get('/', listShops); // powers the /student shop picker
router.get('/:id', getShopById);

// --- Shop owner auth ---
router.post('/owner/register', registerShopOwner);
router.post('/owner/login', loginShopOwner);

// --- Shop owner, protected ---
router.patch('/owner/status', protectShopOwner, updateShopStatus);

export default router;
