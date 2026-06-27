// src/utils/generateOrderId.js
//
// Turns OrderCounter's atomic increment into a ready-to-use function.
// Call this once, at the moment you're about to create an Order document.

import OrderCounter from '../models/OrderCounter.js';

/**
 * Atomically generates the next order ID for the current year, e.g. "ORD-2026-0001".
 * Safe under concurrency: MongoDB guarantees findOneAndUpdate + $inc is one
 * indivisible operation, so two simultaneous checkouts can never collide.
 *
 * @returns {Promise<string>} e.g. "ORD-2026-0001"
 */
export async function generateOrderId() {
  const year = new Date().getFullYear().toString();

  const counter = await OrderCounter.findOneAndUpdate(
    { year },
    { $inc: { lastNumber: 1 } },
    { new: true, upsert: true } // creates the year's counter doc on first use
  );

  const padded = String(counter.lastNumber).padStart(4, '0');
  return `ORD-${year}-${padded}`;
}
