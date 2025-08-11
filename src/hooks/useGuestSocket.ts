import { useEffect, useRef, useState } from "react";
import { guestWsUrl } from "../lib/ws";

export function useGuestSocket(hotelId: string, conversationId: string, guestSessionId: string) {
  const [messages, setMessages] = useState<any[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const url = guestWsUrl(hotelId, conversationId, guestSessionId);
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onmessage = (evt) => {
      try {
        const data = JSON.parse(evt.data);
        if (data.type === "chat_message") setMessages((p) => [...p, data]);
      } catch {}
    };

    return () => { ws.close(); wsRef.current = null; };
  }, [hotelId, conversationId, guestSessionId]);

  const sendMessage = (text: string, source_lang = "en") =>
    wsRef.current?.send(JSON.stringify({ type: "send_message", text, source_lang }));

  return { messages, sendMessage };
}
