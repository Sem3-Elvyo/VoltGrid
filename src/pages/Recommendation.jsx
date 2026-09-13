import { Star } from "lucide-react";
import { stations } from "../data/mockData.js";

// Simple scoring function — higher is better.
// Each factor is normalized-ish and weighted by how much it should matter.
function scoreStation(station) {
  const distanceScore = Math.max(10 - station.distanceKm, 0) * 3; // closer is better
  const speedScore = station.power / 10; // faster charging is better
  const priceScore = Math.max(12 - station.price, 0) * 2; // cheaper is better
  const ratingScore = station.rating * 8; // higher rated is better
  const queueScore = Math.max(4 - station.queue, 0) * 5; // shorter queue is better
  const availabilityScore = station.available ? 20 : -20;

  return (
    distanceScore +
    speedScore +
    priceScore +
    ratingScore +
    queueScore +
    availabilityScore
  );
}

export default function Recommendation() {
  const ranked = [...stations]
    .map((s) => ({ ...s, score: scoreStation(s) }))
    .sort((a, b) => b.score - a.score);

  const best = ranked[0];

  return (
    <div className="container" style={{ paddingBottom: 56 }}>
      <div className="page-header">
        <h1>Best charger for you</h1>
        <p>
          Ranked using distance, price, speed, rating, queue and availability
          together — not just "nearest".
        </p>
      </div>

      <div
        className="card"
        style={{
          marginBottom: 24,
          border: "1px solid var(--primary)",
        }}
      >
        <span className="pill pill-green" style={{ marginBottom: 10 }}>
          <Star size={12} /> Best match
        </span>
        <div style={{ fontSize: 22, fontWeight: 800, margin: "6px 0 10px" }}>
          {best.name}
        </div>
        <div className="grid grid-3">
          <div>
            <div className="label">Distance</div>
            <div style={{ fontWeight: 700 }}>{best.distanceKm} km</div>
          </div>
          <div>
            <div className="label">Speed</div>
            <div style={{ fontWeight: 700 }}>{best.power} kW</div>
          </div>
          <div>
            <div className="label">Status</div>
            <div style={{ fontWeight: 700 }}>
              {best.available ? "Available" : "In use"}
            </div>
          </div>
          <div>
            <div className="label">Price</div>
            <div style={{ fontWeight: 700 }}>₹{best.price}/kWh</div>
          </div>
          <div>
            <div className="label">Rating</div>
            <div style={{ fontWeight: 700 }}>★ {best.rating}</div>
          </div>
          <div>
            <div className="label">Est. charge time</div>
            <div style={{ fontWeight: 700 }}>
              {Math.round((40 * 0.6 / best.power) * 60)} min
            </div>
          </div>
        </div>
      </div>

      <div className="label" style={{ marginBottom: 10 }}>
        Full ranking
      </div>

      <div className="grid" style={{ gap: 10 }}>
        {ranked.map((s, i) => (
          <div
            key={s.id}
            className="card"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "14px 18px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ color: "var(--text-dim)", fontWeight: 700 }}>
                #{i + 1}
              </span>
              <div>
                <div style={{ fontWeight: 700 }}>{s.name}</div>
                <div className="station-meta">
                  <span>{s.distanceKm} km</span>
                  <span>{s.power} kW</span>
                  <span>₹{s.price}/kWh</span>
                  <span>★ {s.rating}</span>
                </div>
              </div>
            </div>
            <div style={{ fontWeight: 800, color: "var(--volt)" }}>
              {s.score.toFixed(0)} pts
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
