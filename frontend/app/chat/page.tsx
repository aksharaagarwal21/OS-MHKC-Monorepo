"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@/hooks/useChat";
import ChatMessage from "@/components/chat/ChatMessage";
import VoiceInput from "@/components/features/VoiceInput";
import CrisisOverlay from "@/components/features/CrisisOverlay";
import Button from "@/components/ui/Button";

const PERSONAS = [
  { key: "empathy", label: "Empathetic", color: "bg-purple-500/20 text-purple-300" },
  { key: "cbt", label: "CBT Coach", color: "bg-cyan-500/20 text-cyan-300" },
  { key: "cultural", label: "Cultural", color: "bg-amber-500/20 text-amber-300" },
];

export default function ChatPage() {
  const { messages, isLoading, send } = useChat();
  const [input, setInput] = useState("");
  const [persona, setPersona] = useState("empathy");
  const [showCrisis, setShowCrisis] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    send(input.trim(), persona);
    setInput("");
  };

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto px-4 pt-16 pb-4">
      {/* Persona Selector */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {PERSONAS.map((p) => (
          <button
            key={p.key}
            onClick={() => setPersona(p.key)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              persona === p.key ? p.color : "bg-surface-lighter text-text-muted"
            }`}
          >
            {p.label}
          </button>
        ))}
        <button
          onClick={() => setShowCrisis(true)}
          className="ml-auto px-3 py-1.5 rounded-full text-xs font-medium bg-danger/20 text-danger hover:bg-danger/30 transition-colors"
        >
          🚨 Crisis Help
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full text-text-muted text-sm">
            Start a conversation — I&apos;m here to listen 💜
          </div>
        )}
        {messages.map((m) => (
          <ChatMessage key={m.id} role={m.role} content={m.content} persona={m.persona} />
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="glass px-4 py-3 rounded-2xl rounded-bl-md text-sm text-text-muted animate-pulse">
              Thinking…
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2 mt-3">
        <VoiceInput onResult={(t) => { setInput(t); }} />
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type your thoughts…"
          className="flex-1 bg-surface-light border border-surface-lighter rounded-xl px-4 py-2.5 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-colors"
        />
        <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
          Send
        </Button>
      </div>

      <CrisisOverlay visible={showCrisis} onClose={() => setShowCrisis(false)} />
    </div>
  );
}
