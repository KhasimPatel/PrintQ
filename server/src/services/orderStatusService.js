// src/services/orderStatusService.js
//
// The single authority on order status transitions. Every controller that
// changes an order's status MUST go through transitionOrderStatus() here —
// never set order.status directly anywhere else in the codebase. This is
// what guarantees an order can't skip steps (e.g. PENDING -> READY without
// ever being ACCEPTED or PRINTING).
//
// This also owns Shop.queueCount bookkeeping. Because queueCount is a
// manually maintained counter (not computed live from Order.countDocuments),
// every increment/decrement MUST happen here, atomically, in the same place
// status changes — never as a separate untracked write elsewhere. This is
// the guard against the counter drifting from reality that we flagged
// during schema design.

import Order from '../models/Order.js';
import Shop from '../models/Shop.js';
import { refundPayment } from './razorpayService.js';

// Allowed transitions: key = current status, value = legal next statuses.
// Any transition not listed here is rejected.
const TRANSITIONS = {
  PENDING: ['ACCEPTED', 'REJECTED'],
  ACCEPTED: ['READY', 'REJECTED'],
  READY: ['COMPLETED'],
  COMPLETED: [],
  REJECTED: [],
  REFUND_INITIATED: [],
};

// Statuses that count toward a shop's active queue. Used to decide when
// queueCount should be decremented (order leaving the active queue).
const ACTIVE_STATUSES = ['PENDING', 'ACCEPTED'];

export function canTransition(fromStatus, toStatus) {
  const allowed = TRANSITIONS[fromStatus];
  return Boolean(allowed && allowed.includes(toStatus));
}

const TIMESTAMP_FIELD_BY_STATUS = {
  ACCEPTED: 'acceptedAt',
  PRINTING: 'printingAt',
  READY: 'readyAt',
  COMPLETED: 'completedAt',
  REJECTED: 'rejectedAt',
};

/**
 * Transitions an order to a new status, scoped to a specific shop so a
 * shop owner can never touch another shop's order. Handles the matching
 * statusTimestamps field and queueCount bookkeeping automatically.
 *
 * @param {string} orderId - Mongo _id of the order
 * @param {string} shopId - the shop attempting the transition (ownership check)
 * @param {string} newStatus
 * @param {Object} [extraFields] - extra fields to set, e.g. rejectionReason
 * @returns {Promise<Order>}
 * @throws {Error} with .statusCode set, for clean HTTP responses upstream
 */
export async function transitionOrderStatus(orderId, shopId, newStatus, extraFields = {}) {
  const order = await Order.findOne({ _id: orderId, shop: shopId });
  if (!order) {
    const err = new Error('Order not found for this shop.');
    err.statusCode = 404;
    throw err;
  }

  if (!canTransition(order.status, newStatus)) {
    const err = new Error(`Cannot move order from ${order.status} to ${newStatus}.`);
    err.statusCode = 409;
    throw err;
  }

  const wasActive = ACTIVE_STATUSES.includes(order.status);
  const isStillActive = ACTIVE_STATUSES.includes(newStatus);

  order.status = newStatus;
  Object.assign(order, extraFields);

  const timestampField = TIMESTAMP_FIELD_BY_STATUS[newStatus];
  if (timestampField) {
    order.statusTimestamps[timestampField] = new Date();
  }

  await order.save();

  // If the order is leaving the active queue, decrement queueCount
  // atomically. If somehow re-entering active (not reachable via our
  // current transition map, but guarded for safety), increment.
  if (wasActive && !isStillActive) {
    await Shop.findByIdAndUpdate(shopId, { $inc: { queueCount: -1 } });
  } else if (!wasActive && isStillActive) {
    await Shop.findByIdAndUpdate(shopId, { $inc: { queueCount: 1 } });
  }

  return order;
}

/**
 * Rejects an order and automatically triggers a refund. If the refund API
 * call itself fails, the rejection still succeeds — we don't want a
 * Razorpay hiccup to block a shop's ability to reject a bad order. The
 * order's payment stays flagged for manual reconciliation in that case.
 */
export async function rejectOrderWithRefund(orderId, shopId, reason, note) {
  const order = await transitionOrderStatus(orderId, shopId, 'REJECTED', {
    rejectionReason: note ? `${reason}: ${note}` : reason,
  });

  if (!order.payment?.razorpayPaymentId) {
    return order;
  }

  try {
    const refund = await refundPayment(
      order.payment.razorpayPaymentId,
      order.priceSummary.totalPrice
    );
    order.payment.refundId = refund.id;
    order.payment.refundedAt = new Date();
    // NOTE: setting status directly here (not via transitionOrderStatus)
    // is deliberate — REJECTED -> REFUND_INITIATED is a system-driven
    // continuation of the same rejection action, not a separate
    // user-triggered transition, so it's intentionally outside TRANSITIONS.
    // Do not "fix" this into a canTransition() call without it.
    order.status = 'REFUND_INITIATED';
    await order.save();
  } catch (refundErr) {
    // eslint-disable-next-line no-console
    console.error(`Refund failed for order ${order.orderId}:`, refundErr.message);
    // Order stays REJECTED; payment.refundId stays null — a visible
    // "needs manual refund" signal for a future admin report.
  }

  return order;
}
