const defaultItems = [
  { label: "Today's Orders", value: "0", note: "View all" },
  { label: "Pending Orders", value: "0", note: "View all" },
  { label: "Rejected Orders", value: "0", note: "View all" },
  { label: "Ready Orders", value: "0", note: "View all" },
  { label: "Today's Revenue", value: "₹ 0.00", note: "View all" },
];

export default function DashboardSummary({
  summaryItems = defaultItems,
  onSelectView,
}) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {summaryItems.map((item) => (
        <button
          key={item.label}
          type="button"
          onClick={() => item.view && onSelectView?.(item.view)}
          className="rounded-3xl border border-border bg-surface p-5 text-left text-text shadow-[0_12px_32px_rgba(15,23,42,0.04)] transition hover:border-primary/50 hover:bg-hover dark:border-border"
        >
          <p className="text-sm font-medium text-text-muted">{item.label}</p>
          <p className="mt-4 text-3xl font-semibold text-text">{item.value}</p>
          <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-primary-dark">
            {item.note}
          </p>
        </button>
      ))}
    </section>
  );
}
