"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface RealtimeMessage {
  id: number;
  content: string;
  role: string;
  user_id: string;
  created_at: string;
}

/**
 * Subscribe to a Supabase Realtime channel for live group-chat messages.
 * Returns the list of live messages received since mounting.
 */
export function useRealtimePod(channel = "group-chat") {
  const [liveMessages, setLiveMessages] = useState<RealtimeMessage[]>([]);

  useEffect(() => {
    const sub = supabase
      .channel(channel)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          setLiveMessages((prev) => [...prev, payload.new as RealtimeMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(sub);
    };
  }, [channel]);

  return liveMessages;
}
