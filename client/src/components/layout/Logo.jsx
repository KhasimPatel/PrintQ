export default function Logo({ className = "" }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
        >
          <path d="M4 5h12v2H4V5zm0 4h8v2H4V9zm0 4h12v2H4v-2z" fill="#1F2937" />
        </svg>
      </div>
      <span className="text-xl font-bold tracking-tight text-text">
        Print<span className="text-primary-dark">Q</span>
      </span>
    </div>
  );
}
