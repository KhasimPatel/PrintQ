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
