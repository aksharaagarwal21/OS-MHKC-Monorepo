import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

export interface ChatPayload {
  message: string;
  persona?: string;
}

export interface ChatReply {
  reply: string;
  persona: string;
}

export async function sendChatMessage(payload: ChatPayload): Promise<ChatReply> {
  const { data } = await api.post<ChatReply>("/api/v1/chat", payload);
  return data;
}

export default api;
