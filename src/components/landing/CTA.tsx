import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ContactModal } from "@/components/landing/ContactModal";

export const CTA = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <section id="contact" className="py-32">
        <div className="container">
          <div className="relative card-glow rounded-3xl p-12 md:p-20 text-center overflow-hidden">
            <div className="absolute inset-0 pointer-events-none"
                 style={{ background: "radial-gradient(ellipse at center, hsl(38 90% 40% / 0.18), transparent 70%)" }} />
            <div className="absolute inset-0 dot-bg opacity-40" />
            <div className="relative">
              <span className="pill-eyebrow mb-6">See it in action — 30 min</span>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl mt-4 max-w-3xl mx-auto">
                Transform Your Wound Care{" "}
                <span className="text-gradient italic font-medium">Management Today</span>
              </h2>
              <p className="mt-6 max-w-xl mx-auto text-foreground/70 leading-relaxed">
                Experience how our platform can streamline your workflows and elevate patient outcomes.
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-3">
                <Button className="rounded-full h-12 px-7 text-sm font-semibold btn-gradient text-white border-0">
                  Schedule a Demo
                </Button>
                <Button
                  onClick={() => setOpen(true)}
                  variant="outline"
                  className="rounded-full h-12 px-7 text-sm font-medium bg-transparent border-foreground/40 text-foreground/80 hover:bg-foreground/5 hover:border-foreground/60 hover:text-foreground transition-[border-color,color,background-color]"
                >
                  Contact Us
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ContactModal open={open} onOpenChange={setOpen} />
    </>
  );
};
