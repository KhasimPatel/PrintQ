import { useState } from "react";
import { updateShopTimings } from "../../services/shopService";

const navItems = [
  { label: "Incoming Orders", view: "INCOMING" },
  { label: "Completed Orders", view: "COMPLETED" },
  { label: "Revenue History" },
  { label: "Settings" },
];

export default function ShopSidebar({
  activeOrderView,
  onSelectOrderView,
  shopStatus,
  queueCount,
  maxQueueCount,
  openingTime,
  closingTime,
  onTimingsUpdated,
}) {
  const [editingTimings, setEditingTimings] = useState(false);
  const [openTime, setOpenTime] = useState(openingTime || "");
  const [closeTime, setCloseTime] = useState(closingTime || "");
  const [saving, setSaving] = useState(false);

  const handleSaveTimings = async () => {
    if (!openTime || !closeTime) return;
    setSaving(true);
    try {
      const res = await updateShopTimings(openTime, closeTime);

      // Update localStorage with fresh shop data
      const existing = JSON.parse(
        localStorage.getItem("PrintQ_shop_data") || "{}",
      );
      const updated = {
        ...existing,
        openingTime: res.shop.openingTime,
        closingTime: res.shop.closingTime,
      };
      localStorage.setItem("PrintQ_shop_data", JSON.stringify(updated));

      setEditingTimings(false);
      onTimingsUpdated?.();
    } catch (err) {
      console.error("Failed to update timings:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <aside className="rounded-4xl border border-border bg-surface p-6 shadow-[0_12px_32px_rgba(15,23,42,0.04)] dark:border-border">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-text-muted">
          Shop Menu
        </p>
        <h2 className="mt-3 text-xl font-semibold text-text">PrintQ Shop</h2>
        <p className="mt-2 text-sm leading-relaxed text-text-muted">
          Fast access to all shop tools and order groups.
        </p>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => item.view && onSelectOrderView?.(item.view)}
            className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
              item.view && activeOrderView === item.view
                ? "bg-primary text-white shadow-primary/20"
                : "border border-border bg-surface text-text hover:border-primary/50 hover:bg-primary-light/10 dark:border-border"
            }`}
          >
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-8 rounded-3xl border border-border bg-background/80 p-4 dark:border-border">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-text-muted">
          Current Status
        </p>
        <div className="mt-3 rounded-2xl border border-border bg-background px-4 py-3 text-center text-sm font-semibold text-text dark:border-border">
          {shopStatus || "—"}
        </div>
        <div className="mt-4 grid gap-3 text-sm text-text-muted">
          <div className="flex justify-between">
            <span>Queue</span>
            <span>
              {queueCount ?? 0} / {maxQueueCount ?? 20}
            </span>
          </div>

          {!editingTimings ? (
            <>
              <div className="flex justify-between">
                <span>Open Time</span>
                <span>{openingTime || "Not set"}</span>
              </div>
              <div className="flex justify-between">
                <span>Close Time</span>
                <span>{closingTime || "Not set"}</span>
              </div>
              <button
                type="button"
                onClick={() => setEditingTimings(true)}
                className="mt-1 rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold text-text transition hover:border-primary/50 hover:bg-primary-light/10"
              >
                Edit timings
              </button>
            </>
          ) : (
            <>
              <div className="flex flex-col gap-2">
                <label className="text-xs text-text-muted">Open Time</label>
                <input
                  type="time"
                  value={openTime}
                  onChange={(e) => setOpenTime(e.target.value)}
                  className="rounded-xl border border-border bg-surface px-3 py-2 text-sm text-text outline-none"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs text-text-muted">Close Time</label>
                <input
                  type="time"
                  value={closeTime}
                  onChange={(e) => setCloseTime(e.target.value)}
                  className="rounded-xl border border-border bg-surface px-3 py-2 text-sm text-text outline-none"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSaveTimings}
                  disabled={saving}
                  className="flex-1 rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-white transition hover:bg-primary-dark disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingTimings(false)}
                  className="flex-1 rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold text-text transition hover:bg-hover"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
