import { useEffect } from "react";
import Button from "./Button";

export default function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/50 dark:bg-black/70"
        onClick={onClose}
        aria-label="Close dialog"
      />
      <div className="relative w-full max-w-md rounded-2xl bg-surface p-6 shadow-[var(--shadow-card-hover)]">
        <h2 id="modal-title" className="text-lg font-semibold text-text">
          {title}
        </h2>
        <div className="mt-3 text-sm leading-relaxed text-text-muted">
          {children}
        </div>
        <div className="mt-6 flex justify-end">
          <Button onClick={onClose} size="sm">
            Got it
          </Button>
        </div>
      </div>
    </div>
  );
}
