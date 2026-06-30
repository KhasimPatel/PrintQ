import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginShopOwner, registerShopOwner } from "../../services/shopService";

/**
 * useAuth – handles login & registration logic.
 * Returns { login, register, loading }.
 */
export function useAuth() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    /**
     * Login handler
     * @param {{ email: string, password: string, rememberMe: boolean }} data
     */
    const login = async ({ email, password, rememberMe }) => {
        setLoading(true);
        try {
            const response = await loginShopOwner({ email, password });
            localStorage.setItem("PrintQ_shop_data", JSON.stringify(response.shop));
            if (rememberMe) {
                localStorage.setItem("PrintQ_remember_email", email);
            } else {
                localStorage.removeItem("PrintQ_remember_email");
            }

            // console.log("✅ PrintQ Login Response:", response);
            navigate("/shop");
            return { success: true };
        } catch (error) {
            const message = error?.message || "Login failed. Please try again.";
            console.error("❌ Login error:", error);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    };

    /**
     * Register handler
     * @param {Object} formData
     */
    const register = async (formData) => {
        setLoading(true);
        try {
            const payload = {
                ownerName: formData.ownerName,
                shopName: formData.shopName,
                email: formData.email,
                mobile: formData.mobile,
                address: formData.address,
                password: formData.password,
            };

            //   const response = await authService.register(payload);
            const response = await registerShopOwner(formData);
            // console.log("✅ PrintQ Register Response:", response);
            return true;
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                error?.message ||
                "Registration failed. Please try again.";
            console.error("❌ Register error:", error?.response?.data || error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { login, register, loading };
}
