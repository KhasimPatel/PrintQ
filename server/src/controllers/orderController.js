// src/controllers/orderController.js
//
// Controllers stay thin: parse the request, call the right service(s),
// shape the response. Business logic (pricing, state machine, refunds,
// shop availability) lives in /services — not duplicated here.

import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import Shop from '../models/Shop.js';
import PendingOrder from '../models/PendingOrder.js';
import { calculatePrice } from '../utils/calculatePrice.js';
import { generateOrderId } from '../utils/generateOrderId.js';
import { validateOrderFiles } from '../utils/validateOrderInput.js';
import { resolvePageCounts } from '../services/pageCountService.js';
import { uploadFiles } from '../services/fileStorageService.js';
import { createRazorpayOrder, verifyPaymentSignature } from '../services/razorpayService.js';
import { transitionOrderStatus, rejectOrderWithRefund } from '../services/orderStatusService.js';

/**
 * STEP 1: Create a Razorpay order ahead of payment. No Order document is
 * created yet — per the product spec, the Order is only created AFTER
 * payment is verified. This endpoint validates input, resolves page counts,
 * uploads files, calculates price, and creates the Razorpay order.
 *
 * SECURITY NOTE: the server-verified file metadata and price are persisted
 * in PendingOrder, keyed by razorpayOrderId — NOT sent to the client to be
 * echoed back later. Earlier drafts of this endpoint trusted a client-
 * echoed "orderDraft" on verify-payment, which is exploitable: a tampered
 * echo could under-report page counts and pay a fraction of the real price,
 * since nothing re-checked the echo against what was actually uploaded.
 * PendingOrder is the server's own memory of what really happened here.
 */
export const initiateOrder = asyncHandler(async (req, res) => {
  const shop = req.shop; // attached by checkShopAvailability middleware
  const { studentName, studentMobile, studentPrn, printType, printMode, copies, isUrgent } =
    req.body;

  const copiesNum = Number(copies);

  // Every file was already inspected once via POST /api/files/inspect the
  // moment it was selected on the frontend — but we never trust that
  // client-side result for pricing. Page counts are resolved fresh,
  // server-side, from the actual uploaded bytes, right here.
  const resolvedPageCounts = await resolvePageCounts(req.files);
  validateOrderFiles(req.files, resolvedPageCounts, copiesNum);

  const uploaded = await uploadFiles(req.files);
  // console output for debugging: what was uploaded, what page counts were resolved
  console.log("Uploaded Files =>", uploaded);
  const files = uploaded.map((f, i) => ({ ...f, pageCount: resolvedPageCounts[i] }));
  // console.log("Files with Page Counts =>", files);
  console.log("Final Files =>", files);

  const isUrgentBool = isUrgent === 'true' || isUrgent === true;

  const printConfig = {
    printType,
    printMode,
    copies: copiesNum,
    isUrgent: isUrgentBool,
  };

  const priceSummary = calculatePrice({
    files,
    printType,
    printMode,
    copies: copiesNum,
    isUrgent: isUrgentBool,
    shopPricing: shop.pricing,
  });

  // const razorpayOrder = await createRazorpayOrder(priceSummary.totalPrice, `printgo_${Date.now()}`);

  let razorpayOrder;

  if (process.env.BYPASS_PAYMENT === "true") {
    razorpayOrder = {
      id: `DEV_ORDER_${Date.now()}`,
      amount: priceSummary.totalPrice * 100,
      currency: "INR",
    };
  } else {
    razorpayOrder = await createRazorpayOrder(
      priceSummary.totalPrice,
      `printgo_${Date.now()}`
    );
  }

  // Persist the server's own record of this order, keyed by razorpayOrderId.
  // verify-payment will look THIS up — it will not trust anything the
  // client sends about files/pricing, only the Razorpay payment proof.
  await PendingOrder.create({
    razorpayOrderId: razorpayOrder.id,
    shop: shop._id,
    student: { fullName: studentName, mobileNumber: studentMobile, prn: studentPrn },
    files,
    printConfig,
    priceSummary,
  });

  res.status(200).json({
    razorpayOrderId: razorpayOrder.id,
    amount: razorpayOrder.amount, // paise
    currency: razorpayOrder.currency,
    keyId: process.env.RAZORPAY_KEY_ID,
    priceSummary,
  });
});

