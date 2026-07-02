// import { useState, useEffect, useRef } from "react";
// import { Link } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
// import Logo from "./Logo";
// import ThemeToggle from "../ui/ThemeToggle";
// import { updateShopStatus } from "../../services/shopService";

// export default function ShopOwnerHeader() {
//   const shopData = JSON.parse(localStorage.getItem("PrintQ_shop_data") || "{}");
//   const [status, setStatus] = useState(shopData.status || "OPEN");

//   const [profileMenuOpen, setProfileMenuOpen] = useState(false);
//   const profileMenuRef = useRef(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (
//         profileMenuRef.current &&
//         !profileMenuRef.current.contains(event.target)
//       ) {
//         setProfileMenuOpen(false);
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

// const handleLogout = () => {
//   localStorage.removeItem("printgo_jwt_token");
//   localStorage.removeItem("printgo_shop_data");
//   navigate("/shop/login", { replace: true });
// };

//   const handleStatusChange = async (e) => {
//     const newStatus = e.target.value;
//     setStatus(newStatus);
//     try {
//       await updateShopStatus(newStatus);

//       const existing = JSON.parse(
//         localStorage.getItem("PrintQ_shop_data") || "{}",
//       );
//       const updated = { ...existing, status: newStatus };
//       localStorage.setItem("PrintQ_shop_data", JSON.stringify(updated));

//       window.dispatchEvent(new Event("shop-status-updated"));
//     } catch (err) {
//       console.error("Failed to update shop status:", err);
//       setStatus(status);
//     }
//   };

//   return (
//     <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur-sm">
//       <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-6">
//         <div className="flex items-center gap-3">
//           <Logo />
//           {/* <span className="text-lg font-semibold tracking-tight text-text">
//             PrintQ Shop
//           </span> */}
//         </div>

//         <div className="hidden md:block text-center">
//           <p className="text-lg font-semibold text-text">
//             Welcome,{" "}
//             {JSON.parse(localStorage.getItem("PrintQ_shop_data") || "{}")
//               .shopName || "Shop Owner"}
//           </p>
//         </div>

//         <div className="flex items-center gap-3">
//           <label className="inline-flex items-center gap-3 rounded-2xl border border-border bg-surface px-3 py-2 text-sm text-text dark:border-border">
//             <span className="text-xs uppercase tracking-[0.24em] text-text-muted">
//               Status
//             </span>
//             <select
//               value={status}
//               onChange={handleStatusChange}
//               className="rounded-xl border border-border bg-transparent px-2 py-1 text-sm text-text outline-none dark:border-border"
//             >
//               <option>OPEN</option>
//               <option>CLOSED</option>
//               <option>BUSY</option>
//               <option>BREAK</option>
//             </select>
//           </label>

//           <button
//             type="button"
//             className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-surface text-text-muted transition hover:border-primary/50 hover:bg-primary-light/40 dark:border-border"
//             aria-label="View notifications"
//           >
//             <svg
//               width="20"
//               height="20"
//               viewBox="0 0 24 24"
//               fill="none"
//               aria-hidden="true"
//             >
//               <path
//                 d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m0 0v1a3 3 0 006 0v-1m-6 0h6"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               />
//             </svg>
//           </button>

//           <div className="relative" ref={profileMenuRef}>
//             <button
//               type="button"
//               onClick={() => setProfileMenuOpen((prev) => !prev)}
//               className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface text-text transition hover:border-primary/50 hover:bg-primary-light/40 dark:border-border"
//               aria-label="Shop owner profile"
//             >
//               <span className="font-semibold">
//                 {(shopData.shopName || "S").charAt(0).toUpperCase()}
//               </span>
//             </button>

//             {profileMenuOpen && (
//               <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-border bg-surface p-2 shadow-lg dark:border-border z-50">
//                 <div className="px-3 py-2 border-b border-border">
//                   <p className="text-sm font-semibold text-text truncate">
//                     {shopData.shopName || "Shop Owner"}
//                   </p>
//                 </div>

//                 <button
//                   type="button"
//                   onClick={() => {
//                     setProfileMenuOpen(false);
//                     // change password logic — abhi placeholder
//                   }}
//                   className="mt-1 flex w-full items-center rounded-xl px-3 py-2 text-sm text-text transition hover:bg-hover"
//                 >
//                   Change Password
//                 </button>

//                 <button
//                   type="button"
//                   onClick={handleLogout}
//                   className="flex w-full items-center rounded-xl px-3 py-2 text-sm text-red-600 transition hover:bg-red-50"
//                 >
//                   Logout
//                 </button>
//               </div>
//             )}
//           </div>

//           <ThemeToggle />
//         </div>
//       </div>
//     </header>
//   );
// }

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "./Logo";
import ThemeToggle from "../ui/ThemeToggle";
import { updateShopStatus, changePassword } from "../../services/shopService";

