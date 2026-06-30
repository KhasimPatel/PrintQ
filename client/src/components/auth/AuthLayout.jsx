/**
 * AuthLayout – full-screen centered layout for authentication pages.
 * Background: #F8F7F4  |  Font: Outfit
 */
export default function AuthLayout({ children }) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-10"
      style={{ backgroundColor: "#F8F7F4", fontFamily: "'Outfit', sans-serif" }}
    >
      {/* Logo / Brand */}
      <div className="mb-8 flex flex-col items-center select-none">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 shadow-sm"
          style={{ backgroundColor: "#EAB308" }}
        >
          {/* Printer icon – inline SVG, no external deps */}
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 6 2 18 2 18 9" />
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
            <rect x="6" y="14" width="12" height="8" />
          </svg>
        </div>
        <span
          className="text-2xl font-bold tracking-tight"
          style={{ color: "#1F2937", letterSpacing: "-0.02em" }}
        >
          Print<span style={{ color: "#EAB308" }}>Q</span>
        </span>
        <span className="text-xs mt-1" style={{ color: "#6B7280" }}>
          Shop Owner Portal
        </span>
      </div>

      {children}
    </div>
  );
}