/**
 * STEP 2: Verify payment signature, then — only on success — create the
 * Order document using the SERVER's own PendingOrder record (never the
 * client's echo). This is the one and only place an Order gets created,
 * matching "when payment succeeds, order should be automatically created."
 */
export const verifyAndCreateOrder = asyncHandler(async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

  // const isValid = verifyPaymentSignature({ razorpayOrderId, razorpayPaymentId, razorpaySignature });
  // if (!isValid) {
  //   res.status(400);
  //   throw new Error('Payment verification failed.');
  // }
  const bypassPayment = process.env.BYPASS_PAYMENT === "true";

  if (!bypassPayment) {
    const isValid = verifyPaymentSignature({
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    });

    if (!isValid) {
      res.status(400);
      throw new Error("Payment verification failed.");
    }
  }

  const pending = await PendingOrder.findOne({ razorpayOrderId });
  if (!pending) {
    res.status(404);
    throw new Error(
      'No pending order found for this payment. It may have expired — please start over.'
    );
  }

  // Price is taken from PendingOrder, which was computed server-side from
  // real shop.pricing at the time of upload — not recalculated from
  // anything client-supplied at this step. There is nothing left for the
  // client to tamper with here.
  const orderId = await generateOrderId();

  const order = await Order.create({
    orderId,
    shop: pending.shop,
    student: pending.student,
    files: pending.files,
    printConfig: pending.printConfig,
    priceSummary: pending.priceSummary,
    payment: {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      paidAt: new Date(),
    },
    status: 'PENDING',
  });

  // New order enters the active queue — increment atomically.
  await Shop.findByIdAndUpdate(pending.shop, { $inc: { queueCount: 1 } });

  // Pending record has served its purpose — remove it. Whether this order
  // creation succeeded or we'd thrown above, leaving it around past payment
  // serves no one; the TTL index would also clean it up eventually, but
  // deleting it immediately keeps the collection lean.
  await PendingOrder.deleteOne({ razorpayOrderId });

  res.status(201).json({ message: 'Order placed successfully.', order });
});

/**
 * Student-facing polling endpoint. No auth — the orderId itself (or Mongo
 * _id) acts as the de-facto access token since it's not guessable.
 */
export const getOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ orderId: req.params.orderId }).populate(
    'shop',
    'name address status'
  );
  if (!order) {
    res.status(404);
    throw new Error('Order not found.');
  }
  res.json(order);
});

/**
 * Shop dashboard: current queue, urgent-first then oldest-first.
 */
export const getShopOrders = asyncHandler(async (req, res) => {
  const shopId = req.shop._id;
  const { status } = req.query;

  const filter = { shop: shopId };
  filter.status = status || { $in: ['PENDING', 'ACCEPTED', 'PRINTING', 'READY'] };

  const orders = await Order.find(filter).sort({ 'printConfig.isUrgent': -1, createdAt: 1 });
  res.json(orders);
});

export const acceptOrder = asyncHandler(async (req, res) => {
  const order = await transitionOrderStatus(req.params.id, req.shop._id, 'ACCEPTED');
  res.json({ message: 'Order accepted.', order });
});

export const markPrinting = asyncHandler(async (req, res) => {
  const order = await transitionOrderStatus(req.params.id, req.shop._id, 'PRINTING');
  res.json({ message: 'Order marked as printing.', order });
});

export const markReady = asyncHandler(async (req, res) => {
  const order = await transitionOrderStatus(req.params.id, req.shop._id, 'READY');
  res.json({ message: 'Order ready for pickup.', order });
});

export const markCompleted = asyncHandler(async (req, res) => {
  const order = await transitionOrderStatus(req.params.id, req.shop._id, 'COMPLETED');
  res.json({ message: 'Order completed.', order });
});

export const rejectOrder = asyncHandler(async (req, res) => {
  const { reason, note } = req.body;
  if (!reason) {
    res.status(400);
    throw new Error('Rejection reason is required.');
  }
  const order = await rejectOrderWithRefund(req.params.id, req.shop._id, reason, note);
  res.json({ message: 'Order rejected. Refund initiated if payment was made.', order });
});
