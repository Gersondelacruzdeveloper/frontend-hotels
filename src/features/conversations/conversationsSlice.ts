import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "../../lib/api";
import { Conversation, MessageDTO, UUID } from "../../lib/types";

type ConvState = {
  /** selected property context (used by admin + inbox) */
  currentHotel: { id: UUID; name?: string; logo?: string } | null;  // <-- NEW
  /** which conversation is open in UI (optional helper) */
  currentConversationId?: UUID;                                      // <-- NEW

  items: Conversation[];
  messages: Record<UUID, MessageDTO[]>;
  loading: boolean;
  error?: string;
};

const initial: ConvState = {
  currentHotel: null,        // <-- NEW
  currentConversationId: undefined, // <-- NEW
  items: [],
  messages: {},
  loading: false,
};

export const fetchConversations = createAsyncThunk(
  "conversations/fetch",
  async ({ hotelId, status }: { hotelId: UUID; status?: string }) => {
    const qs = new URLSearchParams({ hotel: hotelId, ...(status ? { status } : {}) });
    const { data } = await api.get(`/hotels/conversations/?${qs.toString()}`);
    console.log('data=>', data)
    return data as Conversation[];
  }
);

export const fetchMessages = createAsyncThunk(
  "conversations/messages",
  async ({ hotelId, conversationId }: { hotelId: UUID; conversationId: UUID }) => {
    const qs = new URLSearchParams({ hotel: hotelId, conversation: conversationId });
    const { data } = await api.get(`/hotels/messages/?${qs.toString()}`);
    return { conversationId, data: data as MessageDTO[] };
  }
);

const slice = createSlice({
  name: "conversations",
  initialState: initial,
  reducers: {
    /** set the active property (used by Admin hotel switcher) */
    setCurrentHotel(state, action: PayloadAction<ConvState["currentHotel"]>) { // <-- NEW
      state.currentHotel = action.payload;
      // optional: clear lists when switching properties
      state.items = [];
      state.messages = {};
      state.currentConversationId = undefined;
    },
    /** track which conversation is open in UI */
    setCurrentConversation(state, action: PayloadAction<UUID | undefined>) {   // <-- NEW
      state.currentConversationId = action.payload;
    },
    appendMessage(state, action) {
      const { conversationId, msg } = action.payload as { conversationId: UUID; msg: MessageDTO };
      state.messages[conversationId] = [...(state.messages[conversationId] || []), msg];
    },
  },
  extraReducers: (b) => {
    b.addCase(fetchConversations.pending, (s) => { s.loading = true; });
    b.addCase(fetchConversations.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; });
    b.addCase(fetchConversations.rejected, (s, a) => { s.loading = false; s.error = a.error.message; });

    b.addCase(fetchMessages.fulfilled, (s, a) => {
      s.messages[a.payload.conversationId] = a.payload.data;
    });
  },
});

export const { setCurrentHotel, setCurrentConversation, appendMessage } = slice.actions; // <-- UPDATED
export default slice.reducer;
