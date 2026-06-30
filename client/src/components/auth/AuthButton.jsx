/**
 * AuthButton – gold primary CTA button with loading state.
 */
export default function AuthButton({
  children,
  loading = false,
  type = "submit",
  ...rest
}) {
  return (
    <button
      type={type}
      disabled={loading}
      className="w-full py-2.5 rounded-xl text-sm font-semibold tracking-wide transition-all duration-150 flex items-center justify-center gap-2 mt-1"
      style={{
        backgroundColor: loading ? "#FDE047" : "#EAB308",
        color: "#1F2937",
        cursor: loading ? "not-allowed" : "pointer",
        fontFamily: "'Outfit', sans-serif",
        letterSpacing: "0.01em",
        boxShadow: loading ? "none" : "0 1px 4px rgba(234,179,8,0.3)",
      }}
      onMouseEnter={(e) => {
        if (!loading) e.currentTarget.style.backgroundColor = "#CA8A04";
      }}
      onMouseLeave={(e) => {
        if (!loading) e.currentTarget.style.backgroundColor = "#EAB308";
      }}
      {...rest}
    >
      {loading && (
        <svg
          className="animate-spin"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
      )}
      {loading ? "Please wait…" : children}
    </button>
  );
}
