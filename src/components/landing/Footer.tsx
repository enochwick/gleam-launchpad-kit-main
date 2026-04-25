import { Link } from "react-router-dom";

export const Footer = () => (
  <footer className="border-t border-border/60 py-12">
    <div className="container">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <span className="relative inline-flex h-7 w-7 items-center justify-center rounded-full border border-primary/40">
            <span className="absolute inset-1 rounded-full border border-primary/60" />
            <span className="absolute bottom-0 right-0 h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]" />
          </span>
          <span className="font-display text-base font-semibold tracking-tight text-foreground">Healthview</span>
        </div>

        <p className="text-xs text-foreground/50 font-mono">
          © {new Date().getFullYear()} Healthview. All rights reserved.
        </p>

        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-sm text-foreground/60 hover:text-foreground transition-colors"
          >
            Login
          </Link>
          <Link
            to="/login"
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  </footer>
);
