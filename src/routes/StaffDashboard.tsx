import { useMemo } from "react";
import { useParams } from "react-router-dom";
import Topbar from "../components/Topbar";
import ConversationList from "../components/ConversationList";
import ChatWindow from "../components/ChatWindow";
import MessageInput from "../components/MessageInput";
import QuickReplies from "../components/QuickReplies";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import { useStaffSocket } from "../hooks/useStaffSocket";
import api from "../lib/api";

export default function StaffDashboard() {
  const { hotelId = "", convId = "" } = useParams();
  const token = useSelector((s: RootState) => s.auth.token);
  const { sendMessage, sendTyping, connected } = useStaffSocket(hotelId, convId, token || undefined);

  const hasConversation = useMemo(() => Boolean(hotelId && convId), [hotelId, convId]);

  const onAttach = async (file: File) => {
    const form = new FormData();
    form.append("file", file);
    try {
      await api.post("/upload-file", form, { headers: { "Content-Type": "multipart/form-data" } });
      // You can forward the file_url via WS here when ready
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="h-screen w-full bg-slate-100">
      {/* App topbar */}
          <Topbar />
      {/* 2-pane app area */}
      <div className="h-[calc(100vh-56px)] max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-[380px_1fr]">
        {/* Left rail */}
        <aside className="border-r bg-white min-h-0">
          <ConversationList />
        </aside>

        {/* Chat column */}
        <section className="min-h-0 flex flex-col">
          {/* Chat header (sticky like WhatsApp) */}
   
          {/* Chat body */}
          <div className="flex-1 min-h-0">
            <ChatWindow />
          </div>

          {/* Quick replies + composer */}
          {hasConversation && (
            <>
              <div className="border-t bg-white">
                <QuickReplies hotelId={hotelId} onPick={(t) => sendMessage(t)} />
              </div>
              <div className="border-t bg-white">
                <MessageInput
                  onSend={(t) => sendMessage(t)}
                  onTyping={(is) => sendTyping?.(is)}
                  onAttach={onAttach}
                  placeholder="Type a message"
                  maxLength={2000}
                />
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
