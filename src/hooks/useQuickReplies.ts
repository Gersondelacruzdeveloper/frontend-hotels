// src/hooks/useQuickReplies.ts
import { useEffect, useMemo, useState } from "react";
import api from "../lib/api";

export type QuickReply = {
  id: string;
  title: string;
  body: string;
  department?: { id: string; name: string } | null;
  is_active?: boolean;
};

export function useQuickReplies(hotelId?: string, departmentId?: string) {
  const [items, setItems] = useState<QuickReply[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!hotelId) return;
    setLoading(true);
    const params: any = { hotel: hotelId };
    if (departmentId) params.department = departmentId;
    api
      .get("/hotels/quick-replies/", { params })
      .then((r) => setItems(r.data))
      .catch((e) => setErr(e?.response?.data?.detail || "Failed to load"))
      .finally(() => setLoading(false));
  }, [hotelId, departmentId]);

  // local pinning (persist in localStorage for the staff user)
  const key = hotelId ? `ml.qr.pins.${hotelId}` : "ml.qr.pins";
  const pins = useMemo<string[]>(
    () => JSON.parse(localStorage.getItem(key) || "[]"),
    [key]
  );

  const togglePin = (id: string) => {
    const next = pins.includes(id) ? pins.filter((x) => x !== id) : [...pins, id];
    localStorage.setItem(key, JSON.stringify(next));
    // re-render by touching state
    setItems((prev) => [...prev]);
  };

  const ordered = useMemo(() => {
    if (!pins.length) return items;
    const map = new Map(items.map((i) => [i.id, i]));
    const pinned = pins.map((id) => map.get(id)).filter(Boolean) as QuickReply[];
    const rest = items.filter((i) => !pins.includes(i.id));
    return [...pinned, ...rest];
  }, [items, pins]);

  return { items: ordered, loading, err, togglePin, pins };
}
