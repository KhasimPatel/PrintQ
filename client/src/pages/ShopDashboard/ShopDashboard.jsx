import { useCallback, useEffect, useState } from "react";
import ShopOwnerHeader from "../../components/layout/ShopOwnerHeader";
import DashboardSummary from "../../components/shopowner/DashboardSummary";
import OrdersTable from "../../components/shopowner/OrdersTable";
import ShopSidebar from "../../components/shopowner/ShopSidebar";
import ShopSearchPanel from "../../components/shopowner/ShopNotifications";
import { getAuthToken } from "../../services/api";
import {
  listShopOrders,
  getShopDashboardSummary,
  acceptOrder as apiAcceptOrder,
  rejectOrder as apiRejectOrder,
  markOrderReady as apiMarkOrderReady,
  markOrderCompleted as apiMarkOrderCompleted,
} from "../../services/shopService";

// The backend's real Order.status values and this dashboard's existing
// local labels ("INCOMING", "PENDING", ...) are NOT the same vocabulary --
// confirmed directly from OrdersTable.jsx's statusLabelMap and section
// filters, which were already written against "INCOMING"/"PENDING"/etc.
// before this integration. Rather than touch OrdersTable, ShopSidebar, or
// DashboardSummary (none of which need to change), this single mapping
// translates backend -> frontend-local status at the data boundary, here,
// so every existing component keeps working exactly as already written.
//
//   backend PENDING   (not yet accepted)        -> frontend "INCOMING"
//   backend ACCEPTED  (accepted, in the queue)   -> frontend "PENDING"
//   backend READY / REJECTED / COMPLETED        -> unchanged, names match
const BACKEND_TO_LOCAL_STATUS = {
  PENDING: "INCOMING",
  ACCEPTED: "PENDING",
  READY: "READY",
  REJECTED: "REJECTED",
  COMPLETED: "COMPLETED",
  REFUND_INITIATED: "REJECTED",
};

