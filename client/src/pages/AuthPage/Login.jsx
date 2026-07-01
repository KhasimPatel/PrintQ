// import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import AuthLayout from "../../components/auth/AuthLayout";
// import AuthCard from "../../components/auth/AuthCard";
// import AuthInput from "../../components/auth/AuthInput";
// import PasswordInput from "../../components/auth/PasswordInput";
// import AuthButton from "../../components/auth/AuthButton";
// import { useAuth } from "../../components/auth/useAuth";

// function validate(fields) {
//   const errors = {};
//   if (!fields.email.trim()) {
//     errors.email = "Email is required.";
//   } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
//     errors.email = "Enter a valid email address.";
//   }
//   if (!fields.password) {
//     errors.password = "Password is required.";
//   }
//   return errors;
// }

// export default function Login() {
//   const { login, loading } = useAuth();

//   const [fields, setFields] = useState({
//     email: "",
//     password: "",
//     rememberMe: false,
//   });
//   const [errors, setErrors] = useState({});
//   const [loginError, setLoginError] = useState("");
//   const [touched, setTouched] = useState({});

//   // Restore remembered email
//   useEffect(() => {
//     const saved = localStorage.getItem("PrintQ_remember_email");
//     if (saved)
//       setFields((prev) => ({ ...prev, email: saved, rememberMe: true }));
//   }, []);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     const val = type === "checkbox" ? checked : value;
//     setFields((prev) => ({ ...prev, [name]: val }));
//     if (touched[name]) {
//       const updated = { ...fields, [name]: val };
//       const errs = validate(updated);
//       setErrors((prev) => ({ ...prev, [name]: errs[name] }));
//     }
//   };

//   const handleBlur = (e) => {
//     const { name } = e.target;
//     setTouched((prev) => ({ ...prev, [name]: true }));
//     const errs = validate(fields);
//     setErrors((prev) => ({ ...prev, [name]: errs[name] }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setTouched({ email: true, password: true });
//     const errs = validate(fields);
//     setErrors(errs);
//     if (Object.keys(errs).length > 0) return;

//     setLoginError("");
//     const result = await login(fields);
//     if (!result.success) {
//       setLoginError(result.message);
//     }
//   };

//   return (
//     <AuthLayout>
//       <AuthCard
//         title="Welcome back"
//         subtitle="Sign in to your PrintQ shop account"
//       >
//         <form
//           onSubmit={handleSubmit}
//           noValidate
//           className="flex flex-col gap-5"
//         >
//           {/* Email */}
//           <AuthInput
//             label="Email address"
//             id="email"
//             name="email"
//             type="email"
//             placeholder="you@example.com"
//             value={fields.email}
//             onChange={handleChange}
//             onBlur={handleBlur}
//             error={errors.email}
//           />

//           {/* Password */}
//           <div className="flex flex-col gap-1.5">
//             <PasswordInput
//               label="Password"
//               id="password"
//               name="password"
//               placeholder="••••••••"
//               value={fields.password}
//               onChange={handleChange}
//               onBlur={handleBlur}
//               error={errors.password}
//             />
//             {/* Forgot Password link */}
//             <div className="flex justify-end mt-0.5">
//               <button
//                 type="button"
//                 className="text-xs font-medium transition-colors"
//                 style={{ color: "#EAB308" }}
//                 onMouseEnter={(e) => (e.currentTarget.style.color = "#CA8A04")}
//                 onMouseLeave={(e) => (e.currentTarget.style.color = "#EAB308")}
//                 onClick={() =>
//                   alert("Forgot password flow — integrate with your backend.")
//                 }
//               >
//                 Forgot password?
//               </button>
//             </div>
//           </div>

//           {/* Remember Me */}
//           <label className="flex items-center gap-2.5 cursor-pointer select-none">
//             <input
//               type="checkbox"
//               name="rememberMe"
//               checked={fields.rememberMe}
//               onChange={handleChange}
//               className="rounded"
//               style={{ accentColor: "#EAB308", width: 15, height: 15 }}
//             />
//             <span className="text-sm" style={{ color: "#4B5563" }}>
//               Remember me
//             </span>
//           </label>

