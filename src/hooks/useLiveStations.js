import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { liveStatusUpdated, selectStationIds } from "../store/slices/stationsSlice.js";

// Simulates a real-time feed: every few seconds one station changes
// availability / queue length. Randomness lives here, NOT in the reducer.
export function useLiveStations(intervalMs = 7000) {
  const dispatch = useDispatch();
  const ids = useSelector(selectStationIds);
  const live = useSelector((s) => s.stations.live);

  useEffect(() => {
    if (!live || ids.length === 0) return;
    const timer = setInterval(() => {
      const id = ids[Math.floor(Math.random() * ids.length)];
      const available = Math.random() > 0.4;
      const queue = available ? 0 : 1 + Math.floor(Math.random() * 4);
      dispatch(liveStatusUpdated({ id, available, queue }));
    }, intervalMs);
    return () => clearInterval(timer);
  }, [live, ids, intervalMs, dispatch]);
}
