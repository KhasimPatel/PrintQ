import { useToast } from "../../context/ToastContext";

const styles = {
  success:
    "border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-900/30 dark:text-green-300",
  error:
    "border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-900/30 dark:text-red-300",
  info: "border-border bg-surface text-text",
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (!toasts.length) return null;

  return (
    <div className="fixed right-4 bottom-4 z-50 flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-start justify-between gap-3 rounded-xl border px-4 py-3 text-sm shadow-[var(--shadow-card-hover)] ${styles[toast.type] || styles.info}`}
        >
          <span>{toast.message}</span>
          <button
            type="button"
            onClick={() => removeToast(toast.id)}
            className="shrink-0 opacity-60 hover:opacity-100"
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
