// src/controllers/fileInspectController.js
//
// Powers the "instant page count" behavior from the upload UI — called
// once per file, the moment it's selected/dropped, BEFORE the order is
// submitted and BEFORE the file ever touches Cloudinary. This endpoint
// does not save anything to the database and does not upload anywhere;
// it only answers "how many pages is this file?" as fast as possible.
//
// The real upload to Cloudinary happens later, at order submission time,
// in orderController.js's initiateOrder — kept deliberately separate so
// a student can select/remove files freely without triggering uploads
// for files they might not even submit.

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

/**
 * Handles a multi-file select in one shot — e.g. the student shift-clicks
 * all 3 files in the OS file picker at once. Returns per-file results
 * (page count or error, independently) plus a combined total, so the UI
 * can show every file card's status AND "Total pages: N" in one response
 * instead of stitching together several separate /inspect calls.
 *
 * The file-count limit (max 3) is enforced here too, even though the
 * frontend should also check this instantly client-side before the network
 * call even fires — this is the server-side backstop, not the primary UX.
 *
 * The 50-page check here is the RAW sum of pages across files, with
 * copies not yet factored in (copies isn't chosen until Step 4). The
 * authoritative pages x copies <= 50 check still runs again at order
 * submission in validateOrderFiles — this is a fast, early heads-up only.
 */
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
