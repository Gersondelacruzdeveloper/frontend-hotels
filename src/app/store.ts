import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import hotelsReducer from "../features/hotels/hotelsSlice";
import convReducer from "../features/conversations/conversationsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    hotels: hotelsReducer,
    conversations: convReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
