import { ShieldCheck, Package, FileText, Warehouse, TrendingUp } from "lucide-react";
import { SectionHeader } from "./SectionHeader";

const features = [
  {
    eyebrow: "Benefits Verification",
    icon: ShieldCheck,
    title: "Faster benefit verification for the right patient and product",
    body: "Automate BV validation, reduce manual touchpoints, and make clearer verification decisions with better payer visibility.",
    bullets: ["Automated validation workflows", "Better visibility into payer policies", "Fewer manual steps for your team"],
  },
  {
    eyebrow: "Order Management",
    icon: Package,
    title: "Gain complete transparency and control",
    body: "Manage orders, invoices, and inventory in one connected workflow so your staff can work faster with fewer handoffs.",
    bullets: ["Efficient order management", "Transparent invoice management", "Optimized inventory management"],
  },
  {
    eyebrow: "Invoice Management",
    icon: FileText,
    title: "Transparent invoice management",
    body: "Track invoices more clearly and keep your team aligned from order to reconciliation.",
    bullets: ["Real-time invoice status tracking", "Order-to-invoice reconciliation", "Payer-aligned billing visibility"],
  },
  {
    eyebrow: "Inventory Management",
    icon: Warehouse,
    title: "Optimized skin substitute inventory management",
    body: "Keep inventory aligned with patient care, order workflows, and supply planning in one place.",
    bullets: ["Patient-level inventory allocation", "Automated reorder triggers", "Supply chain visibility"],
  },
  {
    eyebrow: "Revenue Cycle Management",
    icon: TrendingUp,
    title: "Simplify & optimize your skin substitute revenue cycle management",
    body: "Reduce billing friction with clearer collections, claims tracking, reconciliation, and workflow support.",
    bullets: ["Billing and collections visibility", "Claims tracking and reconciliation", "Automated workflow support"],
  },
];

export const Features = () => (
  <section className="py-32">
    <div className="container">
      <SectionHeader
        eyebrow="Simplify Wound Care Management"
        title={
          <>
            Wounds are complex…{" "}
            <span className="text-foreground/40">Your process for treating them shouldn't be</span>
          </>
        }
        description="One platform streamlines benefits verification, order management, invoice management, and skin substitute inventory in a single modern workflow."
      />

      <div className="grid lg:grid-cols-6 gap-4">
        {features.map((f, i) => (
          <div
            key={f.eyebrow}
            className={`card-glow rounded-2xl p-8 lg:p-10 ${
              i < 2 ? "lg:col-span-3" : i === 4 ? "lg:col-span-6" : "lg:col-span-3"
            }`}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-primary/10 border border-primary/30">
                <f.icon className="w-5 h-5 text-primary" strokeWidth={1.5} />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-primary">{f.eyebrow}</span>
            </div>
            <h3 className="font-display text-2xl md:text-3xl mb-4">{f.title}</h3>
            <p className="text-foreground/65 leading-relaxed">{f.body}</p>
            {f.bullets && (
              <ul className="mt-6 space-y-2">
                {f.bullets.map((b) => (
                  <li key={b} className="flex items-center gap-3 text-sm text-foreground/80">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))] shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  </section>
);