//           {/* Submit */}
//           <AuthButton loading={loading}>Sign in</AuthButton>
//         </form>

//         {loginError && (
//           <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-200">
//             {loginError}
//           </p>
//         )}

//         {/* Divider */}
//         <div className="mt-7 pt-6" style={{ borderTop: "1px solid #F3F4F6" }}>
//           <p className="text-center text-sm" style={{ color: "#6B7280" }}>
//             Don't have an account?{" "}
//             <Link
//               to="/shop/signup"
//               className="font-semibold transition-colors"
//               style={{ color: "#EAB308" }}
//               onMouseEnter={(e) => (e.currentTarget.style.color = "#CA8A04")}
//               onMouseLeave={(e) => (e.currentTarget.style.color = "#EAB308")}
//             >
//               Sign up
//             </Link>
//           </p>
//         </div>
//       </AuthCard>
//     </AuthLayout>
//   );
// }
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";
import AuthCard from "../../components/auth/AuthCard";
import AuthInput from "../../components/auth/AuthInput";
import PasswordInput from "../../components/auth/PasswordInput";
import AuthButton from "../../components/auth/AuthButton";
import { useAuth } from "../../components/auth/useAuth";
import {
  forgotPassword,
  verifyOtp,
  resetPassword,
} from "../../services/shopService";

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

