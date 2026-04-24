import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Submission {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  organization: string | null;
  phone: string | null;
  message: string;
  created_at: string;
}

export const ContactSubmissions = () => {
  const [rows, setRows] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setRows(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-foreground/50 text-sm py-8 text-center">Loading submissions…</p>;
  if (rows.length === 0) return <p className="text-foreground/50 text-sm py-8 text-center">No submissions yet.</p>;

  return (
    <div className="space-y-3">
      {rows.map((r) => (
        <div
          key={r.id}
          className="card-glow rounded-xl p-4 cursor-pointer hover:border-primary/40 transition-colors"
          onClick={() => setExpanded(expanded === r.id ? null : r.id)}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-medium">{r.first_name} {r.last_name}</p>
              <p className="text-sm text-foreground/60">{r.email}{r.organization ? ` · ${r.organization}` : ""}</p>
            </div>
            <p className="text-xs text-foreground/40 shrink-0 mt-0.5">
              {new Date(r.created_at).toLocaleDateString()}
            </p>
          </div>
          {expanded === r.id && (
            <div className="mt-3 pt-3 border-t border-foreground/10 space-y-2 text-sm">
              {r.phone && <p><span className="text-foreground/50">Phone:</span> {r.phone}</p>}
              <p className="text-foreground/80 whitespace-pre-wrap">{r.message}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
