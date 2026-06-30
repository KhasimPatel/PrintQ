export const ORDER_STATUS = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  PRINTING: "PRINTING",
  READY: "READY",
  COMPLETED: "COMPLETED",
  REJECTED: "REJECTED",
  REFUND_INITIATED: "REFUND_INITIATED",
};

export const TRACKING_STATUSES = [
  "PENDING",
  "ACCEPTED",
  "PRINTING",
  "READY",
  "REJECTED",
];

export const STATUS_LABELS = {
  PENDING: "Order Placed",
  ACCEPTED: "Accepted",
  PRINTING: "Printing",
  READY: "Ready for Pickup",
  COMPLETED: "Completed",
  REJECTED: "Rejected",
  REFUND_INITIATED: "Refund Initiated",
};

export const REJECTION_REASONS = [
  "Paper unavailable",
  "Ink unavailable",
  "Printer issue",
  "Shop closed unexpectedly",
  "Unsupported file",
];

export const MAX_FILES = 3;

export const ALLOWED_EXTENSIONS = [".pdf", ".docx", ".ppt", ".pptx"];

export const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
];
