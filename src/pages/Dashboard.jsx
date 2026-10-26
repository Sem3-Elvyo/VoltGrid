import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  BatteryCharging,
  Car,
  MapPin,
  TrendingUp,
  Heart,
  ArrowRight,
  LocateFixed,
  Loader2,
  ShieldAlert,
} from "lucide-react";
import StationCard from "../components/StationCard.jsx";
import StationCardSkeleton from "../components/StationCardSkeleton.jsx";
import LoginForm from "../components/LoginForm.jsx";
import ImageStrip from "../components/ImageStrip.jsx";
import { useGeolocation } from "../hooks/useGeolocation.js";
import { selectAllStations } from "../store/slices/stationsSlice.js";
import {
  selectFavoriteStations,
  selectTrendingStations,
  selectAveragePrice,
} from "../store/selectors.js";

const pinPositions = [
  { top: "60%", left: "30%" },
  { top: "35%", left: "55%" },
  { top: "75%", left: "70%" },
  { top: "25%", left: "20%" },
];

export default function Dashboard() {
  // Everything below comes from the Redux store (no more hard-coded imports).
  const stations = useSelector(selectAllStations);
  const trendingStations = useSelector(selectTrendingStations);
  const favoriteStations = useSelector(selectFavoriteStations);
  const avgPriceNumber = useSelector(selectAveragePrice);
  const profile = useSelector((s) => s.profile);
  const user = useSelector((s) => s.auth.user);
  const percent = useSelector((s) => s.charging.percent);
  const stationsStatus = useSelector((s) => s.stations.status);
  const loading = stationsStatus === "idle" || stationsStatus === "loading";

  // Keeps the JSX below unchanged: same shape as the old mock object, now live.
  const myVehicle = {
    ...profile.vehicle,
    batteryPercent: percent,
    rangeKm: Math.round((percent / 100) * profile.vehicle.fullRangeKm),
  };
  const nearbyForMap = stations.slice(0, 4);

  // Custom hook replaces ~25 lines of geolocation code that used to live here.
  const { location, status: locationStatus, request: requestLocation } = useGeolocation();

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const avgPrice = avgPriceNumber.toFixed(1);

  return (
    <div>
      {/* Hero */}
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <span className="hero-eyebrow">
              <BatteryCharging size={14} /> {greeting}, {profile.name}
            </span>
            <h1>Charge smarter, not just nearer.</h1>
            <p>
              VoltGrid finds the right charging station for your car — not
              just the closest one — by weighing price, speed, queue and
              reviews together.
            </p>
            <div className="hero-actions">
              <Link to="/stations" className="btn btn-primary">
                Find a station <ArrowRight size={16} />
              </Link>
              <Link to="/recommendation" className="btn btn-outline">
                See best match for you
              </Link>
            </div>
            <div className="hero-stats">
              <div>
                <div className="stat-num">{stations.length}</div>
                <div className="stat-label">Stations tracked</div>
              </div>
              <div>
                <div className="stat-num">₹{avgPrice}</div>
                <div className="stat-label">Avg. price / kWh</div>
              </div>
              <div>
                <div className="stat-num">{favoriteStations.length}</div>
                <div className="stat-label">Your favorites</div>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="label" style={{ marginBottom: 14 }}>
              Your battery
            </div>
            <div className="value-lg" style={{ marginBottom: 10 }}>
              {myVehicle.batteryPercent}%
            </div>
            <div className="battery-bar" style={{ marginBottom: 14 }}>
              <div
                className="battery-fill"
                style={{ width: `${myVehicle.batteryPercent}%` }}
              />
            </div>
            <div className="station-meta" style={{ marginBottom: 20 }}>
              <span className="meta-item">
                <Car size={14} /> {myVehicle.make} {myVehicle.model}
              </span>
              <span className="meta-item">Range {myVehicle.rangeKm} km</span>
            </div>
            <hr className="divider" />
            <div className="label" style={{ marginBottom: 10 }}>
              Vehicle details
            </div>
            <div className="station-meta">
              <span className="meta-item">{myVehicle.connector}</span>
              <span className="meta-item">{myVehicle.batteryCapacityKwh} kWh pack</span>
              <span className="meta-item">Max {myVehicle.maxChargingSpeedKw} kW</span>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <h2>Your location &amp; nearby stations</h2>
              <p>Share your location for accurate distances to each charger.</p>
            </div>
            <Link to="/stations" className="btn btn-outline btn-sm">
              View all <ArrowRight size={14} />
            </Link>
          </div>

          <div className="location-card">
            <div className="location-status">
              {locationStatus === "requesting" && (
                <Loader2 size={18} className="spin" />
              )}
              {locationStatus === "denied" && (
                <ShieldAlert size={18} color="var(--danger)" />
              )}
              {locationStatus !== "requesting" && locationStatus !== "denied" && (
                <LocateFixed size={18} color="var(--primary)" />
              )}
              <span className="location-status-text">
                {locationStatus === "idle" &&
                  "Allow VoltGrid to use your browser location to find chargers nearby."}
                {locationStatus === "requesting" &&
                  "Waiting for you to respond to the browser's permission prompt…"}
                {locationStatus === "granted" && location && (
                  <>
                    Location found: <strong>{location.lat}, {location.lng}</strong>
                  </>
                )}
                {locationStatus === "denied" &&
                  "Location permission was denied. You can still browse stations manually."}
                {locationStatus === "unsupported" &&
                  "Geolocation isn't supported in this browser."}
              </span>
            </div>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={requestLocation}
              disabled={locationStatus === "requesting"}
            >
              <LocateFixed size={14} />
              {locationStatus === "granted" ? "Update location" : "Use my location"}
            </button>
          </div>

          <div className="map-box">
            <div
              className="map-pin you"
              style={{ top: "50%", left: "50%" }}
            >
              <div className="dot" />
              {locationStatus === "granted" ? "You" : "You (approx.)"}
            </div>
            {nearbyForMap.map((station, i) => (
              <div
                className="map-pin station"
                style={pinPositions[i]}
                key={station.id}
              >
                <div className="dot" />
                {station.name.split(" - ")[0]}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* India EV image gallery */}
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <h2>EVs and charging, across India</h2>
              <p>From city fast-chargers to the cars and scooters using them.</p>
            </div>
          </div>
          <ImageStrip />
        </div>
      </section>

      {/* Quick stats */}
      <section className="section">
        <div className="container grid grid-3">
          <div className="card">
            <div className="icon-tile">
              <MapPin size={18} />
            </div>
            <div className="label">Nearby stations</div>
            <div className="value-lg">{stations.length}</div>
          </div>
          <div className="card">
            <div className="icon-tile">
              <Heart size={18} />
            </div>
            <div className="label">Favorites</div>
            <div className="value-lg">{favoriteStations.length}</div>
          </div>
          <div className="card">
            <div className="icon-tile">
              <TrendingUp size={18} />
            </div>
            <div className="label">Avg. price</div>
            <div className="value-lg">₹{avgPrice}</div>
          </div>
        </div>
      </section>

      {/* Trending stations */}
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <h2>Trending stations</h2>
              <p>Most used by drivers near you this week.</p>
            </div>
          </div>
          <div className="grid grid-3">
            {loading
              ? [1, 2, 3].map((n) => <StationCardSkeleton key={n} />)
              : trendingStations.map((s) => (
                  <StationCard key={s.id} station={s} />
                ))}
          </div>
        </div>
      </section>

      {/* Favorites */}
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <h2>Your favorites</h2>
              <p>Quick access to the stations you save.</p>
            </div>
          </div>
          <div className="grid grid-2">
            {loading
              ? [1, 2].map((n) => <StationCardSkeleton key={n} />)
              : favoriteStations.map((s) => (
                  <StationCard key={s.id} station={s} />
                ))}
            {!loading && favoriteStations.length === 0 && (
              <p style={{ color: "var(--text-dim)" }}>
                No favourites yet — tap the heart on any station.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Shop teaser */}
      <section className="section">
        <div className="container">
          <div
            className="card"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <div>
              <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 4 }}>
                Need charging accessories?
              </div>
              <div style={{ color: "var(--text-dim)", fontSize: 14 }}>
                Cables, home chargers and diagnostic tools — shop on Amazon.
              </div>
            </div>
            <Link to="/shop" className="btn btn-primary">
              Browse the shop <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Login form, right before the footer (hidden once signed in) */}
      {!user && <LoginForm />}
    </div>
  );
}
