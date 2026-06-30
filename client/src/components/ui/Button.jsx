const variants = {
  primary:
    "bg-primary text-text hover:bg-primary-dark active:scale-[0.98] shadow-card dark:text-gray-900",
  secondary:
    "bg-surface text-text border border-border hover:border-primary hover:bg-primary-light/30 dark:hover:bg-primary-light/20",
  ghost: "text-text-muted hover:text-text hover:bg-hover",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-2.5 text-sm font-medium",
  lg: "px-6 py-3 text-base font-semibold",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2 rounded-xl transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
