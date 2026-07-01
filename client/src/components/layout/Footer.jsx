import Logo from "./Logo";

const footerLinks = {
  about: [
    { label: "About PrintQ", href: "#" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Benefits", href: "#benefits" },
  ],
  contact: [
    {
      label: "printqsupport@gmail.com",
      href: "mailto:printqsupport@gmail.com",
    },
    { label: "+91 87671 59221", href: "tel:+918767159221" },
    { label: "VIT Pune, India", href: "#" },
  ],
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/60 bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-text-muted">
              Skip the xerox queue. Upload your documents, pay online, and pick
              up prints when they&apos;re ready.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-text">About Project</h3>
            <ul className="mt-4 space-y-2.5">
              {footerLinks.about.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-text-muted transition-colors hover:text-text"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-text">Contact</h3>
            <ul className="mt-4 space-y-2.5">
              {footerLinks.contact.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-text-muted transition-colors hover:text-text"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-text">Developer</h3>
            <p className="mt-4 text-sm leading-relaxed text-text-muted">
              Liked this project? Feel free to connect with me. I'm always open
              to building custom web applications and bringing new ideas to
              life.
            </p>
            <p className="mt-3 text-sm text-text-muted">
              Built by{" "}
              <span className="font-medium text-black">Khasim Patel</span> •{" "}
              <a
                href="mailto:khasimpatel8767@gmail.com"
                className="text-primary hover:underline"
              >
                khasimpatel8767@gmail.com
              </a>
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-8 sm:flex-row">
          <p className="text-sm text-text-muted">
            &copy; {year} PrintQ. All rights reserved.
          </p>
          <p className="text-xs text-text-muted">
            PrintQ - Version 1.0
          </p>
        </div>
      </div>
    </footer>
  );
}
