"use client";

import { motion } from "framer-motion";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  persona?: string;
}

const PERSONA_COLORS: Record<string, string> = {
  empathy: "from-purple-500 to-pink-500",
  cbt: "from-cyan-500 to-blue-500",
  cultural: "from-amber-500 to-orange-500",
};

export default function ChatMessage({ role, content, persona }: ChatMessageProps) {
  const isUser = role === "user";
  const gradient = persona ? PERSONA_COLORS[persona] || PERSONA_COLORS.empathy : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? "bg-primary text-white rounded-br-md"
            : `glass rounded-bl-md`
        }`}
      >
        {!isUser && persona && (
          <span
            className={`inline-block text-[10px] font-semibold uppercase tracking-widest mb-1 bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}
          >
            {persona}
          </span>
        )}
        <p>{content}</p>
      </div>
    </motion.div>
  );
}
