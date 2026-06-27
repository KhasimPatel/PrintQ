// src/controllers/shopController.js
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Shop from '../models/Shop.js';
import ShopOwner from '../models/ShopOwner.js';
import { SHOP_STATUS } from '../models/constants.js';

function generateToken(ownerId) {
  return jwt.sign({ ownerId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

// Public: powers the student shop-picker on /student.
export const listShops = asyncHandler(async (req, res) => {
  const shops = await Shop.find().select('name address status queueCount maxQueueCount pricing');
  res.json(shops);
});

export const getShopById = asyncHandler(async (req, res) => {
  const shop = await Shop.findById(req.params.id).select(
    'name address status queueCount maxQueueCount pricing'
  );
  if (!shop) {
    res.status(404);
    throw new Error('Shop not found.');
  }
  res.json(shop);
});

// Dev/setup convenience — in practice you'd seed shop owners, not expose
// open registration, but this keeps local testing simple for now.
export const registerShopOwner = asyncHandler(async (req, res) => {
  const { email, password, shopId } = req.body;

  const shop = await Shop.findById(shopId);
  if (!shop) {
    res.status(404);
    throw new Error('Shop not found.');
  }

  const exists = await ShopOwner.findOne({ email });
  if (exists) {
    res.status(409);
    throw new Error('An owner account with this email already exists.');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const owner = await ShopOwner.create({ email, passwordHash, shop: shop._id });

  res.status(201).json({
    owner: { id: owner._id, email: owner.email, shop: owner.shop },
    token: generateToken(owner._id),
  });
});

export const loginShopOwner = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const owner = await ShopOwner.findOne({ email });

  if (!owner || !(await bcrypt.compare(password, owner.passwordHash))) {
    res.status(401);
    throw new Error('Invalid email or password.');
  }

  res.json({
    owner: { id: owner._id, email: owner.email, shop: owner.shop },
    token: generateToken(owner._id),
  });
});

// Shop owner updates their own shop's availability.
export const updateShopStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!SHOP_STATUS.includes(status)) {
    res.status(400);
    throw new Error(`Invalid status. Must be one of: ${SHOP_STATUS.join(', ')}`);
  }

  const shop = await Shop.findByIdAndUpdate(req.shopOwner.shop, { status }, { new: true });
  res.json({ message: `Shop status updated to ${status}.`, shop });
});
