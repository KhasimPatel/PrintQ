// src/middleware/errorHandler.js
import multer from 'multer';

export function notFound(req, res, next) {
  res.status(404);
  next(new Error(`Route not found: ${req.method} ${req.originalUrl}`));
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  // Multer throws its own MulterError instances (too many files, file too
  // large, etc.) without ever setting a statusCode — without this check
  // they'd fall through to the generic 500 default below, which is wrong:
  // these are client input errors (400), not server failures.
  if (err instanceof multer.MulterError) {
    res.status(400).json({ message: err.message });
    return;
  }

  const statusCode =
    err.statusCode || (res.statusCode && res.statusCode !== 200 ? res.statusCode : 500);
  res.status(statusCode).json({
    message: err.message || 'Server error.',
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
}
