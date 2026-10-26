import { useMemo, useReducer } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Car, Play, Square } from "lucide-react";
import {
  selectAllStations,
  selectStationById,
} from "../store/slices/stationsSlice.js";
import {
  selectStation,
  setTarget,
  startCharging,
  stopCharging,
  drive,
} from "../store/slices/chargingSlice.js";

export default function Simulator() {
  const dispatch = useDispatch();
  const { status, percent, startPercent, targetPercent, stationId } = useSelector((s) => s.charging);
  const vehicle = useSelector((s) => s.profile.vehicle);
  const stations = useSelector(selectAllStations);
  const station = useSelector((s) => selectStationById(s, stationId));

  const isCharging = status === "charging";
  const price = station?.price ?? 8;
  // The car can't charge faster than its own limit OR the station's limit.
  const powerKw = Math.min(station?.power ?? vehicle.maxChargingSpeedKw, vehicle.maxChargingSpeedKw);

  // Derived values: computed during render, never stored in state.
  const { kwhAdded, cost, minutesRemaining } = useMemo(() => {
    const added = Math.max(((percent - startPercent) / 100) * vehicle.batteryCapacityKwh, 0);
    const remainingKwh = (Math.max(targetPercent - percent, 0) / 100) * vehicle.batteryCapacityKwh;
    return {
      kwhAdded: added,
      cost: added * price,
      minutesRemaining: Math.round((remainingKwh / powerKw) * 60),
    };
  }, [percent, startPercent, targetPercent, price, powerKw, vehicle.batteryCapacityKwh]);

  const rangeKm = Math.round((percent / 100) * vehicle.fullRangeKm);
  const canStart = !isCharging && percent < targetPercent;

  return (
    <div className="container" style={{ paddingBottom: 56 }}>
      <div className="page-header">
        <h1>Charging session</h1>
        <p>Start a session, then browse other pages — it keeps charging in the background.</p>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div className="grid grid-2" style={{ marginBottom: 18 }}>
          <div className="field">
            <label htmlFor="sim-station">Charging at</label>
            <select
              id="sim-station"
              value={stationId}
              disabled={isCharging}
              onChange={(e) => dispatch(selectStation(Number(e.target.value)))}
            >
              {stations.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} · {s.power} kW · ₹{s.price}/kWh
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="sim-target">Charge up to {targetPercent}%</label>
            <input
              id="sim-target"
              type="range"
              min="60"
              max="100"
              step="5"
              value={targetPercent}
              disabled={isCharging}
              onChange={(e) => dispatch(setTarget(Number(e.target.value)))}
            />
          </div>
        </div>

        <div className="charge-ring-wrap">
          <div style={{ textAlign: "center" }}>
            <div className="charge-percent-label">{percent}%</div>
            <div style={{ color: "var(--text-dim)", fontSize: 13 }}>
              ≈ {rangeKm} km range · Target {targetPercent}%
            </div>
          </div>
        </div>

        <div className="battery-bar" style={{ margin: "16px 0" }}>
          <div className="battery-fill" style={{ width: `${percent}%` }} />
        </div>

        <div className="grid grid-3" style={{ marginBottom: 16 }}>
          <div>
            <div className="label">Charging power</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{isCharging ? `${powerKw} kW` : "0 kW"}</div>
          </div>
          <div>
            <div className="label">Price</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>₹{price}/kWh</div>
          </div>
          <div>
            <div className="label">Time remaining</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>
              {percent >= targetPercent ? "Done" : `${minutesRemaining} min`}
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 16, fontSize: 14, color: "var(--text-dim)" }}>
          Energy added this session: {kwhAdded.toFixed(1)} kWh · Cost: ₹{cost.toFixed(2)}
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {isCharging ? (
            <button className="btn btn-danger" onClick={() => dispatch(stopCharging())}>
              <Square size={14} /> Stop &amp; save session
            </button>
          ) : (
            <button className="btn btn-primary" onClick={() => dispatch(startCharging())} disabled={!canStart}>
              <Play size={14} />
              {percent >= targetPercent ? "Target reached" : "Start charging"}
            </button>
          )}
          <button className="btn btn-outline" onClick={() => dispatch(drive(10))} disabled={isCharging}>
            <Car size={14} /> Simulate a drive (−10%)
          </button>
        </div>
      </div>

      <CostCalculator />
    </div>
  );
}

/* ---- Local form state with useReducer (not everything belongs in Redux) ---- */
const calcInitial = { current: 28, target: 90, capacity: 40, price: 8 };

function calcReducer(state, action) {
  switch (action.type) {
    case "field":
      return { ...state, [action.field]: action.value };
    case "preset":
      return { ...state, ...action.values };
    case "reset":
      return calcInitial;
    default:
      return state;
  }
}

function CostCalculator() {
  const [state, localDispatch] = useReducer(calcReducer, calcInitial);
  const vehicle = useSelector((s) => s.profile.vehicle);
  const percent = useSelector((s) => s.charging.percent);

  const energyNeeded = (Math.max(state.target - state.current, 0) / 100) * state.capacity;
  const totalCost = energyNeeded * state.price;

  const field = (name) => ({
    value: state[name],
    onChange: (e) => localDispatch({ type: "field", field: name, value: Number(e.target.value) }),
  });

  return (
    <div className="card">
      <div className="label" style={{ marginBottom: 14 }}>Cost calculator</div>

      <div className="preset-row">
        <button className="chip" onClick={() => localDispatch({ type: "preset", values: { current: 20, target: 60 } })}>
          Quick top-up (20→60)
        </button>
        <button className="chip" onClick={() => localDispatch({ type: "preset", values: { current: 10, target: 100 } })}>
          Road trip (10→100)
        </button>
        <button
          className="chip"
          onClick={() =>
            localDispatch({ type: "preset", values: { capacity: vehicle.batteryCapacityKwh, current: percent } })
          }
        >
          Use my car
        </button>
        <button className="chip" onClick={() => localDispatch({ type: "reset" })}>Reset</button>
      </div>

      <div className="grid grid-2" style={{ marginBottom: 16 }}>
        <div className="field">
          <label>Current battery (%)</label>
          <input type="number" min="0" max="100" {...field("current")} />
        </div>
        <div className="field">
          <label>Target battery (%)</label>
          <input type="number" min="0" max="100" {...field("target")} />
        </div>
        <div className="field">
          <label>Battery capacity (kWh)</label>
          <input type="number" min="1" {...field("capacity")} />
        </div>
        <div className="field">
          <label>Price (₹/kWh)</label>
          <input type="number" min="1" {...field("price")} />
        </div>
      </div>

      <hr className="divider" />

      <div className="grid grid-2">
        <div>
          <div className="label">Energy required</div>
          <div className="value-lg">{energyNeeded.toFixed(1)} kWh</div>
        </div>
        <div>
          <div className="label">Estimated cost</div>
          <div className="value-lg">₹{totalCost.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
}
