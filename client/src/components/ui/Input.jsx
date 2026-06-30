export default function Input({ label, id, error, className = "", ...props }) {
  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={id}
          className="mb-1.5 block text-sm font-medium text-text"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full rounded-xl border bg-surface px-4 py-2.5 text-sm text-text outline-none transition-colors placeholder:text-text-muted focus:border-primary ${
          error ? "border-red-400" : "border-border"
        }`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
