"use client";

import { useState, useCallback } from "react";
import { sendChatMessage, ChatReply } from "@/lib/api";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  persona?: string;
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const send = useCallback(async (text: string, persona = "empathy") => {
    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const reply: ChatReply = await sendChatMessage({ message: text, persona });
      const botMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: reply.reply,
        persona: reply.persona,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      const errMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "Sorry, I couldn't connect to the server. Please try again.",
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { messages, isLoading, send };
}
