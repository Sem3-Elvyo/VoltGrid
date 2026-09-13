import { useState } from "react";
import { Search } from "lucide-react";
import { stations } from "../data/mockData.js";
import StationCard from "../components/StationCard.jsx";

export default function Stations() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [fastOnly, setFastOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState(15);
  const [maxDistance, setMaxDistance] = useState(15);
  const [availableOnly, setAvailableOnly] = useState(false);

  const filtered = stations.filter((s) => {
    if (search && !s.name.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (typeFilter !== "all" && s.type !== typeFilter) return false;
    if (fastOnly && s.power < 50) return false;
    if (s.price > maxPrice) return false;
    if (s.distanceKm > maxDistance) return false;
    if (availableOnly && !s.available) return false;
    return true;
  });

  return (
    <div className="container">
      <div className="page-header">
        <h1>Charging stations</h1>
        <p>Search and filter every station near you.</p>
      </div>

      <div style={{ position: "relative" }}>
        <input
          type="text"
          className="search-input"
          style={{ paddingLeft: 42 }}
          placeholder="Search stations by name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Search
          size={16}
          style={{ position: "absolute", left: 14, top: 15, color: "var(--text-dim)" }}
        />
      </div>

      <div className="filter-bar">
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="all">All types</option>
          <option value="AC">AC</option>
          <option value="DC Fast">DC Fast</option>
        </select>

        <label className="checkbox-filter">
          <input
            type="checkbox"
            checked={fastOnly}
            onChange={(e) => setFastOnly(e.target.checked)}
          />
          Fast charging (50kW+)
        </label>

        <label className="checkbox-filter">
          <input
            type="checkbox"
            checked={availableOnly}
            onChange={(e) => setAvailableOnly(e.target.checked)}
          />
          Available now
        </label>

        <label className="checkbox-filter">
          Max ₹{maxPrice}/kWh
          <input
            type="range"
            min="4"
            max="15"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
        </label>

        <label className="checkbox-filter">
          Within {maxDistance} km
          <input
            type="range"
            min="1"
            max="15"
            value={maxDistance}
            onChange={(e) => setMaxDistance(Number(e.target.value))}
          />
        </label>
      </div>

      <div className="label" style={{ marginBottom: 14 }}>
        {filtered.length} station{filtered.length !== 1 ? "s" : ""} found
      </div>

      <div className="grid grid-2" style={{ paddingBottom: 56 }}>
        {filtered.map((s) => (
          <StationCard key={s.id} station={s} />
        ))}
        {filtered.length === 0 && (
          <p style={{ color: "var(--text-dim)" }}>
            No stations match those filters. Try widening your search.
          </p>
        )}
      </div>
    </div>
  );
}
