import { useEffect, useRef } from "react";
import { staffWsUrl } from "../lib/ws";
import { useDispatch } from "react-redux";
import { appendMessage } from "../features/conversations/conversationsSlice";

export function useStaffSocket(hotelId: string, conversationId: string, token?: string) {
  const wsRef = useRef<WebSocket | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!hotelId || !conversationId) return;
    const url = staffWsUrl(hotelId, conversationId, token);
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onmessage = (evt) => {
      try {
        const data = JSON.parse(evt.data);
        if (data.type === "chat_message") {
          dispatch(appendMessage({
            conversationId,
            msg: {
              id: data.message_id,
              conversation: conversationId,
              hotel: hotelId,
              sender_type: data.sender,
              text: data.text,
              source_lang: data.source_lang,
              target_lang: data.target_lang,
              created_at: data.created_at,
            }
          }));
        }
      } catch { /* noop */ }
    };

    return () => { ws.close(); wsRef.current = null; };
  }, [hotelId, conversationId, token, dispatch]);

  function sendMessage(text: string, source_lang = "es") {
    wsRef.current?.send(JSON.stringify({ type: "send_message", text, source_lang }));
  }

  function sendTyping(is_typing: boolean) {
    wsRef.current?.send(JSON.stringify({ type: "typing", is_typing }));
  }

  return { sendMessage, sendTyping };
}
