import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";
import AuthCard from "../../components/auth/AuthCard";
import AuthInput from "../../components/auth/AuthInput";
import PasswordInput from "../../components/auth/PasswordInput";
import AuthButton from "../../components/auth/AuthButton";
import { useAuth } from "../../components/auth/useAuth";

function validate(fields) {
  const errors = {};
  if (!fields.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    errors.email = "Enter a valid email address.";
  }
  if (!fields.password) {
    errors.password = "Password is required.";
  }
  return errors;
}

export default function Login() {
  const { login, loading } = useAuth();

  const [fields, setFields] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState("");
  const [touched, setTouched] = useState({});

  // Restore remembered email
  useEffect(() => {
    const saved = localStorage.getItem("PrintQ_remember_email");
    if (saved)
      setFields((prev) => ({ ...prev, email: saved, rememberMe: true }));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setFields((prev) => ({ ...prev, [name]: val }));
    if (touched[name]) {
      const updated = { ...fields, [name]: val };
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
    setTouched({ email: true, password: true });
    const errs = validate(fields);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoginError("");
    const result = await login(fields);
    if (!result.success) {
      setLoginError(result.message);
    }
  };

  return (
    <AuthLayout>
      <AuthCard
        title="Welcome back"
        subtitle="Sign in to your PrintQ shop account"
      >
        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-5"
        >
          {/* Email */}
          <AuthInput
            label="Email address"
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={fields.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.email}
          />

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <PasswordInput
              label="Password"
              id="password"
              name="password"
              placeholder="••••••••"
              value={fields.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.password}
            />
            {/* Forgot Password link */}
            <div className="flex justify-end mt-0.5">
              <button
                type="button"
                className="text-xs font-medium transition-colors"
                style={{ color: "#EAB308" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#CA8A04")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#EAB308")}
                onClick={() =>
                  alert("Forgot password flow — integrate with your backend.")
                }
              >
                Forgot password?
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              name="rememberMe"
              checked={fields.rememberMe}
              onChange={handleChange}
              className="rounded"
              style={{ accentColor: "#EAB308", width: 15, height: 15 }}
            />
            <span className="text-sm" style={{ color: "#4B5563" }}>
              Remember me
            </span>
          </label>

          {/* Submit */}
          <AuthButton loading={loading}>Sign in</AuthButton>
        </form>

        {loginError && (
          <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-200">
            {loginError}
          </p>
        )}

        {/* Divider */}
        <div className="mt-7 pt-6" style={{ borderTop: "1px solid #F3F4F6" }}>
          <p className="text-center text-sm" style={{ color: "#6B7280" }}>
            Don't have an account?{" "}
            <Link
              to="/shop/signup"
              className="font-semibold transition-colors"
              style={{ color: "#EAB308" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#CA8A04")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#EAB308")}
            >
              Sign up
            </Link>
          </p>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}
