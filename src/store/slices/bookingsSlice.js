import { createSlice, nanoid } from "@reduxjs/toolkit";

// Slot reservations made from the station detail page (validated form -> Redux).
const bookingsSlice = createSlice({
  name: "bookings",
  initialState: { items: [] },
  reducers: {
    addBooking: {
      reducer(state, action) {
        state.items.push(action.payload);
        state.items.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
      },
      prepare(booking) {
        return { payload: { id: nanoid(), ...booking } };
      },
    },
    cancelBooking(state, action) {
      state.items = state.items.filter((b) => b.id !== action.payload);
    },
  },
});

export const { addBooking, cancelBooking } = bookingsSlice.actions;
export default bookingsSlice.reducer;
