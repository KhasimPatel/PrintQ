import { request } from "./api";

export function createOrder(orderData) {
  return request("/orders", {
    method: "POST",
    body: JSON.stringify(orderData),
  });
}

export function getOrder(orderId) {
  return request(`/orders/${orderId}`);
}

export function validateOrder(orderData) {
  return request("/orders/validate", {
    method: "POST",
    body: JSON.stringify(orderData),
  });
}

export function estimatePrice(settings) {
  return request("/orders/estimate", {
    method: "POST",
    body: JSON.stringify(settings),
  });
}

export function initiateOrder(orderData) {
  return request("/orders/initiate", {
    method: "POST",
    body: orderData,
  });
}

export function verifyPaymentOrder(paymentData) {
  return request("/orders/verify-payment", {
    method: "POST",
    body: JSON.stringify(paymentData),
  });
}

export function trackOrder(orderId) {
  return request(`/orders/track/${orderId}`);
}
