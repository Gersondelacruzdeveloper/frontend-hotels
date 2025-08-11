import { createSlice } from "@reduxjs/toolkit";

type HotelsState = {
  currentHotelId: string | null;
};

const initial: HotelsState = { currentHotelId: null };

const slice = createSlice({
  name: "hotels",
  initialState: initial,
  reducers: {
    setCurrentHotel(state, action) {
      state.currentHotelId = action.payload;
    },
  },
});

export const { setCurrentHotel } = slice.actions;
export default slice.reducer;
