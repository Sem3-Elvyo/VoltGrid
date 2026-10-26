import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  Car,
  Search,
  ArrowRight,
  LocateFixed,
  Loader2,
  ShieldAlert,
  Zap,
  Sparkles,
  SlidersHorizontal,
} from "lucide-react";
import StationCard from "../components/StationCard.jsx";
import StationCardSkeleton from "../components/StationCardSkeleton.jsx";
import LoginForm from "../components/LoginForm.jsx";
import ImageStrip from "../components/ImageStrip.jsx";
import { useGeolocation } from "../hooks/useGeolocation.js";
import { selectAllStations } from "../store/slices/stationsSlice.js";
import { setFilter } from "../store/slices/filtersSlice.js";
import {
  selectFavoriteStations,
  selectTrendingStations,
  selectAveragePrice,
  selectRankedStations,
} from "../store/selectors.js";

const pinPositions = [
  { top: "62%", left: "30%" },
  { top: "34%", left: "58%" },
  { top: "74%", left: "72%" },
  { top: "26%", left: "20%" },
];

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Everything below comes from the Redux store.
  const stations = useSelector(selectAllStations);
  const trendingStations = useSelector(selectTrendingStations);
  const favoriteStations = useSelector(selectFavoriteStations);
  const ranked = useSelector(selectRankedStations);
  const avgPriceNumber = useSelector(selectAveragePrice);
  const profile = useSelector((s) => s.profile);
  const user = useSelector((s) => s.auth.user);
  const percent = useSelector((s) => s.charging.percent);
  const stationsStatus = useSelector((s) => s.stations.status);
  const loading = stationsStatus === "idle" || stationsStatus === "loading";

  const [query, setQuery] = useState("");

  const myVehicle = {
    ...profile.vehicle,
    batteryPercent: percent,
    rangeKm: Math.round((percent / 100) * profile.vehicle.fullRangeKm),
  };
  const nearbyForMap = stations.slice(0, 4);
  const fastCount = stations.filter((s) => /dc/i.test(s.type)).length;
  const best = ranked[0];

  const { location, status: locationStatus, request: requestLocation } = useGeolocation();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const avgPrice = avgPriceNumber.toFixed(1);

  function handleSearch(e) {
    e.preventDefault();
    dispatch(setFilter({ key: "search", value: query.trim() }));
    navigate("/stations");
  }

  return (
    <div>
      {/* ---------- Hero ---------- */}
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="hero-greeting">
              {greeting}, {profile.name}
            </p>
            <h1>Charge smarter, not just nearer.</h1>
            <p className="hero-lede">
              VoltGrid finds the right charger for your car by weighing price, speed, queue and
              reviews together, so every stop is quicker and cheaper.
            </p>

            <form className="hero-search" onSubmit={handleSearch} role="search">
              <Search size={18} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Station or area"
                aria-label="Search charging stations"
              />
              <button type="submit" className="btn btn-primary">
                Find chargers
              </button>
            </form>

            <div className="hero-links">
              <Link to="/recommendation">
                <Sparkles size={15} /> See your best match
              </Link>
              <Link to="/simulator">
                <Zap size={15} /> Start a charging session
              </Link>
            </div>
          </div>

          <aside className="hero-visual" aria-label="Your vehicle">
            <div className="hv-top">
              <span className="hv-car">
                <Car size={16} /> {myVehicle.make} {myVehicle.model}
              </span>
              <span className="hv-tag">{myVehicle.connector}</span>
            </div>
            <div className="hv-percent">
              {myVehicle.batteryPercent}
              <span>%</span>
            </div>
            <div className="hv-sub">≈ {myVehicle.rangeKm} km of range left</div>
            <div className="battery-bar hv-bar">
              <div className="battery-fill" style={{ width: `${myVehicle.batteryPercent}%` }} />
            </div>
            <dl className="hv-specs">
              <div>
                <dt>Battery</dt>
                <dd>{myVehicle.batteryCapacityKwh} kWh</dd>
              </div>
              <div>
                <dt>Max speed</dt>
                <dd>{myVehicle.maxChargingSpeedKw} kW</dd>
              </div>
              <div>
                <dt>Full range</dt>
                <dd>{myVehicle.fullRangeKm} km</dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>

      {/* ---------- Stat strip ---------- */}
      <div className="container">
        <div className="stat-strip">
          <div>
            <strong>{stations.length}</strong>
            <span>Stations tracked</span>
          </div>
          <div>
            <strong>{fastCount}</strong>
            <span>DC fast chargers</span>
          </div>
          <div>
            <strong>₹{avgPrice}</strong>
            <span>Avg. price per kWh</span>
          </div>
          <div>
            <strong>{favoriteStations.length}</strong>
            <span>Saved stations</span>
          </div>
        </div>
      </div>

      {/* ---------- Trending ---------- */}
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <h2>Trending near you</h2>
              <p>Most used by drivers in your area this week.</p>
            </div>
            <Link to="/stations" className="link-arrow">
              View all stations <ArrowRight size={15} />
            </Link>
          </div>
          <div className="grid grid-3">
            {loading
              ? [1, 2, 3].map((n) => <StationCardSkeleton key={n} />)
              : trendingStations.map((s) => <StationCard key={s.id} station={s} />)}
          </div>
        </div>
      </section>

      {/* ---------- Best match (replaces the Recommended tab) ---------- */}
      {best && (
        <section className="container">
          <div className="match-panel">
            <div className="match-main">
              <span className="match-badge">
                <Sparkles size={14} /> Best match right now
              </span>
              <h2>{best.name}</h2>
              <p>
                {best.distanceKm} km away · {best.usableKw} kW usable for your car · ₹{best.price}
                /kWh · {best.available ? "available now" : `${best.queue} in queue`}
              </p>
              <div className="match-actions">
                <Link to={`/stations/${best.id}`} className="btn btn-light">
                  View station
                </Link>
                <Link to="/recommendation" className="btn btn-ghost-light">
                  <SlidersHorizontal size={15} /> Adjust what matters
                </Link>
              </div>
            </div>
            <div className="match-score" aria-label={`Match score ${best.score.toFixed(0)} percent`}>
              <strong>{best.score.toFixed(0)}</strong>
              <span>% match</span>
            </div>
          </div>
        </section>
      )}

      {/* ---------- Map ---------- */}
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <h2>Chargers around you</h2>
              <p>Share your location for accurate distances to each charger.</p>
            </div>
          </div>

          <div className="map-card">
            <div className="map-box">
              <div className="map-pin you" style={{ top: "50%", left: "50%" }}>
                <div className="dot" />
                {locationStatus === "granted" ? "You" : "You (approx.)"}
              </div>
              {nearbyForMap.map((station, i) => (
                <div className="map-pin station" style={pinPositions[i]} key={station.id}>
                  <div className="dot" />
                  {station.name.split(" - ")[0]}
                </div>
              ))}
            </div>
            <div className="location-card">
              <div className="location-status">
                {locationStatus === "requesting" && <Loader2 size={18} className="spin" />}
                {locationStatus === "denied" && <ShieldAlert size={18} color="var(--danger)" />}
                {locationStatus !== "requesting" && locationStatus !== "denied" && (
                  <LocateFixed size={18} color="var(--primary)" />
                )}
                <span className="location-status-text">
                  {locationStatus === "idle" && "Allow location access to find chargers nearby."}
                  {locationStatus === "requesting" && "Waiting for your browser's permission prompt…"}
                  {locationStatus === "granted" && location && (
                    <>
                      Location found: <strong>{location.lat}, {location.lng}</strong>
                    </>
                  )}
                  {locationStatus === "denied" &&
                    "Location permission was denied. You can still browse stations manually."}
                  {locationStatus === "unsupported" && "Geolocation isn't supported in this browser."}
                </span>
              </div>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={requestLocation}
                disabled={locationStatus === "requesting"}
              >
                <LocateFixed size={14} />
                {locationStatus === "granted" ? "Update location" : "Use my location"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Favourites ---------- */}
      <section className="section section-tint">
        <div className="container">
          <div className="section-heading">
            <div>
              <h2>Your saved stations</h2>
              <p>Quick access to the chargers you rely on.</p>
            </div>
          </div>
          <div className="grid grid-3">
            {loading
              ? [1, 2, 3].map((n) => <StationCardSkeleton key={n} />)
              : favoriteStations.map((s) => <StationCard key={s.id} station={s} />)}
          </div>
          {!loading && favoriteStations.length === 0 && (
            <div className="empty-state">
              <strong>No saved stations yet</strong>
              <span>Tap the heart on any station to keep it here.</span>
              <Link to="/stations" className="btn btn-outline btn-sm">
                Browse stations
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ---------- Gallery ---------- */}
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <h2>EVs and charging across India</h2>
              <p>From city fast-chargers to the cars and scooters using them.</p>
            </div>
          </div>
          <ImageStrip />
        </div>
      </section>

      {/* ---------- Shop teaser ---------- */}
      <section className="container shop-teaser-wrap">
        <div className="shop-teaser">
          <div>
            <h3>Need charging accessories?</h3>
            <p>Cables, home chargers and diagnostic tools, picked for Indian EV owners.</p>
          </div>
          <Link to="/shop" className="btn btn-primary">
            Browse the shop <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Login form, right before the footer (hidden once signed in) */}
      {!user && <LoginForm />}
    </div>
  );
}
