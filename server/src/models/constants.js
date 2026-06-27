// src/models/constants.js
//
// Single source of truth for every enum and business-rule number used
// across schemas. Import these instead of typing raw strings/numbers —
// if a value ever changes, it changes in exactly one place.

export const SHOP_STATUS = ['OPEN', 'BREAK', 'CLOSED', 'BUSY'];

export const PRINT_TYPE = ['BW', 'COLOR'];
export const PRINT_MODE = ['SINGLE', 'DOUBLE'];

export const ORDER_STATUS = [
  'PENDING',
  'ACCEPTED',
  'PRINTING',
  'READY',
  'COMPLETED',
  'REJECTED',
  'REFUND_INITIATED',
];

// Business rule caps from the product spec.
export const MAX_FILES_PER_ORDER = 3;
export const MAX_COPIES_PER_ORDER = 5;
export const MAX_PAGES_PER_ORDER = 50;
export const DEFAULT_MAX_QUEUE_COUNT = 20;

// Allowed upload types, per updated scope: PDF, PPT, PPTX, and images.
// DOCX/DOC deliberately excluded — Word stores no reliable page count in
// the file itself (it's computed at render time), and every remaining
// type here has a deterministic, auto-countable page count:
//   PDF        -> actual page count via pdf-lib
//   PPT/PPTX   -> slide count via the file's internal XML structure
//   image      -> always exactly 1 page
export const ALLOWED_FILE_MIME_TYPES = [
  'application/pdf',
  'application/vnd.ms-powerpoint', // .ppt
  'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
  'image/jpeg',
  'image/png',
  'image/webp',
];

export const IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const PPTX_MIME_TYPE =
  'application/vnd.openxmlformats-officedocument.presentationml.presentation';
export const LEGACY_PPT_MIME_TYPE = 'application/vnd.ms-powerpoint';
