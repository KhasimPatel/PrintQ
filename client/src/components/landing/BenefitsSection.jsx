import Card from "../ui/Card";

const benefits = [
  {
    title: "No waiting in queue",
    description:
      "Submit your order from anywhere on campus. Arrive only when your prints are ready.",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" stroke="#EAB308" strokeWidth="2" />
        <path
          d="M12 7v5l3 2"
          stroke="#1F2937"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: "Faster printing",
    description:
      "Shops receive your files instantly. No USB drives, no explaining settings at the counter.",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
          fill="#EAB308"
          stroke="#CA8A04"
          strokeWidth="0.5"
        />
      </svg>
    ),
  },
  {
    title: "Online payment",
    description:
      "Pay with UPI or card through Razorpay. Transparent pricing before you confirm.",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <rect x="2" y="6" width="20" height="12" rx="2" fill="#EAB308" />
        <path
          d="M6 12h4M14 12h4"
          stroke="#1F2937"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: "Real-time order updates",
    description:
      "Track every stage — paid, printing, ready for pickup — so you always know the status.",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M18 8A6 6 0 106 16"
          stroke="#EAB308"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M18 8v4h-4"
          stroke="#1F2937"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export default function BenefitsSection() {
  return (
    <section id="benefits" className="py-14 md:py-20">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-text md:text-4xl">
            Why Students Love PrintQ
          </h2>
          <p className="mt-3 text-base text-text-muted md:text-lg">
            Built for the daily rush — assignments, notes, and project
            submissions.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 md:mt-14">
          {benefits.map((benefit) => (
            <Card
              key={benefit.title}
              className="flex gap-4 rounded-[2rem] border border-border bg-surface p-6 shadow-[0_24px_48px_rgba(15,23,42,0.08)] dark:border-border"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-3xl bg-primary-light">
                {benefit.icon}
              </div>
              <div>
                <h3 className="text-base font-semibold text-text">
                  {benefit.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-text-muted">
                  {benefit.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
