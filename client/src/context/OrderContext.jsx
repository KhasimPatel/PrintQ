import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
import { REJECTION_REASONS } from "../constants/order";
import { calculatePricing } from "../utils/pricing";
import { isShopSelectable, getShopDisabledMessage } from "../utils/shopUtils";
import {
  initiateOrder,
  verifyPaymentOrder,
  trackOrder,
} from "../services/orderService";
import { listShops } from "../services/shopService";
import { useToast } from "./ToastContext";

const initialState = {
  selectedShopId: null,
  student: { name: "", mobileNumber: "", prn: "" },
  studentErrors: {},
  files: [],
  settings: {
    colorType: "bw",
    printMode: "single",
    copies: 1,
    isUrgent: false,
  },
  order: null,
  paymentLoading: false,
  uploadLoading: false,
  activeSection: "shop",
  shops: [],
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_SHOPS":
      return { ...state, shops: action.payload };
    case "SELECT_SHOP":
      return { ...state, selectedShopId: action.payload };
    case "SET_STUDENT":
      return {
        ...state,
        student: { ...state.student, ...action.payload },
        studentErrors: { ...state.studentErrors, ...action.errors },
      };
    case "SET_STUDENT_ERRORS":
      return { ...state, studentErrors: action.payload };
    case "ADD_FILE":
      return { ...state, files: [...state.files, action.payload] };
    case "REMOVE_FILE":
      return {
        ...state,
        files: state.files.filter((f) => f.id !== action.payload),
      };
    case "UPDATE_FILE":
      return {
        ...state,
        files: state.files.map((f) =>
          f.id === action.payload.id ? { ...f, ...action.payload } : f,
        ),
      };
    case "SET_SETTINGS":
      return { ...state, settings: { ...state.settings, ...action.payload } };
    case "SET_ORDER":
      return { ...state, order: action.payload };
    case "UPDATE_ORDER_STATUS":
      return {
        ...state,
        order: state.order
          ? { ...state.order, status: action.payload.status, ...action.payload }
          : null,
      };
    case "SET_PAYMENT_LOADING":
      return { ...state, paymentLoading: action.payload };
    case "SET_UPLOAD_LOADING":
      return { ...state, uploadLoading: action.payload };
    case "SET_ACTIVE_SECTION":
      return { ...state, activeSection: action.payload };
    case "RESET":
      return { ...initialState };
    default:
      return state;
  }
}

const OrderContext = createContext(null);

