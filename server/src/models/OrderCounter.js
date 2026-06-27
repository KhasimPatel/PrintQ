// src/models/OrderCounter.js
//
// Purpose: generate sequential, human-readable order IDs like "ORD-2026-0001"
// without a race condition. One document per year — when the year rolls
// over, numbering resets automatically because it's a new "year" document,
// no manual reset step needed.
//
// This collection is never read/written directly the normal way — it's only
// ever touched through an atomic findOneAndUpdate with $inc (see usage note
// below). That atomicity is what guarantees two simultaneous checkouts can
// never be assigned the same orderId.

import mongoose from 'mongoose';

const orderCounterSchema = new mongoose.Schema({
  year: { type: String, required: true, unique: true }, // e.g. "2026"
  lastNumber: { type: Number, required: true, default: 0 },
});

const OrderCounter = mongoose.model('OrderCounter', orderCounterSchema);
export default OrderCounter;

// --- USAGE PATTERN (implemented for real in utils/generateOrderId.js) ---
//
// const year = new Date().getFullYear().toString();
// const counter = await OrderCounter.findOneAndUpdate(
//   { year },
//   { $inc: { lastNumber: 1 } },
//   { new: true, upsert: true } // upsert: create the year doc on first use
// );
// const orderId = `ORD-${year}-${String(counter.lastNumber).padStart(4, '0')}`;
//
// findOneAndUpdate + $inc is atomic in MongoDB: even if two requests hit this
// in the same millisecond, each gets a distinct, correctly incremented value.
