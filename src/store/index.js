import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.js";
import profileReducer from "./slices/profileSlice.js";
import stationsReducer from "./slices/stationsSlice.js";
import favoritesReducer from "./slices/favoritesSlice.js";
import filtersReducer from "./slices/filtersSlice.js";
import chargingReducer from "./slices/chargingSlice.js";
import historyReducer from "./slices/historySlice.js";
import preferencesReducer from "./slices/preferencesSlice.js";
import bookingsReducer from "./slices/bookingsSlice.js";
import notificationsReducer from "./slices/notificationsSlice.js";
import { listenerMiddleware } from "./listeners.js";
import { persistMiddleware, loadPersistedState } from "./persist.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    stations: stationsReducer,
    favorites: favoritesReducer,
    filters: filtersReducer,
    charging: chargingReducer,
    history: historyReducer,
    preferences: preferencesReducer,
    bookings: bookingsReducer,
    notifications: notificationsReducer,
  },
  preloadedState: loadPersistedState(),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .prepend(listenerMiddleware.middleware)
      .concat(persistMiddleware),
  // Redux DevTools is enabled automatically in development.
});
