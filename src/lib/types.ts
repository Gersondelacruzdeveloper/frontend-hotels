export type UUID = string;

export interface Department {
  id: UUID;
  name: string;
  slug: string;
}

export interface Conversation {
  id: UUID;
  hotel: UUID;
  status: "open" | "pending" | "closed";
  department?: Department | null;
  room_number?: string | null;
  guest_language?: string | null;
  subject?: string | null;
  created_at: string;
  last_message_at: string;
}

export interface MessageDTO {
  id: UUID;
  conversation: UUID;
  hotel: UUID;
  sender_type: "guest" | "staff" | "system";
  sender_guest?: UUID | null;
  text: string;
  source_lang: string;
  image_url?: string;
  file_url?: string;
  translated_text?: string;
  target_lang?: string;
  translation_confidence?: string;
  is_quick_reply?: boolean;
  created_at: string;
}