// ─── Forgot Password — Screen 1: Email ───
function ForgotEmailScreen({ onNext, onBack }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim()) { setError("Email is required."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Enter a valid email."); return; }
    setError("");
    setLoading(true);
    try {
      await forgotPassword(email);
      onNext(email);
    } catch (err) {
      setError(err.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-7">
        <h1 className="text-2xl font-bold" style={{ color: "#1F2937", letterSpacing: "-0.01em" }}>
          Forgot password
        </h1>
        <p className="mt-1 text-sm" style={{ color: "#6B7280" }}>
          Enter your registered email to receive an OTP.
        </p>
      </div>
      <div className="flex flex-col gap-5">
        <AuthInput
          label="Email address"
          id="fp-email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error}
        />
        <AuthButton loading={loading} onClick={handleSubmit} type="button">
          Send OTP
        </AuthButton>
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-center"
          style={{ color: "#EAB308" }}
        >
          ← Back to Sign in
        </button>
      </div>
    </>
  );
}

// ─── Forgot Password — Screen 2: OTP ───
function ForgotOtpScreen({ email, onNext, onBack }) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMsg, setResendMsg] = useState("");

  const handleSubmit = async () => {
    if (!otp.trim() || otp.length !== 6) { setError("Enter the 6-digit OTP."); return; }
    setError("");
    setLoading(true);
    try {
      await verifyOtp(email, otp);
      onNext();
    } catch (err) {
      setError(err.message || "Invalid OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setResendMsg("");
    try {
      await forgotPassword(email);
      setResendMsg("OTP resent successfully.");
    } catch (err) {
      setResendMsg("Failed to resend OTP.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <>
      <div className="mb-7">
        <h1 className="text-2xl font-bold" style={{ color: "#1F2937", letterSpacing: "-0.01em" }}>
          Enter OTP
        </h1>
        <p className="mt-1 text-sm" style={{ color: "#6B7280" }}>
          A 6-digit OTP was sent to <strong>{email}</strong>. Valid for 10 minutes.
        </p>
      </div>
      <div className="flex flex-col gap-5">
        <AuthInput
          label="OTP"
          id="fp-otp"
          type="text"
          placeholder="6-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
          error={error}
        />
        <AuthButton loading={loading} onClick={handleSubmit} type="button">
          Verify OTP
        </AuthButton>
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="text-sm"
            style={{ color: "#EAB308" }}
          >
            ← Back
          </button>
          <button
            type="button"
            onClick={handleResend}
            disabled={resendLoading}
            className="text-sm"
            style={{ color: "#6B7280" }}
          >
            {resendLoading ? "Resending..." : "Resend OTP"}
          </button>
        </div>
        {resendMsg && (
          <p className="text-xs text-center" style={{ color: "#6B7280" }}>{resendMsg}</p>
        )}
      </div>
    </>
  );
}

// ─── Forgot Password — Screen 3: New Password ───
function ForgotNewPasswordScreen({ email, onSuccess }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!password) { setError("Password is required."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }
    setError("");
    setLoading(true);
    try {
      await resetPassword(email, password);
      onSuccess();
    } catch (err) {
      setError(err.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-7">
        <h1 className="text-2xl font-bold" style={{ color: "#1F2937", letterSpacing: "-0.01em" }}>
          Set new password
        </h1>
        <p className="mt-1 text-sm" style={{ color: "#6B7280" }}>
          Choose a strong password for your account.
        </p>
      </div>
      <div className="flex flex-col gap-5">
        <PasswordInput
          label="New password"
          id="fp-newpass"
          placeholder="Min. 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <PasswordInput
          label="Confirm password"
          id="fp-confirmpass"
          placeholder="Re-enter password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
        {error && (
          <p className="text-sm rounded-xl bg-red-50 px-4 py-3 border border-red-200" style={{ color: "#EF4444" }}>
            {error}
          </p>
        )}
        <AuthButton loading={loading} onClick={handleSubmit} type="button">
          Reset Password
        </AuthButton>
      </div>
    </>
  );
}

// ─── Main Login Component ───
export default function Login() {
  const { login, loading } = useAuth();

  // "login" | "fp-email" | "fp-otp" | "fp-newpass" | "fp-success"
  const [screen, setScreen] = useState("login");
  const [fpEmail, setFpEmail] = useState("");

  const [fields, setFields] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState("");
  const [touched, setTouched] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem("PrintQ_remember_email");
    if (saved) setFields((prev) => ({ ...prev, email: saved, rememberMe: true }));
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
      <AuthCard>
        {/* ── Login Screen ── */}
        {screen === "login" && (
          <>
            <div className="mb-7">
              <h1 className="text-2xl font-bold" style={{ color: "#1F2937", letterSpacing: "-0.01em" }}>
                Welcome back
              </h1>
              <p className="mt-1 text-sm" style={{ color: "#6B7280" }}>
                Sign in to your PrintQ shop account
              </p>
            </div>
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
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
                <div className="flex justify-end mt-0.5">
                  <button
                    type="button"
                    className="text-xs font-medium transition-colors"
                    style={{ color: "#EAB308" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#CA8A04")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#EAB308")}
                    onClick={() => setScreen("fp-email")}
                  >
                    Forgot password?
                  </button>
                </div>
              </div>
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={fields.rememberMe}
                  onChange={handleChange}
                  className="rounded"
                  style={{ accentColor: "#EAB308", width: 15, height: 15 }}
                />
                <span className="text-sm" style={{ color: "#4B5563" }}>Remember me</span>
              </label>
              <AuthButton loading={loading}>Sign in</AuthButton>
            </form>

            {loginError && (
              <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-200">
                {loginError}
              </p>
            )}

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
          </>
        )}

        {/* ── Forgot Password Screens ── */}
        {screen === "fp-email" && (
          <ForgotEmailScreen
            onNext={(email) => { setFpEmail(email); setScreen("fp-otp"); }}
            onBack={() => setScreen("login")}
          />
        )}

        {screen === "fp-otp" && (
          <ForgotOtpScreen
            email={fpEmail}
            onNext={() => setScreen("fp-newpass")}
            onBack={() => setScreen("fp-email")}
          />
        )}

        {screen === "fp-newpass" && (
          <ForgotNewPasswordScreen
            email={fpEmail}
            onSuccess={() => setScreen("fp-success")}
          />
        )}

        {screen === "fp-success" && (
          <div className="text-center flex flex-col gap-5">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold" style={{ color: "#1F2937" }}>Password Reset!</h2>
              <p className="mt-1 text-sm" style={{ color: "#6B7280" }}>
                Your password has been changed successfully.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setScreen("login")}
              className="w-full py-2.5 rounded-xl text-sm font-semibold"
              style={{ backgroundColor: "#EAB308", color: "#1F2937" }}
            >
              Back to Sign in
            </button>
          </div>
        )}
      </AuthCard>
    </AuthLayout>
  );
}