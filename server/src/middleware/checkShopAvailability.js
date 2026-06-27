// src/middleware/checkShopAvailability.js
//
// Thin pipeline wrapper: calls the service, attaches the result to req,
// and forwards any thrown error to the global error handler. All the
// actual business logic lives in services/shopAvailabilityService.js —
// this file's only job is wiring it into the Express request cycle.

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
