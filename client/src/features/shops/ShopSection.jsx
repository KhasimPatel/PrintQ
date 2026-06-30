import {
  SHOP_STATUS_LABELS,
  SHOP_STATUS_MESSAGES,
} from "../../constants/shops";
import {
  getEffectiveShopStatus,
  isShopSelectable,
  getShopDisabledMessage,
} from "../../utils/shopUtils";
import { useOrder } from "../../context/OrderContext";
import SectionWrapper from "../../components/ui/SectionWrapper";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";

const badgeVariant = {
  OPEN: "open",
  BREAK: "break",
  CLOSED: "closed",
  BUSY: "busy",
};

export default function ShopSection() {
  const { selectedShopId, dispatch, shops } = useOrder();

  // console.log("What is in shops?", shops);

  return (
    <SectionWrapper
      id="shop"
      step="1"
      title="Select Xerox Shop"
      description="Choose an open shop near campus. Only shops accepting orders can be selected."
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {shops.map((shop) => {
          // console.log("Inspecting shop object:", shop);
          const effective = getEffectiveShopStatus(shop);
          const selectable = isShopSelectable(shop);
          const selected = selectedShopId === shop._id;
          const disabledMsg = getShopDisabledMessage(shop);

          return (
            <Card
              key={shop._id}
              hover={selectable}
              onClick={() => {
                if (selectable) {
                  dispatch({ type: "SELECT_SHOP", payload: shop._id });
                }
              }}
              className={`relative transition-all ${
                selected
                  ? "border-2 border-primary ring-2 ring-primary/20"
                  : "border border-transparent"
              } ${!selectable ? "cursor-not-allowed opacity-60" : ""}`}
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-text">{shop.shopName}</h3>
                <Badge variant={badgeVariant[effective] || "default"}>
                  {SHOP_STATUS_LABELS[effective]}
                </Badge>
              </div>

              <p className="mt-2 text-xs text-text-muted">
                {SHOP_STATUS_MESSAGES[effective]}
              </p>

              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-text-muted">
                  Queue:{" "}
                  <span className="font-medium text-text">
                    {shop.queueCount}
                  </span>
                </span>
                {selected && (
                  <span className="text-xs font-semibold text-primary-dark">
                    Selected ✓
                  </span>
                )}
              </div>

              {shop.address && (
                <p className="mt-2 text-xs text-text-muted">{shop.address}</p>
              )}

              {(shop.openingTime || shop.closingTime) && (
                <p className="mt-1 text-xs text-text-muted">
                  Hours: {shop.openingTime || "—"} – {shop.closingTime || "—"}
                </p>
              )}

              {!selectable && disabledMsg && (
                <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600 dark:bg-red-900/20 dark:text-red-300">
                  {disabledMsg}
                </p>
              )}
            </Card>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
