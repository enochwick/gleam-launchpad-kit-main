import { useState } from "react";
import { Play } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { DashboardMock } from "./DashboardMock";

const tabs = ["Dashboard", "Benefits Verification", "Order Management", "Invoices"];

export const GuidedTour = () => {
  const [active, setActive] = useState(0);
  return (
    <section id="platform" className="py-32">
      <div className="container">
        <SectionHeader
          eyebrow="Healthview 360™"
          title={
            <>
              See how HV360™ works.{" "}
              <span className="text-foreground/40">Explore every workflow.</span>
            </>
          }
          description="Explore guided workflows that walk you through key platform features and core skin substitute management tasks."
        />

        <div className="flex justify-center mb-8">
          <button className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium btn-gradient text-white">
            <Play className="h-3.5 w-3.5 fill-current" />
            Guided Tour
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {tabs.map((t, i) => (
            <button
              key={t}
              onClick={() => setActive(i)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all border ${
                active === i
                  ? "bg-primary/15 border-primary/50 text-primary"
                  : "bg-transparent border-border text-foreground/65 hover:text-foreground hover:border-foreground/30"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <DashboardMock />
      </div>
    </section>
  );
};
