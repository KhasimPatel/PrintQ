// src/middleware/upload.js
import multer from 'multer';
import { MAX_FILES_PER_ORDER, ALLOWED_FILE_MIME_TYPES } from '../models/constants.js';

const storage = multer.memoryStorage(); // buffer in memory, handed to fileStorageService

function fileFilter(req, file, cb) {
  if (ALLOWED_FILE_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const err = new Error(`Unsupported file type: ${file.mimetype}. Allowed: PDF, PPT, PPTX, or image.`);
    err.statusCode = 400; // without this, the global error handler defaults to 500
    cb(err);
  }
}

const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25MB, matching the upload UI's stated limit

// Used at final order submission — student has already picked their files
// in the UI, this is the one-shot multi-file upload at the end.
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    files: MAX_FILES_PER_ORDER,
    fileSize: MAX_FILE_SIZE_BYTES,
  },
});

// Used by the instant page-count "inspect" endpoint — called once per file,
// the moment a file is selected/dropped, before the order is ever submitted.
export const uploadSingle = multer({
  storage,
  fileFilter,
  limits: {
    files: 1,
    fileSize: MAX_FILE_SIZE_BYTES,
  },
});
