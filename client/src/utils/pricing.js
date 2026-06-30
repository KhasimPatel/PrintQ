/** Exact pricing engine per business rules. */
export function calculatePricing({
  totalPages,
  copies,
  printMode,
  colorType,
  isUrgent,
}) {
  const pages = Number(totalPages) || 0;
  const copyCount = Number(copies) || 1;

  const sheets =
    printMode === "double"
      ? Math.ceil(pages / 2) * copyCount
      : pages * copyCount;

  const pricePerSheet = colorType === "color" ? 5 : 2;
  const basePrice = sheets * pricePerSheet;
  const urgentPrice = isUrgent ? sheets * 1 : 0;
  const totalPrice = basePrice + urgentPrice;

  return {
    sheets,
    pricePerSheet,
    basePrice,
    urgentPrice,
    totalPrice,
  };
}
