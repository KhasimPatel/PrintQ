import { useOrder } from "../../context/OrderContext";
import SectionWrapper from "../../components/ui/SectionWrapper";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

export default function PaymentSection() {
  const {
    pricing,
    paymentBlockReason,
    canPay,
    paymentLoading,
    order,
    handlePayment,
  } = useOrder();

  if (order) {
    return (
      <SectionWrapper
        id="payment"
        step="6"
        title="Payment"
        description="Your order has been placed successfully."
      >
        <Card className="border border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
          <p className="text-sm font-medium text-green-800 dark:text-green-300">
            Payment of ₹{order.price ?? pricing.totalPrice} received. Order{" "}
            <span className="font-bold">{order.orderId}</span> is being
            processed.
          </p>
        </Card>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper
      id="payment"
      step="6"
      title="Payment"
      description="Pay securely to place your print order."
    >
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-text-muted">Amount to pay</p>
            <p className="text-3xl font-bold text-text">
              ₹{pricing.totalPrice}
            </p>
          </div>
          <div className="rounded-xl bg-primary-light px-3 py-2 text-xs font-medium text-primary-dark">
            Razorpay Test
          </div>
        </div>

        {paymentBlockReason && (
          <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
            {paymentBlockReason}
          </p>
        )}

        <Button
          className="mt-6 w-full"
          size="lg"
          disabled={!canPay}
          onClick={handlePayment}
        >
          {paymentLoading ? "Processing…" : `Pay ₹${pricing.totalPrice}`}
        </Button>

        <p className="mt-3 text-center text-xs text-text-muted">
          Mock payments enabled when Razorpay keys are not configured.
        </p>
      </Card>
    </SectionWrapper>
  );
}
