import Card from "../ui/Card";

const steps = [
  {
    number: "01",
    badge: "Select",
    bg: "bg-purple-100",
    title: "Select Shop",
    description:
      "Choose a trusted xerox shop near your campus. See ratings, wait time, and pricing upfront.",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
          fill="#EAB308"
        />
        <circle cx="12" cy="9" r="2.5" fill="#1F2937" />
      </svg>
    ),
  },
  {
    number: "02",
    badge: "Upload",
    bg: "bg-blue-100",
    title: "Upload Files",
    description:
      "Upload PDFs or images from your phone or laptop. Add multiple files in one order.",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M12 16V4m0 0l-4 4m4-4l4 4"
          stroke="#EAB308"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4 18v2a2 2 0 002 2h12a2 2 0 002-2v-2"
          stroke="#1F2937"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    number: "03",
    badge: "Pay",
    bg: "bg-amber-100",
    title: "Pay Online",
    description:
      "Configure copies, color, and sides. Pay securely online — no cash needed at the counter.",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <rect x="2" y="5" width="20" height="14" rx="2" fill="#EAB308" />
        <path d="M2 10h20" stroke="#1F2937" strokeWidth="1.5" />
        <rect x="5" y="14" width="4" height="2" rx="0.5" fill="#1F2937" />
      </svg>
    ),
  },
  {
    number: "04",
    badge: "Pickup",
    bg: "bg-green-100",
    title: "Pickup Prints",
    description:
      "Track your order in real time. Get notified when prints are ready and skip the queue.",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M9 12l2 2 4-4"
          stroke="#1F2937"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="12" r="9" stroke="#EAB308" strokeWidth="2" />
      </svg>
    ),
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-surface py-14 md:py-20">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="flex justify-center">
            <span className="rounded-full bg-blue-100 px-5 py-2 text-sm font-semibold tracking-wide text-blue-900">
              HOW IT WORKS
            </span>
          </div>

          <h2 className="mt-6 text-center text-5xl font-extrabold leading-tight text-text md:text-6xl">
            Four Steps to
            <br />
            Perfect Prints.
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-center text-lg text-text-muted">
            Upload, pay, and collect your prints without waiting in long queues.
          </p>
          <p className="mt-3 text-base text-text-muted md:text-lg">
            Four simple steps from upload to pickup — designed for students in a
            hurry.
          </p>
        </div>

        <div className="mt-20 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step) => (
            <Card
              key={step.number}
              className="relative rounded-[2rem] border border-border bg-surface p-6 shadow-[0_28px_60px_rgba(15,23,42,0.08)] dark:border-border"
            >
              <span className="text-xs font-bold text-primary-dark/60">
                Step {step.number}
              </span>
              <div className="mt-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
                {step.icon}
              </div>
              <h3 className="mt-4 text-base font-semibold text-text">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">
                {step.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
