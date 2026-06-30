// src/middleware/checkShopAvailability.js

import asyncHandler from 'express-async-handler';
import { assertShopAcceptingOrders } from '../services/shopAvailabilityService.js';

export const checkShopAvailability = asyncHandler(async (req, res, next) => {
  const { shopId } = req.body;

  if (!shopId) {
    res.status(400);
    throw new Error('shopId is required.');
  }

  const shop = await assertShopAcceptingOrders(shopId);
  req.shop = shop; // downstream controller doesn't need to re-fetch it
  next();
});
