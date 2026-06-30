const variants = {
  open: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  break: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  closed: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  busy: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  default: "bg-primary-light text-primary-dark",
};

export default function Badge({
  children,
  variant = "default",
  className = "",
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${variants[variant] || variants.default} ${className}`}
    >
      {children}
    </span>
  );
}
