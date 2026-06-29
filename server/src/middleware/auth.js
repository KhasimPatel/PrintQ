// src/middleware/auth.js

import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import Shop from '../models/Shop.js';

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

    const shop = await Shop.findById(decoded.shopId).select('-password');

    if (!shop) {
      res.status(401);
      throw new Error('Shop not found.');
    }

    if (shop.approvalStatus !== 'APPROVED') {
      res.status(403);
      throw new Error('Shop is not approved.');
    }

    req.shop = shop;

    next();
  } catch (error) {
    res.status(401);
    throw new Error('Not authorized. Invalid or expired token.');
  }
});