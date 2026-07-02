// src/routes/shopRoutes.js
import express from 'express';
import { protectShopOwner } from '../middleware/auth.js';
import {
  listShops,
  getShopById,
  registerShopOwner,
  loginShopOwner,
  updateShopStatus,
  updateShopTimings,
  forgotPassword,
  verifyOtp,
  resetPassword,
  changePassword,
} from '../controllers/shopController.js';

const router = express.Router();

// --- Public ---
router.get('/', listShops); // powers the /student shop picker
router.get('/:id', getShopById);

// --- Shop owner auth ---
router.post('/register', registerShopOwner);
router.post('/login', loginShopOwner);

// --- Forgot Password (public) ---
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);

// --- Shop owner, protected ---
router.patch('/status', protectShopOwner, updateShopStatus);
router.patch('/timings', protectShopOwner, updateShopTimings);   // new route for updating shop timings
router.patch('/change-password', protectShopOwner, changePassword);

export default router;
