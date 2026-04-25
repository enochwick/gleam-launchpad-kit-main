import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContactModal } from "@/components/landing/ContactModal";

const links = [
  { label: "Platform", href: "#platform" },
  { label: "Solutions", href: "#solutions" },
  { label: "Stakeholders", href: "#stakeholders" },
  { label: "How it works", href: "#how" },
  { label: "Walkthroughs", href: "#walkthroughs" },
];

export const Nav = () => {
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[55]">
        <div className="container">
          <div className="mt-4 flex items-center justify-between h-14 px-4 rounded-full glass">
            <a href="#" className="flex items-center gap-2.5 pl-2">
              <span className="relative inline-flex h-7 w-7 items-center justify-center rounded-full border border-primary/40">
                <span className="absolute inset-1 rounded-full border border-primary/60" />
                <span className="absolute bottom-0 right-0 h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]" />
              </span>
              <span className="font-display text-lg font-semibold tracking-tight text-foreground hidden sm:inline">Healthview</span>
            </a>

            <nav className="hidden lg:flex items-center gap-8">
              {links.map((l) => (
                <a key={l.label} href={l.href} className="text-sm text-foreground/70 hover:text-foreground transition-colors">
                  {l.label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setOpen(true)}
                className="hidden sm:inline text-sm text-foreground/70 hover:text-foreground transition-colors px-3"
              >
                Contact
              </button>
              <Link
                to="/login"
                className="hidden sm:inline text-sm text-foreground/70 hover:text-foreground transition-colors px-3"
              >
                Login
              </Link>
              <Link to="/login">
                <Button variant="outline" className="hidden sm:inline-flex rounded-full h-9 px-5 text-sm font-medium bg-transparent border-foreground/35 hover:bg-foreground/5 hover:border-foreground/55 transition-[border-color,background-color]">
                  Register
                </Button>
              </Link>
              <Button className="hidden sm:inline-flex rounded-full h-9 px-5 text-sm font-medium btn-gradient text-white border-0">
                Schedule Demo
              </Button>
              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen((o) => !o)}
                className="lg:hidden flex items-center justify-center h-9 w-9 rounded-full border border-foreground/25 text-foreground/70 hover:text-foreground hover:bg-foreground/5 transition-colors"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Mobile drawer */}
          {mobileOpen && (
            <div className="lg:hidden absolute top-full left-4 right-4 mt-2 glass rounded-2xl py-4 px-6 flex flex-col gap-1 z-[55]">
              {links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm text-foreground/70 hover:text-foreground py-2.5 border-b border-border/40 last:border-0 transition-colors"
                >
                  {l.label}
                </a>
              ))}
              <div className="flex items-center gap-4 pt-3">
                <Link to="/login" className="text-sm text-foreground/60 hover:text-foreground transition-colors">Login</Link>
                <button
                  onClick={() => { setOpen(true); setMobileOpen(false); }}
                  className="text-sm text-foreground/60 hover:text-foreground transition-colors"
                >
                  Contact
                </button>
              </div>
            </div>
          )}
        </div>
      </header>
      <ContactModal open={open} onOpenChange={setOpen} />
    </>
  );
};
