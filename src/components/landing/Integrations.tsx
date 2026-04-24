import { SectionHeader } from "./SectionHeader";

const integrations = [
  ["GitHub", "Version Control"],
  ["Slack", "Communication"],
  ["Stripe", "Payments"],
  ["PostgreSQL", "Database"],
  ["Redis", "Cache"],
  ["AWS", "Cloud"],
  ["MongoDB", "Database"],
  ["Vercel", "Hosting"],
  ["Figma", "Design"],
  ["Linear", "Project Mgmt"],
  ["Notion", "Documentation"],
  ["OpenAI", "AI/ML"],
];

export const Integrations = () => {
  const row = [...integrations, ...integrations];
  return (
    <section className="py-32 border-t border-foreground/10 overflow-hidden">
      <div className="container">
        <SectionHeader
          eyebrow="Integrations"
          title={
            <>
              Works with everything <br />
              <span className="text-foreground/40">you already use.</span>
            </>
          }
          description="200+ pre-built integrations. Connect your entire stack in minutes."
        />
      </div>

      <div className="space-y-4">
        {[0, 1].map((rowIdx) => (
          <div key={rowIdx} className="flex marquee gap-4" style={{ animationDirection: rowIdx === 1 ? "reverse" : "normal" }}>
            {row.map(([name, cat], i) => (
              <div
                key={`${rowIdx}-${i}`}
                className="shrink-0 flex items-center gap-4 px-6 py-4 rounded-full border border-foreground/10 bg-background"
              >
                <span className="h-9 w-9 rounded-full bg-foreground/5 flex items-center justify-center font-mono text-xs">
                  {name[0]}
                </span>
                <div>
                  <div className="font-medium text-sm">{name}</div>
                  <div className="label-mono">{cat}</div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
};
