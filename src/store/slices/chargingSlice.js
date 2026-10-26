import { createSlice } from "@reduxjs/toolkit";
import { myVehicle } from "../../data/mockData.js";

const initialState = {
  status: "idle", // idle | charging | complete
  percent: myVehicle.batteryPercent,
  startPercent: myVehicle.batteryPercent,
  targetPercent: 90,
  stationId: 5,
};

const chargingSlice = createSlice({
  name: "charging",
  initialState,
  reducers: {
    selectStation(state, action) {
      if (state.status !== "charging") state.stationId = action.payload;
    },
    setTarget(state, action) {
      if (state.status === "charging") return;
      state.targetPercent = action.payload;
      if (state.status === "complete" && action.payload > state.percent) {
        state.status = "idle";
      }
    },
    startCharging(state) {
      if (state.status === "charging" || state.percent >= state.targetPercent) return;
      state.status = "charging";
      state.startPercent = state.percent;
    },
    stopCharging(state) {
      if (state.status === "charging") state.status = "idle";
    },
    tick(state) {
      if (state.status !== "charging") return;
      state.percent = Math.min(state.percent + 1, state.targetPercent);
      if (state.percent >= state.targetPercent) state.status = "complete";
    },
    drive(state, action) {
      if (state.status === "charging") return;
      state.percent = Math.max(0, state.percent - action.payload);
      state.status = "idle";
    },
  },
});

export const { selectStation, setTarget, startCharging, stopCharging, tick, drive } =
  chargingSlice.actions;
export default chargingSlice.reducer;
