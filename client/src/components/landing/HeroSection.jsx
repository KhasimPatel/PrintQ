import { useState } from "react";
import { Link } from "react-router-dom";
import Card from "../ui/Card";
import Modal from "../ui/Modal";

const roles = [
  {
    id: "student",
    title: "Student",
    description:
      "Upload documents, configure print settings, pay online, and track your order — all in one place.",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z"
          fill="#EAB308"
          stroke="#CA8A04"
          strokeWidth="0.5"
        />
        <path
          d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"
          fill="#1F2937"
          opacity="0.8"
        />
      </svg>
    ),
    badge: "Go ahead and order!",
    active: true,
    to: "/student",
  },
  {
    id: "shop",
    title: "Xerox Shop",
    description:
      "Manage incoming orders, update print status, and grow your shop with digital orders.",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <rect x="3" y="8" width="18" height="12" rx="2" fill="#E5E7EB" />
        <rect x="6" y="4" width="12" height="6" rx="1" fill="#EAB308" />
        <path
          d="M8 14h8M8 17h5"
          stroke="#6B7280"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    badge: "Work hard, win!",
    active: true,
    to: "/shop/login",
  },
];

export default function HeroSection() {
  const [shopModalOpen, setShopModalOpen] = useState(false);

  return (
    <section
      id="get-started"
      className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-20"
    >
      <div className="mx-auto max-w-3xl text-center">
        <span className="inline-flex items-center rounded-full bg-primary-light px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-dark">
          Campus printing, simplified
        </span>
        <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-text md:text-5xl lg:text-6xl">
          Upload. <span className="text-primary-dark">Pay.</span> Pickup.
        </h1>
        <p className="mt-5 text-base leading-relaxed text-text-muted md:text-lg">
          Stop waiting in long xerox queues. Select a shop near campus, upload
          your files, pay online, and collect prints when they&apos;re ready.
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-2 md:mt-14">
        {roles.map((role) => {
          const cardContent = (
            <>
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-light">
                  {role.icon}
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    role.active
                      ? "bg-primary/20 text-primary-dark"
                      : "bg-hover text-text-muted"
                  }`}
                >
                  {role.badge}
                </span>
              </div>
              <h2 className="mt-4 text-lg font-semibold text-text">
                {role.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">
                {role.description}
              </p>
              <div className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-primary-dark">
                {role.active ? (
                  <>
                    Start Now
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M3 8h10M9 4l4 4-4 4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </>
                ) : (
                  <>
                    Learn more
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M8 3v10M3 8h10"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </>
                )}
              </div>
            </>
          );

          if (role.active) {
            return (
              <Link key={role.id} to={role.to} className="block">
                <Card
                  hover
                  className="h-full rounded-4xl border border-border bg-surface transition-all duration-200 hover:-translate-y-1 dark:border-border"
                >
                  {cardContent}
                </Card>
              </Link>
            );
          }

          return (
            <Card
              key={role.id}
              hover
              className="h-full rounded-4xl border border-border bg-surface transition-all duration-200 hover:-translate-y-1 opacity-90 dark:border-border"
              onClick={() => setShopModalOpen(true)}
            >
              {cardContent}
            </Card>
          );
        })}
      </div>

      <Modal
        isOpen={shopModalOpen}
        onClose={() => setShopModalOpen(false)}
        title="Xerox Shop Module"
      >
        {/* The shop owner dashboard is coming in a future release. For now, only
        the Student module is available. Check back soon! */}
      </Modal>
    </section>
  );
}
