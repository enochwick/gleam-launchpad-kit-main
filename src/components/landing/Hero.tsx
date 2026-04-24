import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { DashboardMock } from "./DashboardMock";

export const Hero = () => {
  return (
    <section className="relative pt-40 pb-20 overflow-hidden">
      <div className="absolute inset-0 dot-bg pointer-events-none opacity-60" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] rounded-full pointer-events-none"
           style={{ background: "radial-gradient(closest-side, hsl(188 95% 35% / 0.18), transparent 70%)" }} />

      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex flex-col items-center text-center"
        >
          {/* Logo mark */}
          <div className="relative mb-10 inline-flex items-center justify-center">
            <div className="absolute inset-0 -m-8 rounded-full" style={{ background: "radial-gradient(closest-side, hsl(188 95% 50% / 0.25), transparent 70%)" }} />
            <div className="relative flex items-baseline gap-2">
              <span className="font-display text-3xl md:text-4xl tracking-tight">
                Healthview
              </span>
              <span className="relative inline-flex h-10 w-10 items-center justify-center">
                <span className="absolute inset-0 rounded-full border border-primary/50" />
                <span className="absolute inset-1.5 rounded-full border border-primary/70" />
                <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-primary shadow-[0_0_10px_hsl(var(--primary))]" />
                <span className="font-mono text-[10px] text-primary">360</span>
              </span>
            </div>
          </div>

          <span className="pill-eyebrow mb-8">Introducing the All-New Healthview 360™</span>

          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl max-w-5xl">
            management software,{" "}
            <span className="text-gradient italic font-medium">seamlessly integrated</span>
          </h1>

          <p className="mt-8 max-w-2xl text-base md:text-lg text-foreground/65 leading-relaxed">
            An end-to-end skin substitute management platform that combines benefits verification,
            supply chain management, and robust data analytics to help you deliver best-in-class
            wound care services and therapies.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button className="rounded-full h-12 px-7 text-sm font-semibold btn-gradient text-white border-0">
              Schedule a Demo
            </Button>
            <Button variant="outline" className="rounded-full h-12 px-7 text-sm font-medium bg-transparent border-foreground/15 hover:bg-foreground/5">
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
    </section>
  );
};
