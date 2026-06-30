import { useEffect, useState } from "react";

const STEPS = [
  { id: "shop", label: "Shop" },
  { id: "student-info", label: "Info" },
  { id: "upload", label: "Upload" },
  { id: "settings", label: "Print" },
  { id: "pricing", label: "Price" },
  { id: "payment", label: "Pay" },
  { id: "tracking", label: "Track" },
];

export default function OrderStepper() {
  const [active, setActive] = useState("shop");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.25, 0.5] },
    );

    STEPS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <nav
      className="sticky top-[57px] z-30 border-b border-border/60 bg-background/95 backdrop-blur-sm"
      aria-label="Order progress"
    >
      <div className="mx-auto flex max-w-3xl gap-1 overflow-x-auto px-4 py-2 md:px-6">
        {STEPS.map((step, index) => {
          const isActive = active === step.id;
          return (
            <button
              key={step.id}
              type="button"
              onClick={() =>
                document
                  .getElementById(step.id)
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                isActive
                  ? "bg-primary text-gray-900"
                  : "text-text-muted hover:bg-hover hover:text-text"
              }`}
            >
              {index + 1}. {step.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
