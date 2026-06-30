import Card from "../ui/Card";

const reviews = [
  {
    name: "Priya Sharma",
    college: "B.Tech, 3rd Year",
    rating: 5,
    text: "Submitted my assignment at 11 PM and picked it up before class. No queue, no stress. This is exactly what we needed on campus.",
  },
  {
    name: "Arjun Mehta",
    college: "MBA, 1st Year",
    rating: 5,
    text: "The single-page flow is brilliant. I uploaded 3 PDFs, paid on my phone, and got a notification when prints were ready. Super fast.",
  },
  {
    name: "Sneha Reddy",
    college: "B.Com, 2nd Year",
    rating: 4,
    text: "Finally something that works well on mobile. I used to waste 20 minutes at the xerox shop every week. PrintQ saved me so much time.",
  },
  {
    name: "Rahul Nair",
    college: "B.Sc, Final Year",
    rating: 5,
    text: "Clear pricing before payment, online UPI, and I could track the order status. Feels like a proper app, not a college project.",
  },
];

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill={i < rating ? "#EAB308" : "#E5E7EB"}
          aria-hidden="true"
        >
          <path d="M8 1.5l1.76 3.57 3.94.57-2.85 2.78.67 3.93L8 10.27l-3.52 1.85.67-3.93-2.85-2.78 3.94-.57L8 1.5z" />
        </svg>
      ))}
    </div>
  );
}

export default function ReviewsSection() {
  return (
    <section id="reviews" className="bg-surface py-14 md:py-20">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-text md:text-4xl">
            What Students Say
          </h2>
          <p className="mt-3 text-base text-text-muted md:text-lg">
            Trusted by students who value their time between classes.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 md:mt-14">
          {reviews.map((review) => (
            <Card
              key={review.name}
              className="rounded-[2rem] border border-border bg-surface p-6 shadow-[0_24px_48px_rgba(15,23,42,0.08)] dark:border-border"
            >
              <StarRating rating={review.rating} />
              <p className="mt-4 text-sm leading-relaxed text-text">
                &ldquo;{review.text}&rdquo;
              </p>
              <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-light text-sm font-bold text-primary-dark">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-text">
                    {review.name}
                  </p>
                  <p className="text-xs text-text-muted">{review.college}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
