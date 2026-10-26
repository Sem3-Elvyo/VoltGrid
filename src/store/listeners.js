// Listener middleware = "side effects as reactions to actions".
// Reducers must stay pure, so anything that needs to dispatch MORE actions
// after something happened (toasts, saving a session...) lives here.
import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { liveStatusUpdated } from "./slices/stationsSlice.js";
import { toggleFavorite } from "./slices/favoritesSlice.js";
import { tick, stopCharging, drive } from "./slices/chargingSlice.js";
import { addSession } from "./slices/historySlice.js";
import { notify } from "./slices/notificationsSlice.js";

export const listenerMiddleware = createListenerMiddleware();

// 1) A favourite station just became free -> tell the user.
listenerMiddleware.startListening({
  actionCreator: liveStatusUpdated,
  effect: (action, api) => {
    const { id, available } = action.payload;
    const before = api.getOriginalState().stations.entities[id];
    const isFavorite = api.getState().favorites.ids.includes(id);
    if (before && !before.available && available && isFavorite) {
      api.dispatch(
        notify({ type: "success", message: `${before.name} (favourite) is now available` })
      );
    }
  },
});

// 2) Favourite added / removed -> confirmation toast.
listenerMiddleware.startListening({
  actionCreator: toggleFavorite,
  effect: (action, api) => {
    const station = api.getState().stations.entities[action.payload];
    if (!station) return;
    const added = api.getState().favorites.ids.includes(action.payload);
    api.dispatch(
      notify({
        type: "info",
        message: `${added ? "Added" : "Removed"} ${station.name} ${added ? "to" : "from"} favourites`,
      })
    );
  },
});

// 3) A charging session just ended (finished OR stopped) -> save it to history.
listenerMiddleware.startListening({
  matcher: isAnyOf(tick, stopCharging),
  effect: (action, api) => {
    const before = api.getOriginalState().charging;
    const state = api.getState();
    const after = state.charging;
    const justEnded = before.status === "charging" && after.status !== "charging";
    if (!justEnded || after.percent <= after.startPercent) return;

    const station = state.stations.entities[after.stationId];
    const energyKwh =
      ((after.percent - after.startPercent) / 100) *
      state.profile.vehicle.batteryCapacityKwh;
    const cost = Math.round(energyKwh * (station?.price ?? 8));

    api.dispatch(
      addSession({
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit" }),
        station: (station?.name ?? "Unknown").split(" - ")[0],
        energyKwh: Number(energyKwh.toFixed(1)),
        cost,
      })
    );
    api.dispatch(
      notify({
        type: "success",
        message: `Session saved: ${energyKwh.toFixed(1)} kWh for ₹${cost}`,
      })
    );
  },
});

// 4) Battery low after driving -> warning.
listenerMiddleware.startListening({
  actionCreator: drive,
  effect: (action, api) => {
    const { percent } = api.getState().charging;
    if (percent <= 20) {
      api.dispatch(
        notify({ type: "warning", message: `Battery low (${percent}%). Check the Recommended page.` })
      );
    }
  },
});
