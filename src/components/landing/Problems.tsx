import { SectionHeader } from "./SectionHeader";

const items = [
  { icon: "📋", title: "Verification Burden & Claims Tracking", body: "Say goodbye to the administrative burden around verification of benefits and claims tracking and reconciliation." },
  { icon: "📦", title: "Fragmented Supply Chain Processes", body: "Resolve fragmented supply chain processes and systems related to orders, invoices, and inventory." },
  { icon: "💸", title: "Disconnected Solutions", body: "Replace disconnected solutions that slow you and your team." },
  { icon: "🔍", title: "Data Rich, Knowledge Poor", body: "Bring disparate decision-support systems together so your team is no longer data rich but knowledge poor." },
];

export const Problems = () => (
  <section id="solutions" className="py-32">
    <div className="container">
      <SectionHeader
        eyebrow="The Comprehensive Integrated Solution"
        title={
          <>
            The comprehensive, integrated solution{" "}
            <span className="text-foreground/40">for your advanced wound care management needs</span>
          </>
        }
        description="The complexity of advanced wound care management can lead to unnecessary administrative burden, causing disruptions in operational workflow, inaccurate data, and inefficiencies in continuity of care. Healthview 360™ integrates with your existing EHR and EMR platforms to offer a streamlined, data-driven solution that addresses these pain points and helps enhance the delivery of care."
      />

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((it) => (
          <div key={it.title} className="card-glow rounded-2xl p-7 hover:border-primary/40 transition-colors">
            <div className="h-12 w-12 rounded-xl flex items-center justify-center text-2xl mb-5 bg-primary/10 border border-primary/30">
              {it.icon}
            </div>
            <h3 className="font-display text-xl mb-3">{it.title}</h3>
            <p className="text-sm text-foreground/65 leading-relaxed">{it.body}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
