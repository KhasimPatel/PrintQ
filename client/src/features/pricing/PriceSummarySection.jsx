import { useOrder } from "../../context/OrderContext";
import SectionWrapper from "../../components/ui/SectionWrapper";
import Card from "../../components/ui/Card";

function Row({ label, value, highlight = false }) {
  return (
    <div className="flex items-center justify-between py-2 text-sm">
      <span className="text-text-muted">{label}</span>
      <span
        className={`font-medium ${highlight ? "text-lg font-bold text-primary-dark" : "text-text"}`}
      >
        {value}
      </span>
    </div>
  );
}

export default function PriceSummarySection() {
  const { totalPages, settings, pricing } = useOrder();

  const printTypeLabel =
    settings.colorType === "color" ? "Color" : "Black & White";
  const printModeLabel =
    settings.printMode === "double" ? "Double Side" : "Single Side";
  const rateLabel = settings.colorType === "color" ? "₹5" : "₹2";

  return (
    <SectionWrapper
      id="pricing"
      step="5"
      title="Live Price Summary"
      description="Price updates instantly as you change settings."
    >
      <Card>
        <Row label="Total Pages" value={totalPages} />
        <Row label="Copies" value={settings.copies} />
        <Row label="Print Type" value={printTypeLabel} />
        <Row label="Print Mode" value={printModeLabel} />
        <Row label="Rate per Sheet" value={`${rateLabel} / sheet`} />
        <Row label="Total Sheets" value={pricing.sheets} />

        <div className="my-2 border-t border-border" />

        <Row label="Base Cost" value={`₹${pricing.basePrice}`} />
        <Row
          label="Urgent Cost"
          value={settings.isUrgent ? `₹${pricing.urgentPrice}` : "₹0"}
        />

        <div className="my-2 border-t border-border" />

        <Row label="Final Amount" value={`₹${pricing.totalPrice}`} highlight />

        <p className="mt-4 rounded-lg bg-primary-light/50 px-3 py-2 text-xs text-text-muted dark:bg-primary-light/20">
          {settings.printMode === "double"
            ? `Sheets = ceil(${totalPages} / 2) × ${settings.copies} = ${pricing.sheets}`
            : `Sheets = ${totalPages} × ${settings.copies} = ${pricing.sheets}`}
          {" · "}
          Base = {pricing.sheets} × {rateLabel.replace("₹", "")} = ₹
          {pricing.basePrice}
          {settings.isUrgent &&
            ` · Urgent = ${pricing.sheets} × ₹1 = ₹${pricing.urgentPrice}`}
        </p>
      </Card>
    </SectionWrapper>
  );
}
