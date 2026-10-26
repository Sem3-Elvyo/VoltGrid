import { createSlice } from "@reduxjs/toolkit";

export const initialFilters = {
  search: "",
  type: "all",
  fastOnly: false,
  availableOnly: false,
  maxPrice: 15,
  maxDistance: 15,
  sortBy: "distance", // distance | price | power | rating
};

const filtersSlice = createSlice({
  name: "filters",
  initialState: initialFilters,
  reducers: {
    setFilter(state, action) {
      const { key, value } = action.payload;
      state[key] = value;
    },
    resetFilters: () => initialFilters,
  },
});

export const { setFilter, resetFilters } = filtersSlice.actions;
export default filtersSlice.reducer;
