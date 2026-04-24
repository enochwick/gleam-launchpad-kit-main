import { useState } from "react";
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

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="container">
          <div className="mt-4 flex items-center justify-between h-14 px-4 rounded-full glass">
            <a href="#" className="flex items-center gap-2 pl-2">
              <span className="relative inline-flex h-7 w-7 items-center justify-center rounded-full border border-primary/40">
                <span className="absolute inset-1 rounded-full border border-primary/60" />
                <span className="absolute bottom-0 right-0 h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]" />
              </span>
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
              <Button className="rounded-full h-9 px-5 text-sm font-medium btn-gradient text-white border-0">
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      </header>
      <ContactModal open={open} onOpenChange={setOpen} />
    </>
  );
};
