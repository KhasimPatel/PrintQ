/**
 * AuthInput – reusable labeled text input with gold focus ring.
 */
export default function AuthInput({
  label,
  id,
  type = "text",
  placeholder,
  error,
  register, // react-hook-form register ref (optional)
  ...rest
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium"
          style={{ color: "#374151" }}
        >
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        autoComplete="off"
        className="w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-all duration-150"
        style={{
          border: error ? "1.5px solid #EF4444" : "1.5px solid #E5E7EB",
          color: "#1F2937",
          backgroundColor: "#fff",
          fontFamily: "'Outfit', sans-serif",
        }}
        onFocus={(e) => {
          e.target.style.border = "1.5px solid #EAB308";
          e.target.style.boxShadow = "0 0 0 3px rgba(234,179,8,0.12)";
        }}
        onBlur={(e) => {
          e.target.style.border = error
            ? "1.5px solid #EF4444"
            : "1.5px solid #E5E7EB";
          e.target.style.boxShadow = "none";
        }}
        {...(register ? register(id) : {})}
        {...rest}
      />
      {error && (
        <p className="text-xs mt-0.5" style={{ color: "#EF4444" }}>
          {error}
        </p>
      )}
    </div>
  );
}