export default function ShopOwnerHeader() {
  const shopData = JSON.parse(localStorage.getItem("PrintQ_shop_data") || "{}");
  const [status, setStatus] = useState(shopData.status || "OPEN");
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [changePassOpen, setChangePassOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const navigate = useNavigate();

  // Change Password form state
  const [cpFields, setCpFields] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [cpError, setCpError] = useState("");
  const [cpSuccess, setCpSuccess] = useState("");
  const [cpLoading, setCpLoading] = useState(false);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("PrintQ_jwt_token");
    localStorage.removeItem("PrintQ_shop_data");
    navigate("/shop/login", { replace: true });
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    try {
      await updateShopStatus(newStatus);
      const existing = JSON.parse(localStorage.getItem("PrintQ_shop_data") || "{}");
      localStorage.setItem("PrintQ_shop_data", JSON.stringify({ ...existing, status: newStatus }));
      window.dispatchEvent(new Event("shop-status-updated"));
    } catch (err) {
      console.error("Failed to update shop status:", err);
      setStatus(status);
    }
  };

  const handleChangePassword = async () => {
    setCpError("");
    setCpSuccess("");

    if (!cpFields.currentPassword) { setCpError("Current password is required."); return; }
    if (!cpFields.newPassword) { setCpError("New password is required."); return; }
    if (cpFields.newPassword.length < 8) { setCpError("New password must be at least 8 characters."); return; }
    if (cpFields.newPassword !== cpFields.confirmPassword) { setCpError("Passwords do not match."); return; }

    setCpLoading(true);
    try {
      await changePassword({
        currentPassword: cpFields.currentPassword,
        newPassword: cpFields.newPassword,
      });
      setCpSuccess("Password changed successfully!");
      setCpFields({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => {
        setChangePassOpen(false);
        setCpSuccess("");
      }, 2000);
    } catch (err) {
      setCpError(err.message || "Failed to change password.");
    } finally {
      setCpLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    border: "1.5px solid #E5E7EB",
    borderRadius: "10px",
    padding: "9px 14px",
    fontFamily: "inherit",
    fontSize: "13px",
    color: "#1F2937",
    outline: "none",
    marginTop: "4px",
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-6">
          <div className="flex items-center gap-3">
            <Logo />
          </div>

          <div className="hidden md:block text-center">
            <p className="text-lg font-semibold text-text">
              Welcome,{" "}
              {JSON.parse(localStorage.getItem("PrintQ_shop_data") || "{}").shopName || "Shop Owner"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label className="inline-flex items-center gap-3 rounded-2xl border border-border bg-surface px-3 py-2 text-sm text-text dark:border-border">
              <span className="text-xs uppercase tracking-[0.24em] text-text-muted">Status</span>
              <select
                value={status}
                onChange={handleStatusChange}
                className="rounded-xl border border-border bg-transparent px-2 py-1 text-sm text-text outline-none dark:border-border"
              >
                <option>OPEN</option>
                <option>CLOSED</option>
                <option>BUSY</option>
                <option>BREAK</option>
              </select>
            </label>

            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-surface text-text-muted transition hover:border-primary/50 hover:bg-primary-light/40 dark:border-border"
              aria-label="View notifications"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m0 0v1a3 3 0 006 0v-1m-6 0h6"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                />
              </svg>
            </button>

            <div className="relative" ref={profileMenuRef}>
              <button
                type="button"
                onClick={() => setProfileMenuOpen((prev) => !prev)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface text-text transition hover:border-primary/50 hover:bg-primary-light/40 dark:border-border"
                aria-label="Shop owner profile"
              >
                <span className="font-semibold">
                  {(shopData.shopName || "S").charAt(0).toUpperCase()}
                </span>
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-border bg-surface p-2 shadow-lg dark:border-border z-50">
                  <div className="px-3 py-2 border-b border-border">
                    <p className="text-sm font-semibold text-text truncate">
                      {shopData.shopName || "Shop Owner"}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setProfileMenuOpen(false);
                      setCpError("");
                      setCpSuccess("");
                      setCpFields({ currentPassword: "", newPassword: "", confirmPassword: "" });
                      setChangePassOpen(true);
                    }}
                    className="mt-1 flex w-full items-center rounded-xl px-3 py-2 text-sm text-text transition hover:bg-hover"
                  >
                    Change Password
                  </button>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center rounded-xl px-3 py-2 text-sm text-red-600 transition hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* ── Change Password Modal ── */}
      {changePassOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setChangePassOpen(false); }}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-surface p-6"
            style={{ border: "1px solid #E5E7EB", boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-text">Change Password</h2>
              <button
                type="button"
                onClick={() => setChangePassOpen(false)}
                className="text-text-muted hover:text-text transition"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Fields */}
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-medium text-text-muted">Current Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={cpFields.currentPassword}
                  onChange={(e) => setCpFields((p) => ({ ...p, currentPassword: e.target.value }))}
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-text-muted">New Password</label>
                <input
                  type="password"
                  placeholder="Min. 8 characters"
                  value={cpFields.newPassword}
                  onChange={(e) => setCpFields((p) => ({ ...p, newPassword: e.target.value }))}
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-text-muted">Confirm New Password</label>
                <input
                  type="password"
                  placeholder="Re-enter new password"
                  value={cpFields.confirmPassword}
                  onChange={(e) => setCpFields((p) => ({ ...p, confirmPassword: e.target.value }))}
                  style={inputStyle}
                />
              </div>

              {cpError && (
                <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-200">
                  {cpError}
                </p>
              )}
              {cpSuccess && (
                <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700 border border-green-200">
                  {cpSuccess}
                </p>
              )}

              <button
                type="button"
                onClick={handleChangePassword}
                disabled={cpLoading}
                className="w-full py-2.5 rounded-xl text-sm font-semibold transition mt-1"
                style={{
                  backgroundColor: cpLoading ? "#FDE047" : "#EAB308",
                  color: "#1F2937",
                  cursor: cpLoading ? "not-allowed" : "pointer",
                }}
              >
                {cpLoading ? "Saving..." : "Change Password"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}