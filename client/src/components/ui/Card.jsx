export default function Card({
  children,
  className = "",
  hover = false,
  onClick,
  as: Component = "div",
}) {
  return (
    <Component
      onClick={onClick}
      className={`rounded-2xl bg-surface p-5 shadow-[var(--shadow-card)] md:p-6 ${
        onClick || hover ? "cursor-pointer" : ""
      } ${
        hover
          ? "transition-all duration-200 hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-0.5"
          : ""
      } ${className}`}
    >
      {children}
    </Component>
  );
}