export function OrderProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { addToast } = useToast();
  const trackingIntervalRef = useRef(null);

  const selectedShop = useMemo(
    () => state.shops.find((s) => s.id === state.selectedShopId) ?? null,
    [state.selectedShopId, state.shops],
  );

  const totalPages = useMemo(
    () => state.files.reduce((sum, f) => sum + (f.pageCount || 0), 0),
    [state.files],
  );

  const pricing = useMemo(
    () =>
      calculatePricing({
        totalPages,
        copies: state.settings.copies,
        printMode: state.settings.printMode,
        colorType: state.settings.colorType,
        isUrgent: state.settings.isUrgent,
      }),
    [totalPages, state.settings],
  );

  const validateStudent = useCallback(() => {
    const errors = {};
    if (!state.student.name.trim()) errors.name = "Full name is required.";
    if (!/^\d{10}$/.test(state.student.mobileNumber)) {
      errors.mobileNumber = "Mobile number must be exactly 10 digits.";
    }
    if (!state.student.prn.trim()) errors.prn = "College PRN is required.";
    dispatch({ type: "SET_STUDENT_ERRORS", payload: errors });
    return Object.keys(errors).length === 0;
  }, [state.student]);

  const paymentBlockReason = useMemo(() => {
    if (!selectedShop) return "Please select a shop.";
    const shopMsg = getShopDisabledMessage(selectedShop);
    if (shopMsg) return shopMsg;
    if (!state.student.name.trim()) return "Please enter your full name.";
    if (!/^\d{10}$/.test(state.student.mobileNumber)) {
      return "Please enter a valid 10-digit mobile number.";
    }
    if (!state.student.prn.trim()) return "Please enter your college PRN.";
    if (state.files.length === 0) return "Please upload at least one file.";
    if (state.files.some((f) => f.uploadStatus === "uploading")) {
      return "Please wait for files to finish uploading.";
    }
    if (state.files.some((f) => f.uploadStatus === "error")) {
      return "Please remove or re-upload failed files.";
    }
    if (totalPages === 0) return "Page count could not be determined.";
    return null;
  }, [selectedShop, state.student, state.files, totalPages]);

  const canPay = !paymentBlockReason && !state.paymentLoading;

  // Load shops on mount, then refresh every 10s so status changes reflect live
  useEffect(() => {
    const loadShops = async () => {
      try {
        const res = await listShops();
        const shops = (res || []).map((shop) => ({
          ...shop,
          id: shop._id || shop._id,
        }));
        dispatch({ type: "SET_SHOPS", payload: shops });
      } catch (err) {
        addToast("Failed to load shops. Please refresh.", "error");
      }
    };

    loadShops();

    const interval = setInterval(loadShops, 10000);

    return () => clearInterval(interval);
  }, [addToast]);

  // Poll for order status updates
  useEffect(() => {
    if (!state.order) {
      if (trackingIntervalRef.current) {
        clearInterval(trackingIntervalRef.current);
        trackingIntervalRef.current = null;
      }
      return;
    }

    const pollOrderStatus = async () => {
      try {
        // const res = await trackOrder(state.order.id || state.order.orderId);
        const res = await trackOrder(state.order.orderId);
        dispatch({ type: "SET_ORDER", payload: res });
      } catch (err) {
        console.error("Failed to track order:", err);
      }
    };

    // Poll every 5 seconds
    pollOrderStatus(); // Poll immediately first
    trackingIntervalRef.current = setInterval(pollOrderStatus, 5000);

    return () => {
      if (trackingIntervalRef.current) {
        clearInterval(trackingIntervalRef.current);
        trackingIntervalRef.current = null;
      }
    };
  }, [state.order?.id, state.order?.orderId]);

  const handlePayment = useCallback(async () => {
    if (!validateStudent()) {
      addToast("Please fix student information errors.", "error");
      return;
    }
    if (!canPay) {
      addToast(paymentBlockReason || "Cannot proceed to payment.", "error");
      return;
    }

    dispatch({ type: "SET_PAYMENT_LOADING", payload: true });

    try {
      const formData = new FormData();
      formData.append("shopId", state.selectedShopId);
      formData.append("studentName", state.student.name.trim());
      formData.append("studentMobile", state.student.mobileNumber);
      formData.append("studentPrn", state.student.prn.trim());
      formData.append("printType", state.settings.colorType.toUpperCase());
      formData.append("printMode", state.settings.printMode.toUpperCase());
      formData.append("copies", String(state.settings.copies));
      formData.append("isUrgent", String(state.settings.isUrgent));

      state.files.forEach((file) => {
        if (file.file) {
          formData.append("files", file.file);
        }
      });

      const paymentData = await initiateOrder(formData);

      //BY-PASS RAZORPAY FOR TESTING
      // await loadRazorpayScript();
      // const verified = await openRazorpayCheckout(paymentData);
      // if (!verified) {
      //   dispatch({ type: "SET_PAYMENT_LOADING", payload: false });
      //   return;
      // }

      // const verifyRes = await verifyPaymentOrder({
      //   razorpayOrderId: paymentData.razorpayOrderId || null,
      //   razorpayPaymentId: paymentData.razorpayPaymentId || null,
      //   razorpaySignature: paymentData.razorpaySignature || null,
      // });

      const verifyRes = await verifyPaymentOrder({
        razorpayOrderId: paymentData.razorpayOrderId,
        razorpayPaymentId: "DEV_PAYMENT",
        razorpaySignature: "DEV_SIGNATURE",
      });

      const order = verifyRes.order || verifyRes;
      dispatch({ type: "SET_ORDER", payload: order });
      addToast("Payment successful! Order placed.", "success");

      setTimeout(() => {
        document
          .getElementById("tracking")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } catch (err) {
      addToast(err.message || "Payment failed. Please try again.", "error");
    } finally {
      dispatch({ type: "SET_PAYMENT_LOADING", payload: false });
    }
  }, [
    validateStudent,
    canPay,
    paymentBlockReason,
    totalPages,
    state,
    addToast,
  ]);

  useEffect(
    () => () => {
      if (trackingIntervalRef.current) {
        clearInterval(trackingIntervalRef.current);
      }
    },
    [],
  );

  const value = {
    ...state,
    selectedShop,
    totalPages,
    pricing,
    paymentBlockReason,
    canPay,
    dispatch,
    validateStudent,
    handlePayment,
    isShopSelectable,
  };

  return (
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
  );
}

export function useOrder() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrder must be used within OrderProvider");
  return ctx;
}

// function loadRazorpayScript() {
//   return new Promise((resolve, reject) => {
//     if (window.Razorpay) {
//       resolve();
//       return;
//     }
//     const script = document.createElement("script");
//     script.src = "https://checkout.razorpay.com/v1/checkout.js";
//     script.onload = resolve;
//     script.onerror = () => reject(new Error("Failed to load Razorpay."));
//     document.body.appendChild(script);
//   });
// }

// function openRazorpayCheckout(paymentData) {
//   return new Promise((resolve) => {
//     const options = {
//       key: paymentData.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID,
//       amount: paymentData.amountPaise,
//       currency: paymentData.currency,
//       order_id: paymentData.razorpayOrderId,
//       name: "PrintQ",
//       description: "Print Order Payment",
//       handler: (response) => {
//         paymentData.razorpayPaymentId = response.razorpay_payment_id;
//         paymentData.razorpaySignature = response.razorpay_signature;
//         resolve(true);
//       },
//       modal: {
//         ondismiss: () => resolve(false),
//       },
//       theme: { color: "#EAB308" },
//     };

//     const rzp = new window.Razorpay(options);
//     rzp.open();
//   });
// }
