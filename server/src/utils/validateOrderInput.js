// src/utils/validateOrderInput.js
//
// Pure validation functions — no DB calls, no side effects. These run
// BEFORE we touch the database, so bad input fails fast with a clear
// message instead of surfacing as a confusing Mongoose validation error
// deep in a stack trace. The Mongoose schema validators in models/Order.js
// are the last line of defense; these are the first.

import {
  MAX_FILES_PER_ORDER,
  MAX_COPIES_PER_ORDER,
  MAX_PAGES_PER_ORDER,
  ALLOWED_FILE_MIME_TYPES,
} from '../models/constants.js';

/**
 * Validates the file list for an order: count, mime type, and total page cap.
 * @param {Array<{mimetype: string}>} files - multer file objects
 * @param {Array<number>} pageCounts - resolved page count per file, same order
 * @param {number} copies
 * @throws {Error} with a clear, user-facing message if any rule is violated
 */
export function validateOrderFiles(files, pageCounts, copies) {
  if (!files || files.length === 0) {
    throw new Error('At least one file is required.');
  }

  if (files.length > MAX_FILES_PER_ORDER) {
    throw new Error(`A maximum of ${MAX_FILES_PER_ORDER} files is allowed per order.`);
  }

  const invalidFile = files.find((f) => !ALLOWED_FILE_MIME_TYPES.includes(f.mimetype));
  if (invalidFile) {
    throw new Error(
      `Unsupported file type: "${invalidFile.originalname}". Allowed: PDF, DOC, DOCX, PPT, PPTX.`
    );
  }

  if (!copies || copies < 1 || copies > MAX_COPIES_PER_ORDER) {
    throw new Error(`Copies must be between 1 and ${MAX_COPIES_PER_ORDER}.`);
  }

  const totalPages = pageCounts.reduce((sum, p) => sum + p, 0);
  const totalAcrossCopies = totalPages * copies;
  if (totalAcrossCopies > MAX_PAGES_PER_ORDER) {
    throw new Error(
      `Total pages (${totalPages} pages x ${copies} copies = ${totalAcrossCopies}) exceeds the ${MAX_PAGES_PER_ORDER}-page limit per order.`
    );
  }
}
