import { useTheme } from "../../context/ThemeContext";

export default function ThemeToggle({ className = "" }) {
  const { toggleTheme, isDark } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`group relative flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-text-muted transition-all duration-200 hover:border-primary/50 hover:bg-primary-light/40 hover:text-primary-dark dark:hover:text-primary ${className}`}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
    >
      <span className="sr-only">
        {isDark ? "Switch to light mode" : "Switch to dark mode"}
      </span>

      {/* Sun — visible in dark mode */}
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className={`absolute transition-all duration-300 ${
          isDark
            ? "rotate-0 scale-100 opacity-100"
            : "rotate-90 scale-0 opacity-0"
        }`}
      >
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
        <path
          d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      {/* Moon — visible in light mode */}
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className={`absolute transition-all duration-300 ${
          isDark
            ? "-rotate-90 scale-0 opacity-0"
            : "rotate-0 scale-100 opacity-100"
        }`}
      >
        <path
          d="M21 14.5A8.5 8.5 0 1111.5 5a6.5 6.5 0 109.5 9.5z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>

      <span className="absolute -bottom-0.5 right-1 h-1.5 w-1.5 rounded-full bg-primary opacity-0 transition-opacity group-hover:opacity-100" />
    </button>
  );
}
