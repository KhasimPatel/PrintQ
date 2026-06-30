const viewTitles = {
  INCOMING: "Incoming Orders",
  PENDING: "Pending Orders",
  REJECTED: "Rejected Orders",
  READY: "Ready Orders",
  COMPLETED: "Completed Orders",
};

export default function ShopSearchPanel({
  selectedView = "INCOMING",
  searchQuery = "",
  onSearchChange,
}) {
  return (
    <section className="rounded-4xl border border-border bg-surface p-6 shadow-[0_12px_32px_rgba(15,23,42,0.04)] dark:border-border">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-text">
            {viewTitles[selectedView] || "Orders"}
          </h2>
          <p className="mt-1 text-sm text-text-muted">
            Search by Order ID, Name, or PRN.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-2xl border border-border bg-surface px-4 py-2 text-sm font-semibold text-text transition hover:border-primary/50 hover:bg-primary-light/10 dark:border-border">
          <span>Filters</span>
        </button>
      </div>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1 rounded-2xl border border-border bg-background/80 px-4 py-3 dark:border-border">
          <label className="sr-only" htmlFor="shop-search">
            Search orders
          </label>
          <input
            id="shop-search"
            type="search"
            placeholder="Search by order ID, name, PRN"
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="w-full bg-transparent text-sm text-text placeholder:text-text-muted outline-none"
          />
        </div>
        <button className="inline-flex items-center gap-2 rounded-2xl border border-border bg-surface px-4 py-3 text-sm font-semibold text-text transition hover:border-primary/50 hover:bg-primary-light/10 dark:border-border">
          Search
        </button>
      </div>
    </section>
  );
}
