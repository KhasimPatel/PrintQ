import { TRACKING_STATUSES, STATUS_LABELS } from "../../constants/order";
import { useOrder } from "../../context/OrderContext";
import SectionWrapper from "../../components/ui/SectionWrapper";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";

const statusVariant = {
  PENDING: "break",
  ACCEPTED: "open",
  PRINTING: "default",
  READY: "open",
  REJECTED: "busy",
  REFUND_INITIATED: "closed",
};

export default function OrderTrackingSection() {
  const { order, student } = useOrder();

  if (!order) {
    return (
      <SectionWrapper
        id="tracking"
        step="7"
        title="Order Tracking"
        description="Complete payment to track your order here."
      >
        <Card className="text-center text-sm text-text-muted">
          No active order yet. Your tracking timeline will appear after payment.
        </Card>
      </SectionWrapper>
    );
  }

  const currentStatus = order.status;
  const isRejected =
    currentStatus === "REJECTED" || currentStatus === "REFUND_INITIATED";
  const timeline = isRejected
    ? [
        "PENDING",
        "REJECTED",
        ...(currentStatus === "REFUND_INITIATED" ? ["REFUND_INITIATED"] : []),
      ]
    : TRACKING_STATUSES.filter((s) => s !== "REJECTED");

  const statusIndex = timeline.indexOf(currentStatus);

  return (
    <SectionWrapper
      id="tracking"
      step="7"
      title="Order Tracking"
      description="Track your order status in real time."
    >
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs text-text-muted">Order ID</p>
            <p className="text-lg font-bold text-text">{order.orderId}</p>
          </div>
          <Badge variant={statusVariant[currentStatus] || "default"}>
            {STATUS_LABELS[currentStatus] || currentStatus}
          </Badge>
        </div>

        <ol className="mt-6 space-y-0">
          {timeline.map((status, index) => {
            const done = index <= statusIndex;
            const active = index === statusIndex;

            return (
              <li key={status} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                      done
                        ? "bg-primary text-gray-900"
                        : "bg-hover text-text-muted"
                    } ${active ? "ring-2 ring-primary/40" : ""}`}
                  >
                    {done ? "✓" : index + 1}
                  </div>
                  {index < timeline.length - 1 && (
                    <div
                      className={`my-1 w-0.5 flex-1 min-h-[24px] ${
                        index < statusIndex ? "bg-primary" : "bg-border"
                      }`}
                    />
                  )}
                </div>
                <div className="pb-6 pt-1">
                  <p
                    className={`text-sm font-medium ${
                      done ? "text-text" : "text-text-muted"
                    }`}
                  >
                    {STATUS_LABELS[status]}
                  </p>
                  {status === "REJECTED" && order.rejectionReason && active && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                      Reason: {order.rejectionReason}
                    </p>
                  )}
                  {status === "REFUND_INITIATED" && active && (
                    <p className="mt-1 text-xs text-text-muted">
                      Refund initiated
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>

        {currentStatus === "READY" && (
          <div className="mt-2 rounded-xl border border-primary/30 bg-primary-light/40 p-4 dark:bg-primary-light/10">
            <p className="text-sm font-semibold text-text">
              Pickup Verification
            </p>
            <p className="mt-1 text-xs text-text-muted">
              Show these details at the shop counter:
            </p>
            <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs text-text-muted">Order ID</dt>
                <dd className="font-medium text-text">{order.orderId}</dd>
              </div>
              <div>
                <dt className="text-xs text-text-muted">Name</dt>
                <dd className="font-medium text-text">
                  {order.student?.fullName || student.name}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-text-muted">Mobile</dt>
                <dd className="font-medium text-text">
                  {order.student?.mobileNumber || student.mobileNumber}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-text-muted">College PRN</dt>
                <dd className="font-medium text-text">
                  {order.student?.prn || student.prn}
                </dd>
              </div>
            </dl>
          </div>
        )}
      </Card>
    </SectionWrapper>
  );
}
