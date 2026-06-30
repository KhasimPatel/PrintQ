import StudentHeader from "../../components/layout/StudentHeader";
import OrderStepper from "../../features/orders/OrderStepper";
import ShopSection from "../../features/shops/ShopSection";
import StudentInfoSection from "../../features/student/StudentInfoSection";
import UploadSection from "../../features/upload/UploadSection";
import PrintSettingsSection from "../../features/print-settings/PrintSettingsSection";
import PriceSummarySection from "../../features/pricing/PriceSummarySection";
import PaymentSection from "../../features/payment/PaymentSection";
import OrderTrackingSection from "../../features/orders/OrderTrackingSection";
import ToastContainer from "../../components/ui/ToastContainer";

export default function StudentDashboard() {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <StudentHeader />
      <OrderStepper />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6 md:px-6 md:py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-text md:text-3xl">
            Place Your Print Order
          </h1>
          <p className="mt-1.5 text-sm text-text-muted">
            Complete all steps below on this single page — no redirects needed.
          </p>
        </div>

        <div className="space-y-10 md:space-y-12">
          <ShopSection />
          <StudentInfoSection />
          <UploadSection />
          <PrintSettingsSection />
          <PriceSummarySection />
          <PaymentSection />
          <OrderTrackingSection />
        </div>
      </main>

      <ToastContainer />
    </div>
  );
}
