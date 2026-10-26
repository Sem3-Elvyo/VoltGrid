import { createSlice, nanoid } from "@reduxjs/toolkit";

const notificationsSlice = createSlice({
  name: "notifications",
  initialState: { items: [] },
  reducers: {
    notify: {
      reducer(state, action) {
        state.items.push(action.payload);
        if (state.items.length > 4) state.items.shift();
      },
      prepare({ type = "info", message }) {
        return { payload: { id: nanoid(), type, message } };
      },
    },
    dismiss(state, action) {
      state.items = state.items.filter((n) => n.id !== action.payload);
    },
  },
});

export const { notify, dismiss } = notificationsSlice.actions;
export default notificationsSlice.reducer;
