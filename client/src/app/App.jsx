import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "../context/ThemeContext";
import { ToastProvider } from "../context/ToastContext";
import { OrderProvider } from "../context/OrderContext";
import AppRoutes from "./routes";

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  );
}
