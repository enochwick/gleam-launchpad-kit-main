import { SectionHeader } from "./SectionHeader";

const steps = [
  { n: "1", title: "Integrate your existing systems", body: "Healthview 360™ integrates with your existing EMR and EHR environment so your team can work from a familiar source of truth." },
  { n: "2", title: "Simplify benefits and supply chain workflows", body: "Bring benefit verification, orders, invoices, and inventory into one guided workflow designed for skin substitute programs." },
  { n: "3", title: "Use analytics to optimize care delivery", body: "Use robust data analytics to improve operational visibility, streamline decision-making, and support best-in-class wound care services." },
];

export const HowItWorks = () => (
  <section id="how" className="py-32">
    <div className="container">
      <SectionHeader
        eyebrow="How It Works"
        title={
          <>
            Integrated to your EMR and EHR,{" "}
            <span className="text-foreground/40">ready for real-world workflows</span>
          </>
        }
      />

      <div className="grid md:grid-cols-3 gap-4 relative">
        {steps.map((s, i) => (
          <div key={s.n} className="card-glow rounded-2xl p-8 relative">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-12 w-12 rounded-full flex items-center justify-center font-display text-xl bg-primary/15 border border-primary/40 text-primary">
                {s.n}
              </div>
              {i < steps.length - 1 && (
                <div className="hidden md:block flex-1 h-px bg-gradient-to-r from-primary/40 to-transparent" />
              )}
            </div>
            <h3 className="font-display text-xl md:text-2xl mb-3">{s.title}</h3>
            <p className="text-sm text-foreground/65 leading-relaxed">{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
