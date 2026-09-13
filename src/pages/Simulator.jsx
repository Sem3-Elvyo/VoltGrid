import { useEffect, useRef, useState } from "react";
import { myVehicle } from "../data/mockData.js";

const CHARGE_POWER_KW = 42;
const PRICE_PER_KWH = 7.5;
const TARGET_PERCENT = 90;

export default function Simulator() {
  const [percent, setPercent] = useState(myVehicle.batteryPercent);
  const [isCharging, setIsCharging] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isCharging) {
      intervalRef.current = setInterval(() => {
        setPercent((prev) => {
          if (prev >= TARGET_PERCENT) {
            clearInterval(intervalRef.current);
            setIsCharging(false);
            return prev;
          }
          return prev + 1;
        });
      }, 800); // one "percent" every 0.8s, just for the demo
    }
    return () => clearInterval(intervalRef.current);
  }, [isCharging]);

  const kwhAdded =
    ((percent - myVehicle.batteryPercent) / 100) * myVehicle.batteryCapacityKwh;
  const cost = Math.max(kwhAdded, 0) * PRICE_PER_KWH;
  const percentRemaining = Math.max(TARGET_PERCENT - percent, 0);
  const minutesRemaining = Math.round(
    (percentRemaining / 100) * myVehicle.batteryCapacityKwh / CHARGE_POWER_KW * 60
  );

  function startCharging() {
    if (percent >= TARGET_PERCENT) return;
    setIsCharging(true);
  }

  function stopCharging() {
    setIsCharging(false);
    clearInterval(intervalRef.current);
  }

  return (
    <div className="container" style={{ paddingBottom: 56 }}>
      <div className="page-header">
        <h1>Charging session</h1>
        <p>Watch your battery charge up in real time (simulated).</p>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div className="charge-ring-wrap">
          <div style={{ textAlign: "center" }}>
            <div className="charge-percent-label">{percent}%</div>
            <div style={{ color: "var(--text-dim)", fontSize: 13 }}>
              Target {TARGET_PERCENT}%
            </div>
          </div>
        </div>

        <div className="battery-bar" style={{ margin: "16px 0" }}>
          <div className="battery-fill" style={{ width: `${percent}%` }} />
        </div>

        <div className="grid grid-3" style={{ marginBottom: 16 }}>
          <div>
            <div className="label">Charging power</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>
              {isCharging ? `${CHARGE_POWER_KW} kW` : "0 kW"}
            </div>
          </div>
          <div>
            <div className="label">Price</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>
              ₹{PRICE_PER_KWH}/kWh
            </div>
          </div>
          <div>
            <div className="label">Time remaining</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>
              {percent >= TARGET_PERCENT ? "Done" : `${minutesRemaining} min`}
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 16, fontSize: 14, color: "var(--text-dim)" }}>
          Energy added so far: {kwhAdded.toFixed(1)} kWh · Cost: ₹{cost.toFixed(2)}
        </div>

        {isCharging ? (
          <button className="btn btn-danger" onClick={stopCharging}>
            Stop charging
          </button>
        ) : (
          <button
            className="btn btn-primary"
            onClick={startCharging}
            disabled={percent >= TARGET_PERCENT}
          >
            {percent >= TARGET_PERCENT ? "Fully charged" : "Start charging"}
          </button>
        )}
      </div>

      <CostCalculator />
    </div>
  );
}

function CostCalculator() {
  const [current, setCurrent] = useState(28);
  const [target, setTarget] = useState(90);
  const [capacity, setCapacity] = useState(40);
  const [price, setPrice] = useState(8);

  const energyNeeded = Math.max(target - current, 0) / 100 * capacity;
  const totalCost = energyNeeded * price;

  return (
    <div className="card">
      <div className="label" style={{ marginBottom: 14 }}>
        Cost calculator
      </div>

      <div className="grid grid-2" style={{ marginBottom: 16 }}>
        <div className="field">
          <label>Current battery (%)</label>
          <input
            type="number"
            min="0"
            max="100"
            value={current}
            onChange={(e) => setCurrent(Number(e.target.value))}
          />
        </div>
        <div className="field">
          <label>Target battery (%)</label>
          <input
            type="number"
            min="0"
            max="100"
            value={target}
            onChange={(e) => setTarget(Number(e.target.value))}
          />
        </div>
        <div className="field">
          <label>Battery capacity (kWh)</label>
          <input
            type="number"
            min="1"
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
          />
        </div>
        <div className="field">
          <label>Price (₹/kWh)</label>
          <input
            type="number"
            min="1"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />
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
