import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";
import AuthCard from "../../components/auth/AuthCard";
import AuthInput from "../../components/auth/AuthInput";
import PasswordInput from "../../components/auth/PasswordInput";
import AuthButton from "../../components/auth/AuthButton";
import { useAuth } from "../../components/auth/useAuth";

function validate(fields) {
  const errors = {};

  if (!fields.ownerName.trim()) errors.ownerName = "Owner name is required.";
  if (!fields.shopName.trim()) errors.shopName = "Shop name is required.";

  if (!fields.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!fields.mobile.trim()) {
    errors.mobile = "Mobile number is required.";
  } else if (!/^\d{10}$/.test(fields.mobile)) {
    errors.mobile = "Mobile must be exactly 10 digits.";
  }

  if (!fields.address.trim()) errors.address = "Shop address is required.";

  if (!fields.password) {
    errors.password = "Password is required.";
  } else if (fields.password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }

  if (!fields.confirmPassword) {
    errors.confirmPassword = "Please confirm your password.";
  } else if (fields.password !== fields.confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
}

const INITIAL = {
  ownerName: "",
  shopName: "",
  email: "",
  mobile: "",
  address: "",
  password: "",
  confirmPassword: "",
};

export default function Signup() {
  const { register: registerShop, loading } = useAuth();

  const [fields, setFields] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const updated = { ...fields, [name]: value };
      const errs = validate(updated);
      setErrors((prev) => ({ ...prev, [name]: errs[name] }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const errs = validate(fields);
    setErrors((prev) => ({ ...prev, [name]: errs[name] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const allTouched = Object.keys(INITIAL).reduce(
      (acc, k) => ({ ...acc, [k]: true }),
      {},
    );
    setTouched(allTouched);
    const errs = validate(fields);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitError("");
    const result = await registerShop(fields);
    if (result.success) {
      setSubmittedSuccess(true);
    } else if (result.message) {
      setSubmitError(result.message);
    }
  };

  const field = (name) => ({
    name,
    value: fields[name],
    onChange: handleChange,
    onBlur: handleBlur,
    error: errors[name],
  });

  return (
    <AuthLayout>
      <div className="w-full max-w-md">
        {/* Card header outside card for sticky feel */}
        <div
          className="bg-white rounded-2xl px-8 py-9"
          style={{
            boxShadow:
              "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)",
            border: "1px solid #E5E7EB",
          }}
        >
          {/* Title */}
          <div className="mb-7">
            <h1
              className="text-2xl font-bold"
              style={{ color: "#1F2937", letterSpacing: "-0.01em" }}
            >
              Create your shop
            </h1>
            <p className="mt-1 text-sm" style={{ color: "#6B7280" }}>
              Register as a PrintQ shop owner. Admin approval required.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col gap-5"
          >
            {/* Row: Owner Name */}
            <AuthInput
              label="Owner name"
              id="ownerName"
              placeholder="Rahul Sharma"
              {...field("ownerName")}
            />

            {/* Row: Shop Name */}
            <AuthInput
              label="Shop name"
              id="shopName"
              placeholder="Sharma Print Works"
              {...field("shopName")}
            />

            {/* Row: Email */}
            <AuthInput
              label="Email address"
              id="email"
              type="email"
              placeholder="you@example.com"
              {...field("email")}
            />

            {/* Row: Mobile */}
            <AuthInput
              label="Mobile number"
              id="mobile"
              type="tel"
              placeholder="10-digit mobile number"
              maxLength={10}
              {...field("mobile")}
            />

            {/* Row: Address */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="address"
                className="text-sm font-medium"
                style={{ color: "#374151" }}
              >
                Shop address
              </label>
              <textarea
                id="address"
                name="address"
                rows={2}
                placeholder="Shop No. 4, MG Road, Pune – 411001"
                value={fields.address}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full rounded-xl px-4 py-2.5 text-sm outline-none resize-none transition-all duration-150"
                style={{
                  border: errors.address
                    ? "1.5px solid #EF4444"
                    : "1.5px solid #E5E7EB",
                  color: "#1F2937",
                  fontFamily: "'Outfit', sans-serif",
                }}
                onFocus={(e) => {
                  e.target.style.border = "1.5px solid #EAB308";
                  e.target.style.boxShadow = "0 0 0 3px rgba(234,179,8,0.12)";
                }}
                onBlur2={(e) => {
                  e.target.style.border = errors.address
                    ? "1.5px solid #EF4444"
                    : "1.5px solid #E5E7EB";
                  e.target.style.boxShadow = "none";
                }}
              />
              {errors.address && (
                <p className="text-xs" style={{ color: "#EF4444" }}>
                  {errors.address}
                </p>
              )}
            </div>

            {/* Divider */}
            <div style={{ borderTop: "1px solid #F3F4F6" }} className="pt-1" />

            {/* Password */}
            <PasswordInput
              label="Password"
              id="password"
              placeholder="Min. 8 characters"
              {...field("password")}
            />

            {/* Confirm Password */}
            <PasswordInput
              label="Confirm password"
              id="confirmPassword"
              placeholder="Re-enter password"
              {...field("confirmPassword")}
            />

            {/* Submit */}
            <AuthButton loading={loading}>Create account</AuthButton>
          </form>

          {submittedSuccess && (
            <p className="mt-4 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700 border border-green-200">
              Registration submitted successfully. Please wait for Admin
              approval.
            </p>
          )}
          {submitError && (
            <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-200">
              {submitError}{" "}
              <Link
                to="/shop/login"
                className="font-semibold underline"
                style={{ color: "#EAB308" }}
              >
                Please sign in.
              </Link>
            </p>
          )}

          {/* Bottom link */}
          <div className="mt-7 pt-6" style={{ borderTop: "1px solid #F3F4F6" }}>
            <p className="text-center text-sm" style={{ color: "#6B7280" }}>
              Already have an account?{" "}
              <Link
                to="/shop/login"
                className="font-semibold transition-colors"
                style={{ color: "#EAB308" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#CA8A04")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#EAB308")}
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
