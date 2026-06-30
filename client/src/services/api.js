const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export function getAuthToken() {
  return localStorage.getItem("PrintQ_jwt_token");
}

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem("PrintQ_jwt_token", token);
  } else {
    localStorage.removeItem("PrintQ_jwt_token");
  }
}

export async function request(path, options = {}) {
  const { headers: customHeaders, body, ...rest } = options;

  const isFormData = body instanceof FormData;

  const headers = {
    ...(!isFormData && { "Content-Type": "application/json" }),
    ...customHeaders,
  };

  const token = getAuthToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE}${path}`, {
    ...rest,
    body,
    headers,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(data.message || "Request failed", res.status);
  }

  return data;
}
