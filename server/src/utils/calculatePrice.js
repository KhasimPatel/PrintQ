// src/utils/calculatePrice.js
//
// Matches the spec's own worked example exactly:
//   Sheets = 8 x 1 = 8
//   Base   = 8 x Rs.2 = Rs.16
//   Urgent = 8 x Rs.1 = Rs.8
//   Total  = Rs.24
//
// This is the backend's authoritative calculation. The frontend shows a
// live estimate using the same formula, but the backend ALWAYS recomputes
// and stores its own result rather than trusting whatever number the
// client sends — a tampered request body should never be able to set its
// own price.

import { PRINT_MODE } from '../models/constants.js';

/**
 * @param {Object} params
 * @param {Array<{pageCount: number}>} params.files
 * @param {('BW'|'COLOR')} params.printType
 * @param {('SINGLE'|'DOUBLE')} params.printMode
 * @param {number} params.copies
 * @param {boolean} params.isUrgent
 * @param {Object} params.shopPricing - Shop.pricing subdocument
 * @returns {{ totalSheets: number, basePrice: number, urgentPrice: number, totalPrice: number }}
 */
export function calculatePrice({ files, printType, printMode, copies, isUrgent, shopPricing }) {
  const totalPagesPerCopy = files.reduce((sum, f) => sum + f.pageCount, 0);

  // Double-sided halves the sheet count per copy (rounding up — an odd
  // page count still needs one more physical sheet).
  const sheetsPerCopy =
    printMode === PRINT_MODE[1] // 'DOUBLE'
      ? Math.ceil(totalPagesPerCopy / 2)
      : totalPagesPerCopy;

  const totalSheets = sheetsPerCopy * copies;

  const perSheetRate =
    printType === 'COLOR'
      ? printMode === PRINT_MODE[1]
        ? shopPricing.colorDouble
        : shopPricing.colorSingle
      : printMode === PRINT_MODE[1]
        ? shopPricing.bwDouble
        : shopPricing.bwSingle;

  const basePrice = totalSheets * perSheetRate;
  const urgentPrice = isUrgent ? totalSheets * shopPricing.urgentSurchargePerSheet : 0;
  const totalPrice = basePrice + urgentPrice;

  return { totalSheets, basePrice, urgentPrice, totalPrice };
}
