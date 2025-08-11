import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api, { setAuthHeader } from "../../lib/api";

type AuthState = {
  token: string | null;
  refresh: string | null;
  loading: boolean;
  error?: string;
};

const initialState: AuthState = {
  token: localStorage.getItem("ml_staff_token"),
  refresh: localStorage.getItem("ml_staff_refresh"),
  loading: false,
};

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (payload: { username: string; password: string }) => {
    const { data } = await api.post("/accounts/token/", payload);
    return data as { access: string; refresh: string };
  }
);

export const logoutThunk = createAsyncThunk("auth/logout", async () => {
  // if you have a backend logout, call it here.
  return true;
});

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken(state, action) {
      state.token = action.payload;
      if (state.token) localStorage.setItem("ml_staff_token", state.token);
      else localStorage.removeItem("ml_staff_token");
      setAuthHeader(state.token || undefined);
    },
  },
  extraReducers: (b) => {
    b.addCase(loginThunk.pending, (s) => { s.loading = true; s.error = undefined; });
    b.addCase(loginThunk.fulfilled, (s, a) => {
      s.loading = false;
      s.token = a.payload.access;
      s.refresh = a.payload.refresh;
      localStorage.setItem("ml_staff_token", a.payload.access);
      localStorage.setItem("ml_staff_refresh", a.payload.refresh);
      setAuthHeader(a.payload.access);
    });
    b.addCase(loginThunk.rejected, (s, a) => {
      s.loading = false;
      s.error = a.error.message || "Login failed";
    });
    b.addCase(logoutThunk.fulfilled, (s) => {
      s.token = null;
      s.refresh = null;
      localStorage.removeItem("ml_staff_token");
      localStorage.removeItem("ml_staff_refresh");
      setAuthHeader(undefined);
    });
  },
});

export const { setToken } = slice.actions;
export default slice.reducer;
