export default function SectionWrapper({
  id,
  title,
  description,
  children,
  step,
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="mb-5">
        {step && (
          <span className="text-xs font-bold uppercase tracking-wider text-primary-dark">
            Step {step}
          </span>
        )}
        <h2 className="mt-1 text-xl font-bold text-text md:text-2xl">
          {title}
        </h2>
        {description && (
          <p className="mt-1.5 text-sm text-text-muted">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}
