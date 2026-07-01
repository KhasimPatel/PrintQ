import { request, setAuthToken } from "./api";

export function listShops() {
  return request("/shops");
}

// --- Shop owner: auth ---

export async function loginShopOwner({ email, password }) {
  const res = await request("/shops/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  if (res.token) setAuthToken(res.token);
  return res;
}

export async function registerShopOwner(formData) {
  const payload = {
    ownerName: formData.ownerName,
    shopName: formData.shopName,
    email: formData.email,
    mobile: formData.mobile,
    address: formData.address,
    password: formData.password,
  };

  return request("/shops/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function logoutShopOwner() {
  setAuthToken(null);
}

export function updateShopStatus(status) {
  return request("/shops/status", {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export function updateShopTimings(openingTime, closingTime) {
  return request("/shops/timings", {
    method: "PATCH",
    body: JSON.stringify({ openingTime, closingTime }),
  });
}

// --- Shop owner: orders ---

// status omitted -> backend default ($in PENDING/ACCEPTED/READY, per
// getShopOrders in orderController.js). Pass a specific status to filter,
// e.g. listShopOrders("COMPLETED") for the Completed Orders view.
export function listShopOrders(status) {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  return request(`/orders/shop/mine${query}`);
}

export function getShopDashboardSummary() {
  return request("/orders/shop/dashboard-summary");
}

export function acceptOrder(orderId) {
  return request(`/orders/${orderId}/accept`, { method: "PATCH" });
}

export function rejectOrder(orderId, reason, note) {
  return request(`/orders/${orderId}/reject`, {
    method: "PATCH",
    body: JSON.stringify({ reason, note }),
  });
}

export function markOrderReady(orderId) {
  return request(`/orders/${orderId}/ready`, { method: "PATCH" });
}

export function markOrderCompleted(orderId) {
  return request(`/orders/${orderId}/complete`, { method: "PATCH" });
}

// --- Forgot Password ---

export function forgotPassword(email) {
  return request("/shops/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export function verifyOtp(email, otp) {
  return request("/shops/verify-otp", {
    method: "POST",
    body: JSON.stringify({ email, otp }),
  });
}

export function resetPassword(email, password) {
  return request("/shops/reset-password", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}
