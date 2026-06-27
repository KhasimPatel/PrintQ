// src/models/Order.js
//
// The core transactional record — one document per print job a student
// submits. Created only after payment succeeds (per the product spec),
// then updated in place as it moves through status -> status.

import mongoose from 'mongoose';
import {
  ORDER_STATUS,
  PRINT_TYPE,
  PRINT_MODE,
  MAX_FILES_PER_ORDER,
  MAX_PAGES_PER_ORDER,
  MAX_COPIES_PER_ORDER,
} from './constants.js';

const fileSchema = new mongoose.Schema(
  {
    fileName: { type: String, required: true },
    fileSize: { type: Number, required: true }, // bytes
    fileUrl: { type: String, required: true },
    pageCount: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    // Human-readable ID, e.g. "ORD-2026-0001". Generated once at creation
    // via OrderCounter's atomic increment (see utils/generateOrderId.js).
    // Unique + indexed: pickup-desk lookups and the tracking page both
    // search by this, not by Mongo's _id.
    orderId: { type: String, required: true, unique: true, index: true },

    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
      required: true,
      index: true,
    },

    student: {
      fullName: { type: String, required: true, trim: true },
      mobileNumber: { type: String, required: true, trim: true },
      prn: { type: String, required: true, trim: true },
    },

    files: {
      type: [fileSchema],
      validate: [
        {
          validator: (arr) => arr.length > 0 && arr.length <= MAX_FILES_PER_ORDER,
          message: `An order must have between 1 and ${MAX_FILES_PER_ORDER} files.`,
        },
        {
          // Total pages across all files, multiplied by copies, must not
          // exceed the per-order page cap.
          validator: function (arr) {
            const totalPages = arr.reduce((sum, f) => sum + f.pageCount, 0);
            const copies = this.printConfig?.copies || 1;
            return totalPages * copies <= MAX_PAGES_PER_ORDER;
          },
          message: `Total pages (sum of file pages x copies) cannot exceed ${MAX_PAGES_PER_ORDER}.`,
        },
      ],
    },

    printConfig: {
      printType: { type: String, enum: PRINT_TYPE, required: true },
      printMode: { type: String, enum: PRINT_MODE, required: true },
      copies: { type: Number, required: true, min: 1, max: MAX_COPIES_PER_ORDER },
      isUrgent: { type: Boolean, default: false },
    },

    // Backend's own calculation, stored as a frozen snapshot at order time.
    // Even if shop pricing changes later, this order keeps showing exactly
    // what was charged when it was placed. Mirrors the frontend's live
    // price summary, but this copy is the one that's authoritative.
    priceSummary: {
      totalSheets: { type: Number, required: true },
      basePrice: { type: Number, required: true },
      urgentPrice: { type: Number, required: true, default: 0 },
      totalPrice: { type: Number, required: true },
    },

    payment: {
      razorpayOrderId: { type: String },
      razorpayPaymentId: { type: String },
      razorpaySignature: { type: String },
      paidAt: { type: Date },
      refundId: { type: String, default: null },
      refundedAt: { type: Date, default: null },
    },

    status: {
      type: String,
      enum: ORDER_STATUS,
      default: 'PENDING',
      index: true,
    },

    rejectionReason: { type: String, default: null },

    statusTimestamps: {
      acceptedAt: { type: Date, default: null },
      printingAt: { type: Date, default: null },
      readyAt: { type: Date, default: null },
      completedAt: { type: Date, default: null },
      rejectedAt: { type: Date, default: null },
    },
  },
  { timestamps: true }
);

// Compound index: every "shop's current queue" and "active order count"
// query filters on exactly these two fields together.
orderSchema.index({ shop: 1, status: 1 });

const Order = mongoose.model('Order', orderSchema);
export default Order;
