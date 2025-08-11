const WS_BASE = import.meta.env.VITE_WS_BASE;

// If your JWT WS middleware supports query param "token", append it:
export function staffWsUrl(hotelId: string, conversationId: string, token?: string) {
  const base = `${WS_BASE}/ws/hotel/staff/?hotel=${hotelId}&conversation=${conversationId}`;
  return token ? `${base}&token=${encodeURIComponent(token)}` : base;
}
export function guestWsUrl(hotelId: string, conversationId: string, guestSessionId: string) {
  return `${WS_BASE}/ws/hotel/guest/?hotel=${hotelId}&conversation=${conversationId}&guest_session=${guestSessionId}`;
}
