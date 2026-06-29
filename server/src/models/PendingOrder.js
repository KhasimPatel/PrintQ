// src/models/PendingOrder.js
//
// WHY THIS EXISTS: the original flow had the client echo back file/pricing
// data on verify-payment, which is exploitable — a tampered echo could
// under-report page counts and pay less than the real job costs (verified
// concretely: claiming 2 pages instead of 50 cut the price from Rs.100 to
// Rs.4, since nothing re-checked the echoed data against what was actually
// uploaded). This collection closes that gap: the SERVER's own record of
// what was uploaded and priced is what verify-payment reads, never the
// client's copy.
//
// Lifecycle: created in initiateOrder (after real file upload + real price
// calc), read once in verifyAndCreateOrder, then deleted whether payment
// succeeds or fails. It is intentionally NOT the Order collection — these
// rows represent "payment not yet attempted," which has no status in the
// product's ORDER_STATUS enum by design (orders only exist after payment).
// A TTL index auto-cleans any that are abandoned mid-checkout.

import mongoose from 'mongoose';

const pendingOrderSchema = new mongoose.Schema({
  razorpayOrderId: { type: String, required: true, unique: true, index: true },

  shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
  student: {
    fullName: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    prn: { type: String, required: true },
  },
  files: [
    {
      fileName: { type: String, required: true },
      fileSize: { type: Number, required: true },
      fileUrl: { type: String, required: true },
      publicId: { type: String, required: true },
      pageCount: { type: Number, required: true },
      _id: false,
    },
  ],
  printConfig: {
    printType: { type: String, required: true },
    printMode: { type: String, required: true },
    copies: { type: Number, required: true },
    isUrgent: { type: Boolean, default: false },
  },
  priceSummary: {
    totalSheets: Number,
    basePrice: Number,
    urgentPrice: Number,
    totalPrice: Number,
  },

  // TTL: MongoDB automatically deletes this document 30 minutes after
  // creation if checkout is never completed — prevents abandoned drafts
  // (and their already-uploaded files' metadata) from piling up forever.
  createdAt: { type: Date, default: Date.now, expires: 1800 },
});

const PendingOrder = mongoose.model('PendingOrder', pendingOrderSchema);
export default PendingOrder;
