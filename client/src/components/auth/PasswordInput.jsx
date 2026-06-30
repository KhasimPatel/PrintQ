import { useState } from "react";

const EyeIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

/**
 * PasswordInput – input with show/hide toggle.
 */
export default function PasswordInput({
  label,
  id,
  placeholder,
  error,
  register,
  ...rest
}) {
  const [show, setShow] = useState(false);

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
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          placeholder={placeholder || "••••••••"}
          autoComplete="off"
          className="w-full rounded-xl px-4 py-2.5 pr-11 text-sm outline-none transition-all duration-150"
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
        <button
          type="button"
          onClick={() => setShow((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded transition-colors"
          style={{ color: "#9CA3AF" }}
          tabIndex={-1}
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
      {error && (
        <p className="text-xs mt-0.5" style={{ color: "#EF4444" }}>
          {error}
        </p>
      )}
    </div>
  );
}
