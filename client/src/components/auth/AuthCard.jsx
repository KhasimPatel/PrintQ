/**
 * AuthCard – white card container for auth forms.
 */
export default function AuthCard({ title, subtitle, children }) {
  return (
    <div
      className="w-full max-w-md bg-white rounded-2xl px-8 py-9"
      style={{
        boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)",
        border: "1px solid #E5E7EB",
      }}
    >
      {(title || subtitle) && (
        <div className="mb-7">
          {title && (
            <h1
              className="text-2xl font-bold"
              style={{ color: "#1F2937", letterSpacing: "-0.01em" }}
            >
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="mt-1 text-sm" style={{ color: "#6B7280" }}>
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
