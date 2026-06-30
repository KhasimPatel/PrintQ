// src/controllers/fileInspectController.js
import asyncHandler from 'express-async-handler';
import { resolvePageCount, resolvePageCountsLenient } from '../services/pageCountService.js';
import { MAX_FILES_PER_ORDER, MAX_PAGES_PER_ORDER } from '../models/constants.js';

export const inspectFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No file provided.');
  }

  const pageCount = await resolvePageCount(req.file);

  res.status(200).json({
    fileName: req.file.originalname,
    fileSize: req.file.size,
    pageCount,
  });
});

export const inspectFilesBatch = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    res.status(400);
    throw new Error('No files provided.');
  }

  if (req.files.length > MAX_FILES_PER_ORDER) {
    res.status(400);
    throw new Error(`A maximum of ${MAX_FILES_PER_ORDER} files is allowed per order.`);
  }

  const results = await resolvePageCountsLenient(req.files);

  // Only sum pages from files that were actually counted successfully —
  // a failed file contributes 0 to the running total, not an error.
  const totalPages = results.reduce((sum, r) => sum + (r.pageCount || 0), 0);
  const exceedsPageLimit = totalPages > MAX_PAGES_PER_ORDER;

  res.status(200).json({
    files: results,
    totalPages,
    exceedsPageLimit,
    maxPagesAllowed: MAX_PAGES_PER_ORDER,
  });
});
