import { Link } from "react-router-dom";
import Button from "../ui/Button";

export default function CTASection() {
  return (
    <section className="py-14 md:py-20">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="rounded-3xl border border-primary/20 bg-cta-bg px-6 py-12 text-center md:px-12 md:py-16">
          <h2 className="text-2xl font-bold text-white md:text-3xl">
            Ready to skip the queue?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-cta-muted md:text-base">
            Join students who print smarter. Upload your documents and pick up
            when ready — no waiting required.
          </p>
          <div className="mt-8">
            <Link to="/student">
              <Button size="lg" className="min-w-[180px]">
                Start as Student
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
