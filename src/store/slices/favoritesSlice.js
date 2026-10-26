import { createSlice } from "@reduxjs/toolkit";

const favoritesSlice = createSlice({
  name: "favorites",
  initialState: { ids: [1, 5] },
  reducers: {
    toggleFavorite(state, action) {
      const id = action.payload;
      state.ids = state.ids.includes(id)
        ? state.ids.filter((x) => x !== id)
        : [...state.ids, id];
    },
  },
});

export const { toggleFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;
