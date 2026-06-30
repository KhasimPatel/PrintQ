import { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import ThemeToggle from "../ui/ThemeToggle";
import { updateShopStatus } from "../../services/shopService";

export default function ShopOwnerHeader() {
  const shopData = JSON.parse(
    localStorage.getItem("PrintQ_shop_data") || "{}",
  );
  const [status, setStatus] = useState(shopData.status || "OPEN");

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    try {
      await updateShopStatus(newStatus);

      const existing = JSON.parse(
        localStorage.getItem("PrintQ_shop_data") || "{}",
      );
      const updated = { ...existing, status: newStatus };
      localStorage.setItem("PrintQ_shop_data", JSON.stringify(updated));

      window.dispatchEvent(new Event("shop-status-updated"));
    } catch (err) {
      console.error("Failed to update shop status:", err);
      setStatus(status);
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-6">
        <div className="flex items-center gap-3">
          <Logo />
          {/* <span className="text-lg font-semibold tracking-tight text-text">
            PrintQ Shop
          </span> */}
        </div>

        <div className="hidden md:block text-center">
          <p className="text-lg font-semibold text-text">
            Welcome,{" "}
            {JSON.parse(localStorage.getItem("PrintQ_shop_data") || "{}")
              .shopName || "Shop Owner"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="inline-flex items-center gap-3 rounded-2xl border border-border bg-surface px-3 py-2 text-sm text-text dark:border-border">
            <span className="text-xs uppercase tracking-[0.24em] text-text-muted">
              Status
            </span>
            <select
              value={status}
              onChange={handleStatusChange}
              className="rounded-xl border border-border bg-transparent px-2 py-1 text-sm text-text outline-none dark:border-border"
            >
              <option>OPEN</option>
              <option>CLOSED</option>
              <option>BUSY</option>
              <option>BREAK</option>
            </select>
          </label>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-surface text-text-muted transition hover:border-primary/50 hover:bg-primary-light/40 dark:border-border"
            aria-label="View notifications"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m0 0v1a3 3 0 006 0v-1m-6 0h6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface text-text transition hover:border-primary/50 hover:bg-primary-light/40 dark:border-border"
            aria-label="Shop owner profile"
          >
            <span className="font-semibold">S</span>
          </button>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
