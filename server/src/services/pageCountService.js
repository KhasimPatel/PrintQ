// src/services/pageCountService.js
//
// Every supported file type now has a deterministic, auto-detectable page
// count — no manual fallback needed (DOCX, the one type that genuinely
// can't be counted reliably, has been dropped from scope entirely):
//   PDF             -> exact page count via pdf-lib
//   PPTX            -> slide count via the file's internal XML structure
//   legacy PPT      -> NOT supported (old binary OLE format, not a zip —
//                      different library needed; throws a clear error)
//   image           -> always exactly 1 page

import { PDFDocument } from 'pdf-lib';
import AdmZip from 'adm-zip';
import { PPTX_MIME_TYPE, LEGACY_PPT_MIME_TYPE, IMAGE_MIME_TYPES } from '../models/constants.js';

async function countPdfPages(buffer) {
  const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  return pdfDoc.getPageCount();
}

// PPTX files are zip archives. Each slide is its own XML file at exactly
// ppt/slides/slideN.xml — NOT ppt/slides/_rels/... and NOT
// ppt/slideLayouts/... (both of which also contain the word "slide" in
// their path, so a naive substring match would overcount). Verified
// against a real minimal PPTX's internal structure before trusting this.
function countPptxSlides(buffer) {
  const zip = new AdmZip(buffer);
  const entries = zip.getEntries();
  const slidePattern = /^ppt\/slides\/slide\d+\.xml$/;
  return entries.filter((e) => slidePattern.test(e.entryName)).length;
}

/**
 * Resolves the page count for one uploaded file. No manual fallback —
 * every supported type is deterministically countable, or this throws.
 * @param {Object} file - multer file object (buffer, mimetype, originalname)
 * @returns {Promise<number>}
 */
export async function resolvePageCount(file) {
  const { mimetype, buffer, originalname } = file;

  if (mimetype === 'application/pdf') {
    try {
      const count = await countPdfPages(buffer);
      if (count < 1) throw new Error('PDF reported zero pages.');
      return count;
    } catch (err) {
      throw new Error(`Could not read "${originalname}" — the PDF may be corrupted or password-protected.`);
    }
  }

  if (mimetype === PPTX_MIME_TYPE) {
    const count = countPptxSlides(buffer);
    if (count < 1) {
      throw new Error(`Could not detect any slides in "${originalname}".`);
    }
    return count;
  }

  if (mimetype === LEGACY_PPT_MIME_TYPE) {
    throw new Error(
      `"${originalname}" is a legacy .ppt file, which isn't supported yet. Please save it as .pptx and re-upload.`
    );
  }

  if (IMAGE_MIME_TYPES.includes(mimetype)) {
    return 1;
  }

  throw new Error(`Unsupported file type for "${originalname}".`);
}

/**
 * Resolves page counts for a whole batch of files, preserving order.
 * All-or-nothing: throws on the first failure. Used by initiateOrder at
 * final submission, where every file MUST be valid or the order can't
 * be created at all.
 * @param {Array} files - multer file objects
 * @returns {Promise<number[]>}
 */
export async function resolvePageCounts(files) {
  const results = [];
  for (const file of files) {
    results.push(await resolvePageCount(file));
  }
  return results;
}

/**
 * Resolves page counts for a batch of files WITHOUT failing the whole
 * batch if one file is bad. Used by the instant multi-select inspect
 * endpoint, where each file card has its own independent status (per the
 * upload UI) — one corrupted file shouldn't block the other two from
 * showing their page counts.
 * @param {Array} files - multer file objects
 * @returns {Promise<Array<{fileName, fileSize, pageCount: number|null, error: string|null}>>}
 */
export async function resolvePageCountsLenient(files) {
  const results = [];
  for (const file of files) {
    try {
      const pageCount = await resolvePageCount(file);
      results.push({
        fileName: file.originalname,
        fileSize: file.size,
        pageCount,
        error: null,
      });
    } catch (err) {
      results.push({
        fileName: file.originalname,
        fileSize: file.size,
        pageCount: null,
        error: err.message,
      });
    }
  }
  return results;
}
