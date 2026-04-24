import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface OnboardingData {
  company_name: string;
  role: string;
  team_size: string;
  ehr_system: string;
  use_case: string;
  how_heard: string;
}

const EMPTY: OnboardingData = {
  company_name: "",
  role: "",
  team_size: "",
  ehr_system: "",
  use_case: "",
  how_heard: "",
};

export const OnboardingForm = () => {
  const { user } = useAuth();
  const [form, setForm] = useState<OnboardingData>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    supabase
      .from("onboarding")
      .select("*")
      .eq("user_id", user!.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setForm(data);
        setLoading(false);
      });
  }, []);

  const set = (field: keyof OnboardingData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    await supabase.from("onboarding").upsert(
      { ...form, user_id: user!.id },
      { onConflict: "user_id" }
    );

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) return <p className="text-foreground/50 text-sm py-8 text-center">Loading…</p>;

  return (
    <form onSubmit={handleSave} className="space-y-5 max-w-xl">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="company_name">Organization / Company</Label>
          <Input id="company_name" placeholder="Acme Health" value={form.company_name} onChange={set("company_name")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="role">Your Role</Label>
          <Input id="role" placeholder="Wound Care Coordinator" value={form.role} onChange={set("role")} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="team_size">Team Size</Label>
          <Input id="team_size" placeholder="e.g. 10–50" value={form.team_size} onChange={set("team_size")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="ehr_system">Current EHR / EMR System</Label>
          <Input id="ehr_system" placeholder="Epic, Cerner, etc." value={form.ehr_system} onChange={set("ehr_system")} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="use_case">Primary Use Case</Label>
        <Textarea
          id="use_case"
          placeholder="Describe how you plan to use the platform…"
          className="min-h-[90px] resize-none"
          value={form.use_case}
          onChange={set("use_case")}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="how_heard">How did you hear about us?</Label>
        <Input id="how_heard" placeholder="Referral, Google, conference…" value={form.how_heard} onChange={set("how_heard")} />
      </div>

      <div className="flex items-center gap-3">
        <Button
          type="submit"
          disabled={saving}
          className="rounded-full h-10 px-6 text-sm font-semibold btn-gradient text-white border-0 disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save Onboarding"}
        </Button>
        {saved && <p className="text-sm text-green-500">Saved!</p>}
      </div>
    </form>
  );
};
