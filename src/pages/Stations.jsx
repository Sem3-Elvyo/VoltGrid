import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, RefreshCw, RotateCcw, WifiOff } from "lucide-react";
import StationCard from "../components/StationCard.jsx";
import StationCardSkeleton from "../components/StationCardSkeleton.jsx";
import { useDebounce } from "../hooks/useDebounce.js";
import { selectFilters, selectFilteredStations } from "../store/selectors.js";
import { setFilter, resetFilters } from "../store/slices/filtersSlice.js";
import { fetchStations, setLive } from "../store/slices/stationsSlice.js";

export default function Stations() {
  const dispatch = useDispatch();
  const filters = useSelector(selectFilters);
  const stations = useSelector(selectFilteredStations);
  const status = useSelector((s) => s.stations.status);
  const error = useSelector((s) => s.stations.error);
  const live = useSelector((s) => s.stations.live);

  // Search box keeps local text; the debounced value is what goes to Redux,
  // so we don't re-filter on every single keystroke.
  const [searchText, setSearchText] = useState(filters.search);
  const debouncedSearch = useDebounce(searchText, 300);
  useEffect(() => {
    dispatch(setFilter({ key: "search", value: debouncedSearch }));
  }, [debouncedSearch, dispatch]);

  const set = (key, value) => dispatch(setFilter({ key, value }));
  const loading = status === "loading" || status === "idle";

  function handleReset() {
    setSearchText("");
    dispatch(resetFilters());
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>Charging stations</h1>
        <p>Search and filter every station near you.</p>
      </div>

      <div className="toolbar">
        <label className="live-toggle">
          <input type="checkbox" checked={live} onChange={(e) => dispatch(setLive(e.target.checked))} />
          <span className={"live-dot" + (live ? " on" : "")} /> Live availability
        </label>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-outline btn-sm" onClick={() => dispatch(fetchStations())} disabled={loading}>
            <RefreshCw size={14} /> Refresh
          </button>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => dispatch(fetchStations({ forceError: true }))}
            disabled={loading}
            title="Demo: makes the fake API call fail"
          >
            <WifiOff size={14} /> Simulate error
          </button>
        </div>
      </div>

      <div style={{ position: "relative" }}>
        <input
          type="text"
          className="search-input"
          style={{ paddingLeft: 42 }}
          placeholder="Search stations by name…"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Search size={16} style={{ position: "absolute", left: 14, top: 15, color: "var(--text-dim)" }} />
      </div>

      <div className="filter-bar">
        <select value={filters.type} onChange={(e) => set("type", e.target.value)}>
          <option value="all">All types</option>
          <option value="AC">AC</option>
          <option value="DC Fast">DC Fast</option>
        </select>

        <select value={filters.sortBy} onChange={(e) => set("sortBy", e.target.value)}>
          <option value="distance">Sort: Nearest</option>
          <option value="price">Sort: Cheapest</option>
          <option value="power">Sort: Fastest</option>
          <option value="rating">Sort: Top rated</option>
        </select>

        <label className="checkbox-filter">
          <input type="checkbox" checked={filters.fastOnly} onChange={(e) => set("fastOnly", e.target.checked)} />
          Fast charging (50kW+)
        </label>

        <label className="checkbox-filter">
          <input type="checkbox" checked={filters.availableOnly} onChange={(e) => set("availableOnly", e.target.checked)} />
          Available now
        </label>

        <label className="checkbox-filter">
          Max ₹{filters.maxPrice}/kWh
          <input type="range" min="4" max="15" value={filters.maxPrice} onChange={(e) => set("maxPrice", Number(e.target.value))} />
        </label>

        <label className="checkbox-filter">
          Within {filters.maxDistance} km
          <input type="range" min="1" max="15" value={filters.maxDistance} onChange={(e) => set("maxDistance", Number(e.target.value))} />
        </label>

        <button className="btn btn-ghost btn-sm" onClick={handleReset}>
          <RotateCcw size={14} /> Reset
        </button>
      </div>

      {status === "failed" ? (
        <div className="card error-card" style={{ marginBottom: 56 }}>
          <WifiOff size={26} />
          <h2>Couldn't load stations</h2>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={() => dispatch(fetchStations())}>
            Retry
          </button>
        </div>
      ) : (
        <>
          <div className="label" style={{ marginBottom: 14 }}>
            {loading ? "Loading stations…" : `${stations.length} station${stations.length !== 1 ? "s" : ""} found`}
          </div>
          <div className="grid grid-2" style={{ paddingBottom: 56 }}>
            {loading
              ? [1, 2, 3, 4].map((n) => <StationCardSkeleton key={n} />)
              : stations.map((s) => <StationCard key={s.id} station={s} />)}
            {!loading && stations.length === 0 && (
              <p style={{ color: "var(--text-dim)" }}>
                No stations match those filters. Try widening your search.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
