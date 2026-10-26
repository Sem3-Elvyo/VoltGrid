import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { tick } from "../store/slices/chargingSlice.js";

// Mounted once in <Layout>, so charging keeps running while you browse other pages.
export function useChargingTicker(intervalMs = 800) {
  const dispatch = useDispatch();
  const isCharging = useSelector((s) => s.charging.status === "charging");

  useEffect(() => {
    if (!isCharging) return;
    const id = setInterval(() => dispatch(tick()), intervalMs);
    return () => clearInterval(id);
  }, [isCharging, intervalMs, dispatch]);
}
