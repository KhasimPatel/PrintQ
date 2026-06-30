import { request } from "./api";

export function createPaymentOrder(pricingInput) {
  return request("/payments/create-order", {
    method: "POST",
    body: JSON.stringify(pricingInput),
  });
}

export function verifyPayment(paymentData) {
  return request("/payments/verify", {
    method: "POST",
    body: JSON.stringify(paymentData),
  });
}
