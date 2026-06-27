// src/routes/fileRoutes.js
import express from 'express';
import { upload, uploadSingle } from '../middleware/upload.js';
import { inspectFile, inspectFilesBatch } from '../controllers/fileInspectController.js';
import { MAX_FILES_PER_ORDER } from '../models/constants.js';

const router = express.Router();

// Single-file select: returns page count immediately for one file.
router.post('/inspect', uploadSingle.single('file'), inspectFile);

// Multi-file select (e.g. shift-clicking all 3 at once in the OS file
// picker): returns per-file page counts AND a combined total in one
// response, so the UI can show every card's status plus "Total pages: N"
// without stitching together several separate /inspect calls.
router.post('/inspect-batch', upload.array('files', MAX_FILES_PER_ORDER), inspectFilesBatch);

export default router;

