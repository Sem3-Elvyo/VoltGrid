import { createSlice } from "@reduxjs/toolkit";

export const PRESETS = {
  balanced: { distance: 5, speed: 5, price: 5, rating: 5, queue: 5, availability: 8 },
  cheapest: { distance: 3, speed: 2, price: 10, rating: 3, queue: 4, availability: 6 },
  fastest: { distance: 4, speed: 10, price: 2, rating: 3, queue: 7, availability: 8 },
  closest: { distance: 10, speed: 3, price: 3, rating: 2, queue: 5, availability: 7 },
};

const preferencesSlice = createSlice({
  name: "preferences",
  initialState: { preset: "balanced", weights: PRESETS.balanced },
  reducers: {
    setWeight(state, action) {
      const { key, value } = action.payload;
      state.weights[key] = value;
      state.preset = "custom";
    },
    applyPreset(state, action) {
      state.preset = action.payload;
      state.weights = { ...PRESETS[action.payload] };
    },
  },
});

export const { setWeight, applyPreset } = preferencesSlice.actions;
export default preferencesSlice.reducer;
