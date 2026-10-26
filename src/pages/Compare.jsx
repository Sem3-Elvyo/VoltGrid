import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAllStations } from "../store/slices/stationsSlice.js";
import { selectVehicle } from "../store/selectors.js";
import { useCompare } from "../context/compareStore.js";
import Breadcrumbs from "../components/Breadcrumbs.jsx";

export default function Compare() {
  const { ids, toggle } = useCompare();
  const all = useSelector(selectAllStations);
  const vehicle = useSelector(selectVehicle);
  const picked = ids.map((id) => all.find((s) => s.id === id)).filter(Boolean);

  const rows = [
    ["Type", (s) => s.type],
    ["Power", (s) => `${s.power} kW`],
    ["Your effective speed", (s) => `${Math.min(s.power, vehicle.maxChargingSpeedKw)} kW`],
    ["Price", (s) => `₹${s.price}/kWh`],
    ["Distance", (s) => `${s.distanceKm} km`],
    ["Rating", (s) => s.rating],
    ["Queue", (s) => (s.queue === 0 ? "None" : s.queue)],
    ["Status", (s) => (s.available ? "Available" : "In use")],
  ];
  // Highlight the best value in rows where lower/higher is clearly better.
  const best = { Price: Math.min, Distance: Math.min, Rating: Math.max };
  const raw = { Price: (s) => s.price, Distance: (s) => s.distanceKm, Rating: (s) => s.rating };

  return (
    <div className="container" style={{ paddingBottom: 56 }}>
      <Breadcrumbs items={[{ to: "/", label: "Home" }, { to: "/stations", label: "Stations" }, { label: "Compare" }]} />
      <div className="page-header" style={{ marginTop: 10 }}>
        <h1>Compare stations</h1>
        <p>Side-by-side view of up to 3 stations. Best values are highlighted.</p>
      </div>
      {picked.length < 2 ? (
        <div className="card error-card">
          <h2>Pick at least 2 stations</h2>
          <p>Use the compare button on any station card.</p>
          <Link to="/stations" className="btn btn-primary">Browse stations</Link>
        </div>
      ) : (
        <div className="card" style={{ overflowX: "auto" }}>
          <table className="compare-table">
            <thead>
              <tr>
                <th />
                {picked.map((s) => (
                  <th key={s.id}>
                    <Link to={`/stations/${s.id}`}>{s.name}</Link>
                    <button className="btn btn-ghost btn-sm" onClick={() => toggle(s.id)}>Remove</button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(([label, get]) => {
                const target = best[label] && best[label](...picked.map(raw[label]));
                return (
                  <tr key={label}>
                    <th scope="row">{label}</th>
                    {picked.map((s) => (
                      <td key={s.id} className={target !== undefined && raw[label](s) === target ? "best" : ""}>{get(s)}</td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
