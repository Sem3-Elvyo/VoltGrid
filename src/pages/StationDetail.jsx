import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Heart, MapPin, Zap, IndianRupee, Star, Users, Loader2 } from "lucide-react";
import { selectStationById } from "../store/slices/stationsSlice.js";
import { toggleFavorite } from "../store/slices/favoritesSlice.js";
import BookingForm from "../components/BookingForm.jsx";
import Breadcrumbs from "../components/Breadcrumbs.jsx";
import { selectStation } from "../store/slices/chargingSlice.js";

export default function StationDetail() {
  const { stationId } = useParams(); // dynamic route param
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const station = useSelector((s) => selectStationById(s, Number(stationId)));
  const status = useSelector((s) => s.stations.status);
  const isFavorite = useSelector((s) => s.favorites.ids.includes(Number(stationId)));
  const vehicle = useSelector((s) => s.profile.vehicle);
  const percent = useSelector((s) => s.charging.percent);

  if (!station) {
    return (
      <div className="container" style={{ paddingBottom: 56 }}>
        {status === "loading" || status === "idle" ? (
          <div className="page-loader"><Loader2 size={26} className="spin" /></div>
        ) : (
          <div className="card error-card">
            <h2>Station not found</h2>
            <Link to="/stations" className="btn btn-primary">Back to stations</Link>
          </div>
        )}
      </div>
    );
  }

  const usableKw = Math.min(station.power, vehicle.maxChargingSpeedKw);
  const kwhNeeded = (Math.max(80 - percent, 0) / 100) * vehicle.batteryCapacityKwh;
  const minutes = Math.round((kwhNeeded / usableKw) * 60);
  const cost = kwhNeeded * station.price;

  function chargeHere() {
    dispatch(selectStation(station.id));
    navigate("/simulator");
  }

  return (
    <div className="container" style={{ paddingBottom: 56 }}>
      <Breadcrumbs items={[{ to: "/", label: "Home" }, { to: "/stations", label: "Stations" }, { label: station.name }]} />

      <div className="page-header" style={{ marginTop: 10 }}>
        <h1>{station.name}</h1>
        <div className="station-meta">
          <span className="meta-item"><MapPin size={14} /> {station.distanceKm} km away</span>
          <span className="meta-item"><Zap size={14} /> {station.type} · {station.power} kW</span>
          {station.available ? (
            <span className="pill pill-green">Available</span>
          ) : (
            <span className="pill pill-red">In use</span>
          )}
        </div>
      </div>

      <div className="grid grid-3" style={{ marginBottom: 24 }}>
        <div className="card">
          <div className="label"><IndianRupee size={12} /> Price</div>
          <div className="value-lg">₹{station.price}/kWh</div>
        </div>
        <div className="card">
          <div className="label"><Star size={12} /> Rating</div>
          <div className="value-lg">{station.rating}</div>
        </div>
        <div className="card">
          <div className="label"><Users size={12} /> Queue</div>
          <div className="value-lg">{station.queue === 0 ? "None" : station.queue}</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div className="label" style={{ marginBottom: 12 }}>
          Your {vehicle.make} {vehicle.model} at this station
        </div>
        <div className="grid grid-3">
          <div>
            <div className="label">Effective speed</div>
            <div style={{ fontWeight: 700 }}>{usableKw} kW</div>
            {station.power > vehicle.maxChargingSpeedKw && (
              <div className="hint">Your car caps at {vehicle.maxChargingSpeedKw} kW</div>
            )}
          </div>
          <div>
            <div className="label">{percent}% → 80%</div>
            <div style={{ fontWeight: 700 }}>{kwhNeeded > 0 ? `${minutes} min` : "Already above 80%"}</div>
          </div>
          <div>
            <div className="label">Estimated cost</div>
            <div style={{ fontWeight: 700 }}>₹{cost.toFixed(0)}</div>
          </div>
        </div>
      </div>

      <BookingForm station={station} />

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <button className="btn btn-primary" onClick={chargeHere}>
          <Zap size={16} /> Charge here
        </button>
        <button className="btn btn-outline" onClick={() => dispatch(toggleFavorite(station.id))}>
          <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
          {isFavorite ? "Remove from favourites" : "Add to favourites"}
        </button>
      </div>
    </div>
  );
}
