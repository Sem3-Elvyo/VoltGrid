import { createSlice } from "@reduxjs/toolkit";
import { currentUser, myVehicle } from "../../data/mockData.js";
import { loginUser } from "./authSlice.js";

const initialState = {
  name: currentUser.name,
  email: currentUser.email,
  vehicle: {
    make: myVehicle.make,
    model: myVehicle.model,
    connector: myVehicle.connector,
    batteryCapacityKwh: myVehicle.batteryCapacityKwh,
    maxChargingSpeedKw: myVehicle.maxChargingSpeedKw,
    fullRangeKm: 330,
  },
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    updateProfile(state, action) {
      const { name, email, vehicle } = action.payload;
      state.name = name;
      state.email = email;
      Object.assign(state.vehicle, vehicle);
    },
  },
  // One slice reacting to another slice's action.
  extraReducers: (builder) => {
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.email = action.payload.email;
    });
  },
});

export const { updateProfile } = profileSlice.actions;
export default profileSlice.reducer;
