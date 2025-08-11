import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchConversations } from "../features/conversations/conversationsSlice";
import { RootState } from "../app/store";
import { Link, useLocation, useParams } from "react-router-dom";

type StatusTab = "open" | "pending" | "closed";

function cx(...xs: Array<string | false | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function relTime(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function ConversationList() {
  const { hotelId = "", convId } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();

  const { items, loading } = useSelector((s: RootState) => s.conversations);
  const [status, setStatus] = useState<StatusTab>("open");
  const [q, setQ] = useState("");
  const [focusIdx, setFocusIdx] = useState(-1);

  useEffect(() => {
    if (hotelId) (dispatch as any)(fetchConversations({ hotelId, status }));
  }, [hotelId, status, dispatch]);

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return items;
    return items.filter((c: any) => {
      const dept = c?.department?.name?.toLowerCase() || "";
      const room = String(c?.room_number || "").toLowerCase();
      const subj = (c?.subject || "").toLowerCase();
      const lang = (c?.guest_language || "").toLowerCase();
      return dept.includes(t) || room.includes(t) || subj.includes(t) || lang.includes(t);
    });
  }, [items, q]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!["ArrowDown", "ArrowUp", "Enter"].includes(e.key)) return;
      if (filtered.length === 0) return;
      e.preventDefault();
      if (e.key === "ArrowDown") setFocusIdx((i) => Math.min(i + 1, filtered.length - 1));
      if (e.key === "ArrowUp") setFocusIdx((i) => Math.max(i - 1, 0));
      if (e.key === "Enter" && focusIdx >= 0) {
        const c = filtered[focusIdx];
        window.location.assign(`/hotels/${hotelId}/conversations/${c.id}`);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [filtered, focusIdx, hotelId]);

  const counts = useMemo(() => {
    const base: Record<StatusTab, number> = { open: 0, pending: 0, closed: 0 };
    for (const c of items as any[]) base[c.status as StatusTab] = (base[c.status as StatusTab] || 0) + 1;
    return base;
  }, [items]);

  return (
    <aside>
      {/* Header */}
      <div className="p-3 border-b">
        {/* Search */}
        <div className="mt-3 relative">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search room, dept, subject…"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 focus:bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-200"
          />
          {q && (
            <button
              onClick={() => setQ("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
          {(["open", "pending", "closed"] as StatusTab[]).map((t) => (
            <button
              key={t}
              onClick={() => setStatus(t)}
              className={cx(
                "rounded-lg border px-3 py-1.5 capitalize transition",
                status === t
                  ? "bg-indigo-600 border-indigo-600 text-white"
                  : "bg-white border-slate-200 hover:bg-slate-50"
              )}
            >
              {t}
              {!!counts[t] && (
                <span
                  className={cx(
                    "ml-2 inline-flex items-center justify-center rounded-full text-[10px] px-1.5",
                    status === t ? "bg-white/20 text-white" : "bg-slate-100 text-slate-700"
                  )}
                >
                  {counts[t]}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {loading && (
          <ul className="p-3 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <li key={i} className="animate-pulse">
                <div className="h-4 w-28 bg-slate-200 rounded mb-2" />
                <div className="h-3 w-44 bg-slate-100 rounded" />
              </li>
            ))}
          </ul>
        )}

        {!loading && filtered.length === 0 && (
          <div className="p-6 text-center text-slate-500 text-sm">No conversations found.</div>
        )}

        {!loading && filtered.length > 0 && (
          <ul className="divide-y">
            {filtered.map((c: any, idx: number) => {
              const active = convId === c.id || focusIdx === idx;
              const href = `/hotels/${hotelId}/conversations/${c.id}`;
              const when = relTime(c.last_message_at);
              const dept = c?.department?.name || "General";
              const lang = (c?.guest_language || "—").toUpperCase();
              const unread = c?.unread_count || 0;

              return (
                <li key={c.id} className={cx("group relative", active ? "bg-indigo-50" : "bg-white hover:bg-slate-50")}>
                  <Link to={href} className="block p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-emerald-500/90 grid place-items-center text-white text-xs font-semibold">
                            {String(c.room_number || "?").slice(0, 3)}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <div className="font-medium truncate">Room {c.room_number || "—"}</div>
                              <span className="text-[10px] rounded px-1.5 py-0.5 bg-slate-100 text-slate-700">{dept}</span>
                              <span className="text-[10px] rounded px-1.5 py-0.5 bg-indigo-100 text-indigo-700">{lang}</span>
                            </div>
                            <div className="text-xs text-slate-500 truncate">{c.subject || "No subject"}</div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-[11px] text-slate-500">{when}</span>
                        {unread > 0 && (
                          <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-indigo-600 text-white text-[10px] grid place-items-center">
                            {unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                  {active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 rounded-r" />}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Footer actions */}
    </aside>
  );
}
