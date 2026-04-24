import { SectionHeader } from "./SectionHeader";

const items = [
  { icon: "👔", title: "Executive Leadership", body: "Safeguard your financial stability by shielding your bottom line against compliance and capacity risks." },
  { icon: "🏥", title: "Wound Care Director", body: "Maintain control with actionable insights that boost productivity and enhance the delivery of care." },
  { icon: "💼", title: "Support Staff", body: "Maintain source-of-truth accuracy for patient records and avoid populating multiple software platforms." },
  { icon: "🩺", title: "Clinician", body: "Reduce time spent on documentation so you can stay focused on delivering excellent patient care." },
];

export const Stakeholders = () => (
  <section id="stakeholders" className="py-32">
    <div className="container">
      <SectionHeader
        eyebrow="A Wound Care Platform Your Whole Team Can Get Behind"
        title={
          <>
            Built for every stakeholder{" "}
            <span className="text-foreground/40">in your wound care program</span>
          </>
        }
        description="From executive visibility to clinician efficiency, Healthview 360™ supports the people responsible for operational performance and patient care."
      />

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((it) => (
          <div key={it.title} className="card-glow rounded-2xl p-7 hover:border-primary/40 transition-colors">
            <div className="h-14 w-14 rounded-2xl flex items-center justify-center text-3xl mb-6 bg-primary/10 border border-primary/30">
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
