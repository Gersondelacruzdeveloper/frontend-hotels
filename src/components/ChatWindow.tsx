import { useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMessages } from "../features/conversations/conversationsSlice";
import { RootState } from "../app/store";
import { useParams } from "react-router-dom";
import MessageBubble from "./MessageBubble";

function dayKey(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }).toUpperCase();
}
const fmtTime = (iso: string) =>
  new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export default function ChatWindow() {
  const { hotelId = "", convId = "" } = useParams();
  const dispatch = useDispatch();
  const list = useSelector((s: RootState) => s.conversations.messages[convId] || []);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (hotelId && convId) (dispatch as any)(fetchMessages({ hotelId, conversationId: convId }));
  }, [hotelId, convId, dispatch]);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [list.length]);

  // group by day + cluster adjacent messages by same sender
  const groups = useMemo(() => {
    const byDay = new Map<string, any[]>();
    for (const m of list) {
      const k = dayKey(m.created_at);
      if (!byDay.has(k)) byDay.set(k, []);
      byDay.get(k)!.push(m);
    }
    return Array.from(byDay.entries()).map(([day, msgs]) => {
      const clustered = msgs.map((m, i) => {
        const prev = msgs[i - 1];
        const next = msgs[i + 1];
        const firstInGroup = !prev || prev.sender_type !== m.sender_type;
        const lastInGroup = !next || next.sender_type !== m.sender_type;
        return { ...m, firstInGroup, lastInGroup, showAvatar: lastInGroup };
      });
      return [day, clustered] as const;
    });
  }, [list]);

  return (
    <div ref={scroller} className="h-full overflow-y-auto chat-wallpaper scroll-smooth">
      <div className="px-3 sm:px-6 py-4 space-y-6">
        {groups.map(([day, msgs]) => (
          <div key={day} className="space-y-2">
            <div className="sticky top-2 z-10 w-full grid place-items-center">
              <span className="text-[11px] bg-white/80 backdrop-blur px-3 py-1 rounded-full border text-slate-600">
                {day}
              </span>
            </div>

            {msgs.map((m: any) => (
              <MessageBubble
                key={m.id}
                mine={m.sender_type === "staff"}
                text={m.translated_text || m.text}
                time={fmtTime(m.created_at)}
                showAvatar={m.showAvatar}
                initials={m.sender_type === "staff" ? "S" : "G"}
                firstInGroup={m.firstInGroup}
                lastInGroup={m.lastInGroup}
              />
            ))}
          </div>
        ))}

        {list.length === 0 && (
          <div className="h-[60vh] grid place-items-center">
            <div className="text-center">
              <div className="text-4xl mb-2">💬</div>
              <div className="font-medium">No messages yet</div>
              <div className="text-sm text-slate-500">Say hello to the guest to get started.</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
