const statusLabelMap = {
  INCOMING: "Incoming",
  PENDING: "Pending",
  REJECTED: "Rejected",
  READY: "Ready",
  COMPLETED: "Completed",
};

function renderOrderRow(order, actions) {
  return (
    <div
      key={order.id}
      className="grid gap-4 px-5 py-4 md:grid-cols-[1.5fr_1fr_1fr_1.1fr] lg:grid-cols-[1.5fr_1fr_1fr_1fr]"
    >
      <div>
        <p className="text-sm font-semibold text-text">{order.orderId}</p>
        <p className="mt-1 text-xs text-text-muted">{order.time}</p>
        {order.files && order.files.length > 0 && (
          <div className="mt-2 flex flex-col gap-1">
            {order.files.map((file, idx) => (
              <a
                key={idx}
                href={`https://docs.google.com/viewer?url=${encodeURIComponent(file.fileUrl)}&embedded=false`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium transition-colors"
                style={{ color: "#EAB308" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#CA8A04")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#EAB308")}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                {file.fileName || `File ${idx + 1}`}
              </a>
            ))}
          </div>
        )}
      </div>
      <div>
        <p className="text-sm font-semibold text-text">{order.customer}</p>
        <p className="mt-1 text-xs text-text-muted">
          PRN: {order.prn} · {order.phone}
        </p>
      </div>
      <div>
        <p className="text-sm font-semibold text-text">{order.details}</p>
        <p className="mt-1 text-xs text-text-muted">
          Amount: ₹ {Number(order.amount).toFixed(2)}
        </p>
      </div>
      <div className="flex flex-col items-start gap-2 sm:items-end">
        <div className="rounded-full border border-primary/20 bg-primary-light px-3 py-1 text-xs font-semibold text-primary-dark">
          {statusLabelMap[order.status] || order.status}
        </div>
        {actions && (
          <div className="flex flex-wrap gap-2">{actions(order)}</div>
        )}
        {order.rejectionReason && (
          <p className="text-xs text-text-muted">
            Reason: {order.rejectionReason}
          </p>
        )}
      </div>
    </div>
  );
}

export default function OrdersTable({
  orders = [],
  selectedView = "INCOMING",
  onAccept,
  onReject,
  onReady,
  onComplete,
}) {
  const incomingOrders = orders.filter((order) => order.status === "INCOMING");
  const pendingOrders = orders.filter((order) => order.status === "PENDING");
  const rejectedOrders = orders.filter((order) => order.status === "REJECTED");
  const readyOrders = orders.filter((order) => order.status === "READY");
  const completedOrders = orders.filter(
    (order) => order.status === "COMPLETED",
  );

  const sections = [
    {
      key: "INCOMING",
      title: "Incoming Orders",
      items: incomingOrders,
      actions: (order) => (
        <>
          <button
            type="button"
            onClick={() => onAccept(order.id)}
            className="rounded-2xl border border-primary/20 bg-primary-light px-3 py-2 text-sm font-semibold text-primary-dark transition hover:bg-primary-light/90"
          >
            Accept
          </button>
          <button
            type="button"
            onClick={() => onReject(order.id)}
            className="rounded-2xl border border-border bg-surface px-3 py-2 text-sm font-semibold text-text transition hover:bg-hover dark:border-border"
          >
            Reject
          </button>
        </>
      ),
    },
    {
      key: "PENDING",
      title: "Pending Orders",
      items: pendingOrders,
      actions: (order) => (
        <button
          type="button"
          onClick={() => onReady(order.id)}
          className="rounded-2xl border border-primary/20 bg-primary-light px-3 py-2 text-sm font-semibold text-primary-dark transition hover:bg-primary-light/90"
        >
          Mark Ready
        </button>
      ),
    },
    {
      key: "REJECTED",
      title: "Rejected Orders",
      items: rejectedOrders,
      actions: null,
    },
    {
      key: "READY",
      title: "Ready Orders",
      items: readyOrders,
      actions: (order) => (
        <button
          type="button"
          onClick={() => onComplete(order.id)}
          className="rounded-2xl border border-primary/20 bg-primary-light px-3 py-2 text-sm font-semibold text-primary-dark transition hover:bg-primary-light/90"
        >
          Mark Completed
        </button>
      ),
    },
    {
      key: "COMPLETED",
      title: "Completed Orders",
      items: completedOrders,
      actions: null,
    },
  ];

  const activeSection =
    sections.find((section) => section.key === selectedView) || sections[0];

  return (
    <section className="overflow-hidden rounded-4xl border border-border bg-surface shadow-[0_12px_32px_rgba(15,23,42,0.04)] dark:border-border">
      <div className="border-b border-border px-5 py-4 dark:border-border">
        <h2 className="text-lg font-semibold text-text">
          {activeSection.title}
        </h2>
      </div>
      <div className="divide-y divide-border dark:divide-border">
        {activeSection.items.length > 0 ? (
          activeSection.items.map((order) =>
            renderOrderRow(order, activeSection.actions),
          )
        ) : (
          <div className="px-5 py-4 text-sm text-text-muted">
            No orders in this stage.
          </div>
        )}
      </div>
      <div className="border-t border-border px-5 py-4 text-sm text-text-muted dark:border-border">
        Order updates are reflected instantly in the dashboard summary.
      </div>
    </section>
  );
}
