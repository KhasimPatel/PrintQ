export default function QuickActions() {
  return (
    <section className="rounded-4xl border border-border bg-surface p-6 shadow-[0_12px_32px_rgba(15,23,42,0.04)] dark:border-border">
      <h2 className="text-lg font-semibold text-text">Quick Actions</h2>
      <div className="mt-5 space-y-4">
        <button className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-left text-sm font-semibold text-text transition hover:bg-hover dark:border-border">
          Change Shop Status
        </button>
        <button className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-left text-sm font-semibold text-text transition hover:bg-hover dark:border-border">
          View Completed Orders
        </button>
        <button className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-left text-sm font-semibold text-text transition hover:bg-hover dark:border-border">
          View Revenue
        </button>
      </div>
      <div className="mt-6 rounded-3xl border border-border bg-surface p-4 dark:border-border">
        <p className="text-sm font-medium text-text-muted">Current Status</p>
        <div className="mt-3 rounded-2xl border border-border bg-background px-4 py-3 text-center text-sm font-semibold text-text dark:border-border">
          OPEN
        </div>
        <div className="mt-4 grid gap-3 text-sm text-text-muted">
          <div className="flex justify-between">
            <span>Queue</span>
            <span>5 / 20</span>
          </div>
          <div className="flex justify-between">
            <span>Open Time</span>
            <span>09:00 AM</span>
          </div>
          <div className="flex justify-between">
            <span>Close Time</span>
            <span>08:00 PM</span>
          </div>
        </div>
      </div>
    </section>
  );
}
