// src/models/Shop.js
//
// Represents one physical xerox shop. Small, slow-changing collection —
// seeded once with a handful of shops, read constantly by the student
// shop-picker on the /student page.

import mongoose from 'mongoose';
import { SHOP_STATUS, DEFAULT_MAX_QUEUE_COUNT } from './constants.js';

const shopSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    address: { type: String, required: true },

    status: {
      type: String,
      enum: SHOP_STATUS,
      default: 'CLOSED',
      required: true,
    },

    // Manually maintained counter (per product spec) rather than computed
    // live from Order.countDocuments(). Whatever code increments/decrements
    // this MUST do so atomically and exactly in step with order status
    // transitions, or this number will drift from reality over time.
    queueCount: { type: Number, default: 0, min: 0 },
    maxQueueCount: { type: Number, default: DEFAULT_MAX_QUEUE_COUNT },

    pricing: {
      bwSingle: { type: Number, required: true, default: 2 },
      bwDouble: { type: Number, required: true, default: 3 },
      colorSingle: { type: Number, required: true, default: 10 },
      colorDouble: { type: Number, required: true, default: 18 },
      // Flat per-sheet urgent add-on, matching the spec's example:
      // "Urgent = 8 x Rs.1 = Rs.8" (not a percentage surcharge).
      urgentSurchargePerSheet: { type: Number, required: true, default: 1 },
    },

    // Reserved for the future Shop Owner module. Unused for now — kept here
    // so adding shop-owner login later is additive, not a migration.
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ShopOwner',
      default: null,
    },
  },
  { timestamps: true }
);

const Shop = mongoose.model('Shop', shopSchema);
export default Shop;
