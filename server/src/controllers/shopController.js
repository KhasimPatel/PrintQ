// src/controllers/shopController.js
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Shop from '../models/Shop.js';
import { SHOP_STATUS } from '../models/constants.js';
// import { sendRegistrationReceivedEmail } from '../services/emailService.js';
import { 
  sendRegistrationReceivedEmail,
  sendForgotPasswordOtpEmail,
  sendPasswordChangedEmail,
} from '../services/emailService.js';

function generateToken(shopId) {
  return jwt.sign({ shopId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

export const listShops = asyncHandler(async (req, res) => {
  const shops = await Shop.find({
    approvalStatus: 'APPROVED',
  }).select(
    'shopName address status queueCount maxQueueCount pricing openingTime closingTime'
  );
  res.json(shops);
});


export const getShopById = asyncHandler(async (req, res) => {
  const shop = await Shop.findOne({
    _id: req.params.id,
    approvalStatus: 'APPROVED',
  }).select('shopName address status queueCount maxQueueCount pricing openingTime closingTime');

  if (!shop) {
    res.status(404);
    throw new Error('Shop not found.');
  }

  res.json(shop);
});

export const registerShopOwner = asyncHandler(async (req, res) => {
  const {
    ownerName,
    shopName,
    email,
    mobile,
    address,
    password,
  } = req.body;

  // Check if email already exists
  const existingEmail = await Shop.findOne({ email });
  if (existingEmail) {
    if (existingEmail.approvalStatus === 'REJECTED') {
      // Allow re-registration — delete old rejected entry first
      await Shop.deleteOne({ email });
    } else {
      res.status(409);
      throw new Error('Email is already registered. Please sign in.');
    }
  }

  // Check if mobile already exists
  const existingMobile = await Shop.findOne({ mobile });
  if (existingMobile) {
    if (existingMobile.approvalStatus === 'REJECTED') {
      await Shop.deleteOne({ mobile });
    } else {
      res.status(409);
      throw new Error('Mobile number is already registered.');
    }
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new shop
  const shop = await Shop.create({
    ownerName,
    shopName,
    email,
    mobile,
    address,
    password: hashedPassword,
    approvalStatus: 'PENDING',
  });

  // Fire-and-forget — don't block the response on email delivery
  sendRegistrationReceivedEmail(shop);

  res.status(201).json({
    success: true,
    message:
      'Registration submitted successfully. Please wait for admin approval.',
    shopId: shop._id,
  });
});

export const loginShopOwner = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const shop = await Shop.findOne({ email });

  if (!shop) {
    res.status(401);
    throw new Error('Invalid email or password.');
  }

  const isMatch = await bcrypt.compare(password, shop.password);

  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid email or password.');
  }

  if (shop.approvalStatus === 'PENDING') {
    res.status(403);
    throw new Error(
      'Your registration is under admin verification.'
    );
  }

  if (shop.approvalStatus === 'REJECTED') {
    res.status(403);
    throw new Error(
      'Your registration was rejected. Please contact the administrator.'
    );
  }

  res.json({
    success: true,
    token: generateToken(shop._id),
    shop: {
      id: shop._id,
      ownerName: shop.ownerName,
      shopName: shop.shopName,
      email: shop.email,
      approvalStatus: shop.approvalStatus,
      status: shop.status,
      queueCount: shop.queueCount,
      maxQueueCount: shop.maxQueueCount,
      openingTime: shop.openingTime,
      closingTime: shop.closingTime,
    },
  });
});

// Shop owner updates their own shop's availability.
export const updateShopStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!SHOP_STATUS.includes(status)) {
    res.status(400);
    throw new Error(`Invalid status. Must be one of: ${SHOP_STATUS.join(', ')}`);
  }

  const shop = await Shop.findByIdAndUpdate(req.shop._id, { status }, { new: true });
  res.json({ message: `Shop status updated to ${status}.`, shop });
});

// Shop owner updates their own shop's opening/closing time, anytime (daily).
export const updateShopTimings = asyncHandler(async (req, res) => {
  const { openingTime, closingTime } = req.body;

  if (!openingTime || !closingTime) {
    res.status(400);
    throw new Error('Both openingTime and closingTime are required.');
  }

  const shop = await Shop.findByIdAndUpdate(
    req.shop._id,
    { openingTime, closingTime },
    { new: true }
  );

  res.json({ message: 'Shop timings updated.', shop });
});

// Generate a random 6-digit OTP
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Step 1: Send OTP to registered email
 */
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const shop = await Shop.findOne({ email });
  if (!shop) {
    res.status(404);
    throw new Error('No account found with this email.');
  }

  if (shop.approvalStatus !== 'APPROVED') {
    res.status(403);
    throw new Error('Your shop is not approved yet.');
  }

  const otp = generateOtp();
  const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  shop.resetOtp = otp;
  shop.resetOtpExpiry = expiry;
  await shop.save();

  sendForgotPasswordOtpEmail(shop, otp); // fire-and-forget

  res.json({
    success: true,
    message: 'OTP sent to your registered email.',
  });
});

/**
 * Step 2: Verify OTP
 */
export const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const shop = await Shop.findOne({ email });
  if (!shop) {
    res.status(404);
    throw new Error('No account found with this email.');
  }

  if (!shop.resetOtp || !shop.resetOtpExpiry) {
    res.status(400);
    throw new Error('No OTP requested. Please request a new OTP.');
  }

  if (new Date() > shop.resetOtpExpiry) {
    shop.resetOtp = null;
    shop.resetOtpExpiry = null;
    await shop.save();
    res.status(400);
    throw new Error('OTP has expired. Please request a new one.');
  }

  if (shop.resetOtp !== otp) {
    res.status(400);
    throw new Error('Invalid OTP. Please try again.');
  }

  // OTP valid — clear it so it can't be reused
  shop.resetOtp = null;
  shop.resetOtpExpiry = null;
  await shop.save();

  res.json({
    success: true,
    message: 'OTP verified successfully.',
  });
});

/**
 * Step 3: Reset Password
 */
export const resetPassword = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!password || password.length < 8) {
    res.status(400);
    throw new Error('Password must be at least 8 characters.');
  }

  const shop = await Shop.findOne({ email });
  if (!shop) {
    res.status(404);
    throw new Error('No account found with this email.');
  }

  shop.password = await bcrypt.hash(password, 10);
  await shop.save();

  sendPasswordChangedEmail(shop); // fire-and-forget

  res.json({
    success: true,
    message: 'Password reset successfully.',
  });
});