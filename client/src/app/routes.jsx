import { Routes, Route } from "react-router-dom";
import { OrderProvider } from "../context/OrderContext";
import LandingPage from "../pages/LandingPage";
import StudentDashboard from "../pages/StudentDashboard";
import ShopDashboard from "../pages/ShopDashboard";
import Login from "../pages/AuthPage/Login";
import Signup from "../pages/AuthPage/Signup";
import ProtectedShopRoute from "../components/auth/ProtectedShopRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route
        path="/student"
        element={
          <OrderProvider>
            <StudentDashboard />
          </OrderProvider>
        }
      />

      {/* New auth routes */}
      <Route path="/shop/login" element={<Login />} />
      <Route path="/shop/signup" element={<Signup />} />

      {/* Protected shop dashboard */}
      <Route
        path="/shop"
        element={
          <ProtectedShopRoute>
            <ShopDashboard />
          </ProtectedShopRoute>
        }
      />
    </Routes>
  );
}
