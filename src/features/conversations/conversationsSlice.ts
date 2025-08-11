import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../lib/api";
import { Conversation, MessageDTO, UUID } from "../../lib/types";

type ConvState = {
  items: Conversation[];
  messages: Record<UUID, MessageDTO[]>;
  loading: boolean;
  error?: string;
};

const initial: ConvState = {
  items: [],
  messages: {},
  loading: false,
};

export const fetchConversations = createAsyncThunk(
  "conversations/fetch",
  async ({ hotelId, status }: { hotelId: UUID; status?: string }) => {
    const qs = new URLSearchParams({ hotel: hotelId, ...(status ? { status } : {}) });
    const { data } = await api.get(`/hotels/conversations/?${qs.toString()}`);
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

export const { appendMessage } = slice.actions;
export default slice.reducer;
