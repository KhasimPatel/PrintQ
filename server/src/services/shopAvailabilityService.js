// src/services/shopAvailabilityService.js
//
// Business rule: only a shop with status OPEN and queueCount below its
// maxQueueCount can accept a new order. Centralized here so the rule is
// checked exactly the same way everywhere it matters (middleware today,
// possibly a future "can I order here" preview endpoint tomorrow).

import Shop from '../models/Shop.js';

/**
 * @param {string} shopId
 * @returns {Promise<Shop>} the shop document, if it can accept orders
 * @throws {Error} with .statusCode set, if the shop can't accept orders right now
 */
export async function assertShopAcceptingOrders(shopId) {
  const shop = await Shop.findById(shopId);

  if (!shop) {
    const err = new Error('Shop not found.');
    err.statusCode = 404;
    throw err;
  }

  if (shop.status !== 'OPEN') {
    const err = new Error(
      `This shop is currently ${shop.status.toLowerCase()} and is not accepting new orders.`
    );
    err.statusCode = 409;
    throw err;
  }

  if (shop.queueCount >= shop.maxQueueCount) {
    const err = new Error(
      'This shop has too many active orders right now. Please try again shortly or choose another shop.'
    );
    err.statusCode = 409;
    throw err;
  }

  return shop;
}
