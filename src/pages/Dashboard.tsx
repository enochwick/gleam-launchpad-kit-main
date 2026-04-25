import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ContactSubmissions } from "@/components/dashboard/ContactSubmissions";
import { FileUpload } from "@/components/dashboard/FileUpload";
import { OnboardingForm } from "@/components/dashboard/OnboardingForm";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { Button } from "@/components/ui/button";

type Tab = "submissions" | "files" | "onboarding" | "ai";

const tabs: { id: Tab; label: string }[] = [
  { id: "submissions", label: "Contact Submissions" },
  { id: "files", label: "Documents" },
  { id: "onboarding", label: "Onboarding" },
  { id: "ai", label: "AI Assistant" },
];

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [active, setActive] = useState<Tab>("submissions");

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="absolute inset-0 dot-bg pointer-events-none opacity-30" />

      {/* Top nav */}
      <header className="relative border-b border-foreground/10 px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="relative inline-flex h-7 w-7 items-center justify-center rounded-full border border-primary/40">
            <span className="absolute inset-1 rounded-full border border-primary/60" />
            <span className="absolute bottom-0 right-0 h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]" />
          </span>
          <span className="font-display text-lg font-semibold">Dashboard</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-foreground/50 hidden sm:block">{user?.email}</span>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full h-8 px-4 text-xs border-foreground/20 bg-transparent hover:bg-foreground/5"
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        </div>
      </header>

      <div className="relative max-w-5xl mx-auto px-6 py-10">
        {/* Page heading */}
        <div className="mb-8">
          <h1 className="font-display text-3xl">Admin Portal</h1>
          <p className="text-foreground/60 mt-1 text-sm">Manage submissions, documents, and onboarding.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-foreground/5 p-1 rounded-full w-fit">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                active === t.id
                  ? "bg-primary text-white shadow-sm"
                  : "text-foreground/60 hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div>
          {active === "submissions" && <ContactSubmissions />}
          {active === "files" && <FileUpload />}
          {active === "onboarding" && <OnboardingForm />}
          {active === "ai" && <ChatPanel />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
