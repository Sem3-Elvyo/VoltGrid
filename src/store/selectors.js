// Memoised selectors (createSelector = "reselect"). They only recompute when
// their inputs change, so components don't re-render for no reason.
import { createSelector } from "@reduxjs/toolkit";
import { selectAllStations } from "./slices/stationsSlice.js";
import { scoreStation } from "../utils/scoring.js";

const selectFilters = (state) => state.filters;
const selectFavoriteIds = (state) => state.favorites.ids;
const selectWeights = (state) => state.preferences.weights;
const selectVehicle = (state) => state.profile.vehicle;
const selectSessions = (state) => state.history.sessions;

export { selectFilters, selectVehicle, selectSessions };

export const selectFilteredStations = createSelector(
  [selectAllStations, selectFilters],
  (stations, f) => {
    const query = f.search.trim().toLowerCase();
    const result = stations.filter((s) => {
      if (query && !s.name.toLowerCase().includes(query)) return false;
      if (f.type !== "all" && s.type !== f.type) return false;
      if (f.fastOnly && s.power < 50) return false;
      if (f.availableOnly && !s.available) return false;
      if (s.price > f.maxPrice) return false;
      if (s.distanceKm > f.maxDistance) return false;
      return true;
    });
    const sorters = {
      distance: (a, b) => a.distanceKm - b.distanceKm,
      price: (a, b) => a.price - b.price,
      power: (a, b) => b.power - a.power,
      rating: (a, b) => b.rating - a.rating,
    };
    return [...result].sort(sorters[f.sortBy]);
  }
);

export const selectFavoriteStations = createSelector(
  [selectAllStations, selectFavoriteIds],
  (stations, ids) => stations.filter((s) => ids.includes(s.id))
);

export const selectTrendingStations = createSelector(
  [selectAllStations],
  (stations) => [...stations].sort((a, b) => b.rating - a.rating).slice(0, 3)
);

export const selectAveragePrice = createSelector([selectAllStations], (stations) =>
  stations.length
    ? stations.reduce((sum, s) => sum + s.price, 0) / stations.length
    : 0
);

export const selectRankedStations = createSelector(
  [selectAllStations, selectWeights, selectVehicle],
  (stations, weights, vehicle) =>
    stations
      .map((s) => ({
        ...s,
        ...scoreStation(s, weights, vehicle.maxChargingSpeedKw),
      }))
      .sort((a, b) => b.score - a.score)
);

export const selectHistoryStats = createSelector([selectSessions], (sessions) => {
  const totalCost = sessions.reduce((sum, h) => sum + h.cost, 0);
  const totalEnergy = sessions.reduce((sum, h) => sum + h.energyKwh, 0);
  return {
    count: sessions.length,
    totalCost,
    totalEnergy,
    avgCostPerKwh: totalEnergy ? totalCost / totalEnergy : 0,
  };
});
