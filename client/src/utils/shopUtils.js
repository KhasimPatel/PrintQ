export function getEffectiveShopStatus(shop) {
  if (!shop) return null;
  if (shop.queueCount >= 20) return "BUSY";
  return shop.status;
}

export function isShopSelectable(shop) {
  if (!shop) return false;
  return getEffectiveShopStatus(shop) === "OPEN" && shop.queueCount < 20;
}

export function getShopDisabledMessage(shop) {
  if (!shop) return "Select a shop to continue.";

  const effective = getEffectiveShopStatus(shop);

  if (effective === "BUSY" || shop.queueCount >= 20) {
    return "Shop is currently handling too many orders. Please choose another shop.";
  }

  if (effective !== "OPEN") {
    return "Not accepting orders right now";
  }

  return null;
}
