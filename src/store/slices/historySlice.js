import { createSlice, nanoid } from "@reduxjs/toolkit";
import { chargingHistory } from "../../data/mockData.js";

const historySlice = createSlice({
  name: "history",
  initialState: {
    sessions: chargingHistory.map((h, i) => ({ id: `seed-${i}`, ...h })),
  },
  reducers: {
    addSession: {
      // `prepare` generates the id OUTSIDE the reducer so the reducer stays pure.
      reducer(state, action) {
        state.sessions.unshift(action.payload);
      },
      prepare(session) {
        return { payload: { id: nanoid(), ...session } };
      },
    },
    removeSession(state, action) {
      state.sessions = state.sessions.filter((s) => s.id !== action.payload);
    },
  },
});

export const { addSession, removeSession } = historySlice.actions;
export default historySlice.reducer;
