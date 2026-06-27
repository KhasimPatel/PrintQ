// src/middleware/auth.js
//
// Students don't have accounts (per spec — name/mobile/PRN per order only),
// so only shop owners authenticate. This protects shop-owner-only routes
// (accept/reject/printing/ready/complete an order).

import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import ShopOwner from '../models/ShopOwner.js';

export const protectShopOwner = asyncHandler(async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized. No token provided.');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const owner = await ShopOwner.findById(decoded.ownerId).select('-passwordHash');
    if (!owner) {
      res.status(401);
      throw new Error('Not authorized. Owner not found.');
    }
    req.shopOwner = owner; // includes owner.shop, the ObjectId of their shop
    next();
  } catch {
    res.status(401);
    throw new Error('Not authorized. Invalid or expired token.');
  }
});
