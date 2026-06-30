import { Link } from "react-router-dom";
import Logo from "./Logo";
import ThemeToggle from "../ui/ThemeToggle";

export default function StudentHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3 md:px-6">
        <Link to="/" className="flex items-center gap-3">
          <Logo />
        </Link>
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="hidden text-xs font-medium text-text-muted hover:text-text sm:block"
          >
            ← Home
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
