import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { DashboardMock } from "./DashboardMock";
import { ContactModal } from "@/components/landing/ContactModal";

export const Hero = () => {
  const [open, setOpen] = useState(false);

  return (
    <section className="relative pt-40 pb-20 overflow-hidden">
      <div className="absolute inset-0 dot-bg pointer-events-none opacity-60" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] rounded-full pointer-events-none"
           style={{ background: "radial-gradient(closest-side, hsl(38 90% 45% / 0.12), transparent 70%)" }} />

      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex flex-col items-center text-center"
        >
          <span className="pill-eyebrow mb-8">Skin Substitute Management Platform</span>

          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl max-w-5xl">
            Wound care management,{" "}
            <span className="text-gradient italic font-medium">seamlessly integrated</span>
          </h1>

          <p className="mt-8 max-w-xl text-base md:text-lg text-foreground/65 leading-relaxed">
            An end-to-end platform that combines benefits verification,
            supply chain management, and robust data analytics to help you deliver
            best-in-class wound care services and therapies.
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
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="mt-20"
        >
          <DashboardMock />
        </motion.div>
      </div>
      <ContactModal open={open} onOpenChange={setOpen} />
    </section>
  );
};
