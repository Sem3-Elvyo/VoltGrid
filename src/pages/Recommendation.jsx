import { useDispatch, useSelector } from "react-redux";
import { Star, Info } from "lucide-react";
import { FACTORS } from "../utils/scoring.js";
import { selectRankedStations } from "../store/selectors.js";
import { setWeight, applyPreset, PRESETS } from "../store/slices/preferencesSlice.js";
import StationCardSkeleton from "../components/StationCardSkeleton.jsx";

export default function Recommendation() {
  const dispatch = useDispatch();
  const ranked = useSelector(selectRankedStations);
  const { weights, preset } = useSelector((s) => s.preferences);
  const vehicle = useSelector((s) => s.profile.vehicle);
  const percent = useSelector((s) => s.charging.percent);
  const status = useSelector((s) => s.stations.status);

  const best = ranked[0];

  let minutes = null;
  if (best) {
    const kwh = (Math.max(80 - percent, 0) / 100) * vehicle.batteryCapacityKwh;
    minutes = kwh > 0 ? Math.round((kwh / best.usableKw) * 60) : 0;
  }

  return (
    <div className="container" style={{ paddingBottom: 56 }}>
      <div className="page-header">
        <h1>Best charger for you</h1>
        <p>
          Tell VoltGrid what matters to you — the ranking updates instantly and
          reacts to live availability changes.
        </p>
      </div>

      <div className="reco-layout">
        {/* ---- Left: weights ---- */}
        <div className="card reco-weights">
          <div className="label" style={{ marginBottom: 12 }}>What matters most?</div>

          <div className="preset-row">
            {Object.keys(PRESETS).map((name) => (
              <button
                key={name}
                className={"chip" + (preset === name ? " active" : "")}
                onClick={() => dispatch(applyPreset(name))}
              >
                {name[0].toUpperCase() + name.slice(1)}
              </button>
            ))}
            {preset === "custom" && <span className="chip active">Custom</span>}
          </div>

          {FACTORS.map((f) => (
            <div className="weight-row" key={f.key}>
              <div className="weight-head">
                <span>{f.label}</span>
                <span className="weight-val">{weights[f.key]}</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={weights[f.key]}
                aria-label={`${f.label} importance`}
                onChange={(e) => dispatch(setWeight({ key: f.key, value: Number(e.target.value) }))}
              />
            </div>
          ))}

          <div className="hint" style={{ marginTop: 12 }}>
            <Info size={12} style={{ display: "inline", verticalAlign: "-2px" }} /> Your car charges at
            most {vehicle.maxChargingSpeedKw} kW, so faster stations get no extra speed credit.
          </div>
        </div>

        {/* ---- Right: result ---- */}
        <div>
          {!best ? (
            <StationCardSkeleton />
          ) : (
            <>
              <div className="card" style={{ marginBottom: 20, border: "1px solid var(--primary)" }}>
                <span className="pill pill-green" style={{ marginBottom: 10 }}>
                  <Star size={12} /> Best match · {best.score.toFixed(0)}%
                </span>
                <div style={{ fontSize: 22, fontWeight: 800, margin: "6px 0 10px" }}>{best.name}</div>

                <div className="grid grid-3" style={{ marginBottom: 16 }}>
                  <div><div className="label">Distance</div><div style={{ fontWeight: 700 }}>{best.distanceKm} km</div></div>
                  <div><div className="label">Speed</div><div style={{ fontWeight: 700 }}>{best.usableKw} kW usable</div></div>
                  <div><div className="label">Status</div><div style={{ fontWeight: 700 }}>{best.available ? "Available" : "In use"}</div></div>
                  <div><div className="label">Price</div><div style={{ fontWeight: 700 }}>₹{best.price}/kWh</div></div>
                  <div><div className="label">Rating</div><div style={{ fontWeight: 700 }}>★ {best.rating}</div></div>
                  <div><div className="label">{percent}% → 80%</div><div style={{ fontWeight: 700 }}>{minutes > 0 ? `${minutes} min` : "—"}</div></div>
                </div>

                <div className="label" style={{ marginBottom: 8 }}>Why this station</div>
                {FACTORS.map((f) => (
                  <div className="factor-row" key={f.key}>
                    <span>{f.label}</span>
                    <div className="factor-track">
                      <div className="factor-fill" style={{ width: `${best.factors[f.key] * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="label" style={{ marginBottom: 10 }}>Full ranking</div>
              <div className="grid" style={{ gap: 10 }}>
                {ranked.map((s, i) => (
                  <div
                    key={s.id}
                    className="card"
                    style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <span style={{ color: "var(--text-dim)", fontWeight: 700 }}>#{i + 1}</span>
                      <div>
                        <div style={{ fontWeight: 700 }}>{s.name}</div>
                        <div className="station-meta">
                          <span>{s.distanceKm} km</span>
                          <span>{s.power} kW</span>
                          <span>₹{s.price}/kWh</span>
                          <span>{s.available ? "Free" : `Busy · ${s.queue} waiting`}</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ fontWeight: 800, color: "var(--primary)" }}>{s.score.toFixed(0)}%</div>
                  </div>
                ))}
              </div>
              {status === "loading" && <div className="hint">Refreshing…</div>}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
