import { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import Button from "../ui/Button";
import ThemeToggle from "../ui/ThemeToggle";

const navLinks = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Benefits", href: "#benefits" },
  { label: "Reviews", href: "#reviews" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 md:px-6 md:py-4">
        <Link to="/" onClick={closeMenu}>
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-text-muted transition-colors hover:text-text"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <ThemeToggle />

          <div className="hidden md:block">
            <a href="#get-started">
              <Button size="sm">Get Started</Button>
            </a>
          </div>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-text md:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          className="border-t border-border/60 px-4 py-4 md:hidden"
          aria-label="Mobile"
        >
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={closeMenu}
                  className="block rounded-xl px-3 py-2.5 text-sm font-medium text-text-muted hover:bg-hover hover:text-text"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="pt-2">
              <a href="#get-started" onClick={closeMenu}>
                <Button className="w-full" size="md">
                  Get Started
                </Button>
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
