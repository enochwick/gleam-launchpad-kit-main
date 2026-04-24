export const Footer = () => (
  <footer className="border-t border-border/60 py-12">
    <div className="container">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <span className="relative inline-flex h-7 w-7 items-center justify-center rounded-full border border-primary/40">
            <span className="absolute inset-1 rounded-full border border-primary/60" />
            <span className="absolute bottom-0 right-0 h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]" />
          </span>
          <span className="text-base font-semibold tracking-tight">
            Healthview <span className="text-primary">360</span>™
          </span>
        </div>
        <p className="text-xs text-foreground/50 font-mono">
          © {new Date().getFullYear()} Healthview 360. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);
