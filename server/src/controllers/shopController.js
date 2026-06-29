// src/controllers/shopController.js
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Shop from '../models/Shop.js';
import { SHOP_STATUS } from '../models/constants.js';

function generateToken(shopId) {
  return jwt.sign({ shopId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

// Public: powers the student shop-picker on /student.
// export const listShops = asyncHandler(async (req, res) => {
//   const shops = await Shop.find().select('name address status queueCount maxQueueCount pricing');
//   res.json(shops);
// });
export const listShops = asyncHandler(async (req, res) => {
  const shops = await Shop.find({
    approvalStatus: 'APPROVED',
  }).select(
    'shopName address status queueCount maxQueueCount pricing'
  );
  res.json(shops);
});

// export const getShopById = asyncHandler(async (req, res) => {
//   const shop = await Shop.findById(req.params.id).select(
//     'name address status queueCount maxQueueCount pricing'
//   );
//   if (!shop) {
//     res.status(404);
//     throw new Error('Shop not found.');
//   }
//   res.json(shop);
// });
export const getShopById = asyncHandler(async (req, res) => {
  const shop = await Shop.findOne({
    _id: req.params.id,
    approvalStatus: 'APPROVED',
  }).select('shopName address status queueCount maxQueueCount pricing');

  if (!shop) {
    res.status(404);
    throw new Error('Shop not found.');
  }

  res.json(shop);
});

// Dev/setup convenience — in practice you'd seed shop owners, not expose
// open registration, but this keeps local testing simple for now.
// export const registerShopOwner = asyncHandler(async (req, res) => {
//   const { email, password, shopId } = req.body;

//   const shop = await Shop.findById(shopId);
//   if (!shop) {
//     res.status(404);
//     throw new Error('Shop not found.');
//   }

//   const exists = await ShopOwner.findOne({ email });
//   if (exists) {
//     res.status(409);
//     throw new Error('An owner account with this email already exists.');
//   }

//   const passwordHash = await bcrypt.hash(password, 10);
//   const owner = await ShopOwner.create({ email, passwordHash, shop: shop._id });

//   res.status(201).json({
//     owner: { id: owner._id, email: owner.email, shop: owner.shop },
//     token: generateToken(owner._id),
//   });
// });

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
    res.status(409);
    throw new Error('Email is already registered.');
  }

  // Check if mobile already exists
  const existingMobile = await Shop.findOne({ mobile });
  if (existingMobile) {
    res.status(409);
    throw new Error('Mobile number is already registered.');
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

  res.status(201).json({
    success: true,
    message:
      'Registration submitted successfully. Please wait for admin approval.',
    shopId: shop._id,
  });
});

// export const loginShopOwner = asyncHandler(async (req, res) => {
//   const { email, password } = req.body;
//   const owner = await ShopOwner.findOne({ email });

//   if (!owner || !(await bcrypt.compare(password, owner.passwordHash))) {
//     res.status(401);
//     throw new Error('Invalid email or password.');
//   }

//   res.json({
//     owner: { id: owner._id, email: owner.email, shop: owner.shop },
//     token: generateToken(owner._id),
//   });
// });

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
      shopName: shop.name, // change if renamed
      email: shop.email,
      approvalStatus: shop.approvalStatus,
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
