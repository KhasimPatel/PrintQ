import { Navigate } from "react-router-dom";
import { getAuthToken } from "../../services/api";

export default function ProtectedShopRoute({ children }) {
  const token = getAuthToken();

  if (!token) {
    return <Navigate to="/shop/login" replace />;
  }

  return children;
}
