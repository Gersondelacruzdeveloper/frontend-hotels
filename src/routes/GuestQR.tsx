import { useEffect, useState } from "react";
import api from "../lib/api";
import { useGuestSocket } from "../hooks/useGuestSocket";
import { useParams } from "react-router-dom";

export default function GuestQR() {
  const { slug = "" } = useParams();
  const [info, setInfo] = useState<any | null>(null);
  const [text, setText] = useState("");

  const ws = info ? useGuestSocket(info.conversation.hotel, info.conversation.id, info.guest_session.id) : null;

  useEffect(() => {
    (async () => {
      const { data } = await api.post(`/hotels/guest/${slug}/session/`, { guest_language: "en" });
      setInfo(data);
    })();
  }, [slug]);

  if (!info) return <div className="p-6">Connecting…</div>;

  return (
    <div className="h-screen grid grid-rows-[auto_1fr_auto]">
      <header className="p-4 border-b">Chat with {info.conversation.department?.name || "Hotel"}</header>
      <main className="p-4 space-y-2 overflow-auto bg-gray-50">
        {ws?.messages.map((m, i) => (
          <div key={i} className={`max-w-lg ${m.sender === "guest" ? "ml-auto text-right" : ""}`}>
            <div className="inline-block bg-white rounded-xl px-3 py-2 shadow">{m.text}</div>
          </div>
        ))}
      </main>
      <div className="p-3 border-t bg-white flex gap-2">
        <input className="flex-1 border rounded px-3 py-2" value={text} onChange={(e)=>setText(e.target.value)}
               onKeyDown={(e)=>{ if(e.key==="Enter"){ ws?.sendMessage(text,"en"); setText(""); }}} />
        <button className="bg-black text-white px-4 py-2 rounded" onClick={()=>{ ws?.sendMessage(text,"en"); setText(""); }}>
          Send
        </button>
      </div>
    </div>
  );
}