// Maps one real Order document (from the backend) into the flat shape
// OrdersTable.jsx already expects (order.id, order.customer, order.details,
// order.prn, order.phone, etc.) -- OrdersTable itself is untouched.
//
// IMPORTANT: OrdersTable.jsx calls onAccept(order.id), onReject(order.id),
// etc. (existing code, unmodified) -- and the backend's PATCH
// /orders/:id/accept (and /reject, /ready, /complete) all look the order
// up by Mongo _id, not by the human-readable orderId string. So order.id
// here MUST be the Mongo _id, or every action button fails. The
// human-readable "ORD-2026-0001" is kept on order.orderId instead, in case
// OrdersTable's display label is ever changed to show it -- that's a
// one-line swap inside OrdersTable.jsx itself if wanted, not done here.
function mapOrderForDashboard(order) {
  const totalPages = (order.files || []).reduce(
    (sum, f) => sum + (f.pageCount || 0),
    0,
  );
  const copies = order.printConfig?.copies ?? 1;
  const printType = order.printConfig?.printType === "COLOR" ? "Color" : "B/W";
  const printMode =
    order.printConfig?.printMode === "DOUBLE" ? "Double" : "Single";

  return {
    id: order._id, // Mongo _id -- required by the action endpoints OrdersTable calls
    orderId: order.orderId, // human-readable "ORD-2026-0001", available if the display label is ever swapped
    customer: order.student?.fullName || "Unknown",
    prn: order.student?.prn || "",
    phone: order.student?.mobileNumber || "",
    time: order.createdAt
      ? new Date(order.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "",
    details: `${totalPages} pages - ${copies} cop${copies === 1 ? "y" : "ies"} - ${printType} - ${printMode}`,
    amount: order.priceSummary?.totalPrice ?? 0,
    status: BACKEND_TO_LOCAL_STATUS[order.status] || order.status,
    rejectionReason: order.rejectionReason || null,
  };
}

export default function ShopDashboard() {
  const [orders, setOrders] = useState([]);
  const [summary, setSummary] = useState(null);
  const [selectedOrderView, setSelectedOrderView] = useState("INCOMING");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shopData, setShopData] = useState(() =>
    JSON.parse(localStorage.getItem("PrintQ_shop_data") || "{}"),
  );

  const loadDashboardData = useCallback(async () => {
    try {
      setError(null);
      const [activeOrders, completedOrders, rejectedOrders, summaryRes] =
        await Promise.all([
          listShopOrders(),
          listShopOrders("COMPLETED"),
          listShopOrders("REJECTED"),
          getShopDashboardSummary(),
        ]);

      const allOrders = [
        ...activeOrders,
        ...completedOrders,
        ...rejectedOrders,
      ].map(mapOrderForDashboard);
      setOrders(allOrders);
      setSummary(summaryRes);
    } catch (err) {
      setError(err.message || "Failed to load dashboard data.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!getAuthToken()) {
      setError(
        "Not logged in as a shop owner. Please log in to view the dashboard.",
      );
      setIsLoading(false);
      return;
    }
    loadDashboardData();
  }, [loadDashboardData]);

  useEffect(() => {
    const handleStatusUpdate = () => {
      const updated = JSON.parse(
        localStorage.getItem("PrintQ_shop_data") || "{}",
      );
      setShopData(updated);
    };
    window.addEventListener("shop-status-updated", handleStatusUpdate);
    return () =>
      window.removeEventListener("shop-status-updated", handleStatusUpdate);
  }, []);

  const filteredOrders = orders.filter((order) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      order.orderId?.toLowerCase().includes(q) ||
      order.customer?.toLowerCase().includes(q) ||
      order.prn?.toLowerCase().includes(q)
    );
  });

  const summaryItems = summary
    ? [
        {
          label: "Today's Orders",
          value: String(summary.todaysOrdersCount),
          note: `${summary.todaysOrdersCount} today`,
          view: "INCOMING",
        },
        {
          label: "Pending Orders",
          value: String(summary.pendingCount),
          note: "View all",
          view: "PENDING",
        },
        {
          label: "Rejected Orders",
          value: String(summary.rejectedCount),
          note: "View all",
          view: "REJECTED",
        },
        {
          label: "Ready Orders",
          value: String(summary.readyCount),
          note: "View all",
          view: "READY",
        },
        {
          label: "Today's Revenue",
          value: `Rs. ${Number(summary.todaysRevenue).toFixed(2)}`,
          note: `${summary.completedTodayCount} completed`,
          view: "COMPLETED",
        },
      ]
    : undefined;

  const handleAcceptOrder = async (id) => {
    try {
      await apiAcceptOrder(id);
      await loadDashboardData();
    } catch (err) {
      setError(err.message || "Failed to accept order.");
    }
  };

  const handleRejectOrder = async (id) => {
    const reason = window.prompt("Enter rejection reason");
    if (!reason || !reason.trim()) return;
    try {
      await apiRejectOrder(id, reason.trim());
      await loadDashboardData();
    } catch (err) {
      setError(err.message || "Failed to reject order.");
    }
  };

  const handleMarkReady = async (id) => {
    try {
      await apiMarkOrderReady(id);
      await loadDashboardData();
    } catch (err) {
      setError(err.message || "Failed to mark order ready.");
    }
  };

  const handleMarkCompleted = async (id) => {
    try {
      await apiMarkOrderCompleted(id);
      await loadDashboardData();
    } catch (err) {
      setError(err.message || "Failed to mark order completed.");
    }
  };

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <ShopOwnerHeader />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 md:px-6 md:py-8">
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
          <ShopSidebar
            activeOrderView={selectedOrderView}
            onSelectOrderView={setSelectedOrderView}
            shopStatus={shopData.status}
            queueCount={shopData.queueCount}
            maxQueueCount={shopData.maxQueueCount}
            openingTime={shopData.openingTime}
            closingTime={shopData.closingTime}
            onTimingsUpdated={() => {
              const updated = JSON.parse(
                localStorage.getItem("PrintQ_shop_data") || "{}",
              );
              setShopData(updated);
            }}
          />

          <div className="space-y-6">
            <DashboardSummary
              summaryItems={summaryItems}
              onSelectView={setSelectedOrderView}
            />
            <ShopSearchPanel
              selectedView={selectedOrderView}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
            {!isLoading && (
              <OrdersTable
                orders={filteredOrders}
                selectedView={selectedOrderView}
                onAccept={handleAcceptOrder}
                onReject={handleRejectOrder}
                onReady={handleMarkReady}
                onComplete={handleMarkCompleted}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
