import { useChat } from "@/hooks/useChat";
import { ChatMessages } from "./ChatMessages";

export const ChatPanel = () => {
  const { messages, input, setInput, loading, send } = useChat();

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <div className="flex flex-col h-[600px] card-glow rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-foreground/10">
        <h3 className="font-semibold text-base">AI Assistant</h3>
        <p className="text-xs text-foreground/50 mt-0.5">Answers based on your knowledge base & uploaded documents</p>
      </div>

      <ChatMessages messages={messages} loading={loading} />

      {/* Suggested prompts — only show when empty */}
      {messages.length === 0 && (
        <div className="px-4 pb-3 flex flex-wrap gap-2">
          {[
            "What does this platform do?",
            "How does benefits verification work?",
            "What files did I upload?",
          ].map((q) => (
            <button
              key={q}
              onClick={() => send(q)}
              className="text-xs px-3 py-1.5 rounded-full border border-foreground/15 text-foreground/60 hover:border-primary/50 hover:text-primary transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="px-4 py-3 border-t border-foreground/10">
        <div className="flex items-center gap-2 bg-foreground/5 rounded-full px-4 py-2.5">
          <input
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-foreground/40"
            placeholder="Ask about your documents or platform…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            disabled={loading}
            autoFocus
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
        <p className="text-xs text-foreground/30 text-center mt-2">Powered by GPT-4o mini</p>
      </div>
    </div>
  );
};
