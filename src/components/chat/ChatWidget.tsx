import { useState } from "react";
import { useChat } from "@/hooks/useChat";
import { ChatMessages } from "./ChatMessages";

export const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const { messages, input, setInput, loading, send } = useChat();

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat window */}
      {open && (
        <div className="w-[340px] h-[480px] card-glow rounded-2xl flex flex-col overflow-hidden shadow-2xl"
             style={{ background: "hsl(var(--background))" }}>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-foreground/10">
            <div className="flex items-center gap-2">
              <span className="relative inline-flex h-6 w-6 items-center justify-center rounded-full border border-primary/40">
                <span className="absolute inset-0.5 rounded-full border border-primary/60" />
                <span className="absolute bottom-0 right-0 h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_6px_hsl(var(--primary))]" />
              </span>
              <span className="text-sm font-semibold">Ask anything</span>
            </div>
            <button onClick={() => setOpen(false)}
              className="text-foreground/40 hover:text-foreground transition-colors text-lg leading-none">×</button>
          </div>

          <ChatMessages messages={messages} loading={loading} />

          {/* Input */}
          <div className="px-3 py-3 border-t border-foreground/10">
            <div className="flex items-center gap-2 bg-foreground/5 rounded-full px-4 py-2">
              <input
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-foreground/40"
                placeholder="Type a message…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                disabled={loading}
              />
              <button
                onClick={() => send()}
                disabled={!input.trim() || loading}
                className="text-primary disabled:text-foreground/20 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="h-14 w-14 rounded-full btn-gradient text-white shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
      >
        {open ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>
    </div>
  );
};
