import { ArrowUp } from "lucide-react";

const queue = [
  { name: "J. Martinez", meta: "BlueCross • Wound Care", status: "Approved", tone: "success" },
  { name: "S. Thompson", meta: "Aetna • Skin Substitute", status: "Pending", tone: "warning" },
  { name: "R. Patel", meta: "UnitedHealth • OASIS", status: "In Review", tone: "info" },
  { name: "D. Williams", meta: "Humana • Compression", status: "Approved", tone: "success" },
];

const overview = [
  { label: "BV Verified", value: "47", delta: "↑ 12% vs yesterday", tone: "success" },
  { label: "Orders Placed", value: "23", delta: "↑ 8% vs yesterday", tone: "success" },
  { label: "Pending Invoices", value: "9", delta: "↑ 3 need review", tone: "warning" },
  { label: "Inventory Alerts", value: "2", delta: "Low stock items", tone: "danger" },
];

const days = ["M", "T", "W", "T", "F", "S", "S"];
const bars = [60, 80, 45, 92, 70, 30, 55];

const toneStyles: Record<string, string> = {
  success: "text-[hsl(var(--success))] border-[hsl(var(--success))]/40 bg-[hsl(var(--success))]/10",
  warning: "text-[hsl(var(--warning))] border-[hsl(var(--warning))]/40 bg-[hsl(var(--warning))]/10",
  info: "text-primary border-primary/40 bg-primary/10",
  danger: "text-[hsl(var(--destructive))] border-[hsl(var(--destructive))]/40 bg-[hsl(var(--destructive))]/10",
};

export const DashboardMock = () => {
  return (
    <div className="relative max-w-6xl mx-auto">
      <div className="absolute -inset-x-10 -inset-y-10 rounded-[2rem] pointer-events-none"
           style={{ background: "radial-gradient(closest-side, hsl(38 90% 45% / 0.15), transparent 70%)" }} />
      <div className="relative card-glow rounded-2xl overflow-hidden ring-glow">
        {/* Window chrome */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-[hsl(20_8%_6%)]">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[hsl(0_70%_55%)]" />
            <span className="h-3 w-3 rounded-full bg-[hsl(38_92%_55%)]" />
            <span className="h-3 w-3 rounded-full bg-[hsl(140_60%_50%)]" />
          </div>
          <div className="text-xs font-mono text-foreground/60">
            Platform — Wound Care Dashboard
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[hsl(var(--success))]">
            <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--success))] animate-pulse" />
            Live
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-px bg-border">
          {/* Left column */}
          <div className="bg-[hsl(20_8%_6%)] p-6 space-y-6">
            <div>
              <h3 className="font-mono text-[10px] uppercase tracking-wider text-foreground/50 mb-3 text-center">
                BV Status Queue
              </h3>
              <div className="space-y-2">
                {queue.map((q) => (
                  <div key={q.name} className="flex items-center justify-between p-3 rounded-lg border border-border/60 bg-[hsl(22_10%_8%)]">
                    <div>
                      <div className="text-sm font-medium">{q.name}</div>
                      <div className="text-xs text-foreground/50">{q.meta}</div>
                    </div>
                    <span className={`text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full border ${toneStyles[q.tone]}`}>
                      {q.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-mono text-[10px] uppercase tracking-wider text-foreground/50">
                  Weekly Orders
                </h3>
                <span className="font-mono text-xs text-primary">Total: 147</span>
              </div>
              <div className="rounded-lg border border-border/60 bg-[hsl(22_10%_8%)] p-4">
                <div className="flex items-end justify-between h-24 gap-2">
                  {bars.map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      {i === 3 && <span className="font-mono text-[9px] text-primary">92</span>}
                      {i !== 3 && <span className="font-mono text-[9px] text-transparent">0</span>}
                      <div className="w-full rounded-sm bg-gradient-to-t from-primary/30 to-primary/80" style={{ height: `${h}%` }} />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-[10px] font-mono text-foreground/50">
                  {days.map((d, i) => <span key={i}>{d}</span>)}
                </div>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="bg-[hsl(20_8%_6%)] p-6">
            <h3 className="font-mono text-[10px] uppercase tracking-wider text-foreground/50 mb-3 text-center">
              Today's Overview
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {overview.map((o) => (
                <div key={o.label} className="rounded-lg border border-border/60 bg-[hsl(22_10%_8%)] p-5 text-center">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-foreground/50">{o.label}</div>
                  <div className="font-display text-4xl my-2">{o.value}</div>
                  <div className={`text-xs ${o.tone === 'success' ? 'text-[hsl(var(--success))]' : o.tone === 'warning' ? 'text-[hsl(var(--warning))]' : 'text-foreground/60'}`}>
                    {o.delta}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
