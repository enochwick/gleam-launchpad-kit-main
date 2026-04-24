import { Play } from "lucide-react";
import { SectionHeader } from "./SectionHeader";

const videos = [
  { title: "BV Status, IVR and Placing an Order", duration: "0:16" },
  { title: "Profile, Settings, Preferences", duration: "0:16" },
  { title: "Submitting for Benefit Verification", duration: "0:16" },
  { title: "Viewing and Paying Invoices", duration: "0:16" },
];

const gradients = [
  "from-[hsl(188_95%_25%)] to-[hsl(210_100%_15%)]",
  "from-[hsl(160_70%_25%)] to-[hsl(200_60%_10%)]",
  "from-[hsl(210_100%_25%)] to-[hsl(188_95%_15%)]",
  "from-[hsl(180_90%_25%)] to-[hsl(210_100%_12%)]",
];

export const Walkthroughs = () => (
  <section id="walkthroughs" className="py-32">
    <div className="container">
      <SectionHeader
        eyebrow="HV360 Walkthroughs"
        title={
          <>
            Explore guided videos that walk you through{" "}
            <span className="text-foreground/40">key platform features and workflows</span>
          </>
        }
      />

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        {videos.map((v, i) => (
          <div key={v.title} className="group cursor-pointer">
            <div className={`relative aspect-[4/5] rounded-2xl overflow-hidden card-glow bg-gradient-to-br ${gradients[i]}`}>
              <div className="absolute inset-0 dot-bg opacity-30" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-16 w-16 rounded-full flex items-center justify-center btn-gradient transition-transform group-hover:scale-110">
                  <Play className="h-6 w-6 fill-white text-white ml-1" />
                </div>
              </div>
              <div className="absolute top-4 left-4 font-mono text-[10px] uppercase tracking-wider text-white/80">
                Walkthrough
              </div>
              <div className="absolute top-4 right-4 font-mono text-xs text-white/80 px-2 py-1 rounded bg-black/40 backdrop-blur-sm">
                {v.duration}
              </div>
            </div>
            <h3 className="mt-4 font-display text-lg">{v.title}</h3>
          </div>
        ))}
      </div>
    </div>
  </section>
);
