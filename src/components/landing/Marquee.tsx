const items = [
  "Benefits Verification",
  "Order Management",
  "Invoice Management",
  "Skin Substitute Inventory",
  "EMR Integration",
  "EHR Integration",
  "Data Analytics",
  "Supply Chain Management",
];

export const Marquee = () => {
  const all = [...items, ...items];
  return (
    <section className="py-14 border-y border-border/60 overflow-hidden">
      <div className="text-center mb-6">
        <span className="pill-eyebrow">Simplify wound care management with Healthview 360</span>
      </div>
      <div className="flex marquee gap-12 whitespace-nowrap">
        {all.map((it, i) => (
          <div key={i} className="flex items-center gap-12 shrink-0 text-2xl md:text-3xl font-display text-foreground/40">
            <span>{it}</span>
            <span className="text-primary text-3xl">✦</span>
          </div>
        ))}
      </div>
    </section>
  );
};
