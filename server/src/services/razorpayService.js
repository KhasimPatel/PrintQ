// src/services/razorpayService.js
//
// Everything this backend needs from Razorpay, in one place. Nothing
// outside this file should import the `razorpay` package directly —
// if Razorpay's SDK ever changes its API, this is the only file that
// needs to change.

import Razorpay from 'razorpay';
import crypto from 'crypto';

// Lazily initialized so a missing/placeholder key doesn't crash server
// boot — it only throws when a payment function is actually CALLED,
// which gives a much clearer error during local dev before keys are set.
let razorpayInstance = null;

function getClient() {
  if (!razorpayInstance) {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error(
        'Razorpay keys are not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env.'
      );
    }
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpayInstance;
}

/**
 * Creates a Razorpay order. Amount must be in paise (Rs.1 = 100 paise).
 * @param {number} amountInRupees
 * @param {string} receiptId - your own reference string, shown in Razorpay dashboard
 */
export async function createRazorpayOrder(amountInRupees, receiptId) {
  return getClient().orders.create({
    amount: Math.round(amountInRupees * 100),
    currency: 'INR',
    receipt: receiptId,
  });
}

/**
 * Verifies the signature Razorpay sends back after checkout completes.
 * This is the cryptographic proof that payment data wasn't faked or
 * tampered with by the client — a malicious frontend cannot produce a
 * valid signature without knowing the secret key, which only this
 * backend has.
 */
export function verifyPaymentSignature({ razorpayOrderId, razorpayPaymentId, razorpaySignature }) {
  if (!process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay secret is not configured.');
  }
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex');

  return expectedSignature === razorpaySignature;
}

/**
 * Issues a refund for a payment. Called when a shop rejects an order.
 */
export async function refundPayment(razorpayPaymentId, amountInRupees) {
  return getClient().payments.refund(razorpayPaymentId, {
    amount: Math.round(amountInRupees * 100),
  });
}
