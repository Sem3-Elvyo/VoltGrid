import { MapPin, Zap, IndianRupee, Star, Users } from "lucide-react";

export default function StationCard({ station }) {
  return (
    <div className="station-card">
      <div className="station-top">
        <div>
          <div className="station-name">{station.name}</div>
          <div className="station-meta">
            <span className="meta-item">
              <MapPin size={14} /> {station.distanceKm} km away
            </span>
            <span className="meta-item">
              <Zap size={14} /> {station.type} · {station.power} kW
            </span>
          </div>
        </div>
        {station.available ? (
          <span className="pill pill-green">Available</span>
        ) : (
          <span className="pill pill-red">In use</span>
        )}
      </div>

      <hr className="divider" style={{ margin: "2px 0" }} />

      <div className="station-meta">
        <span className="meta-item">
          <IndianRupee size={14} /> {station.price}/kWh
        </span>
        <span className="meta-item">
          <Star size={14} /> {station.rating}
        </span>
        <span className="meta-item">
          <Users size={14} />
          {station.queue === 0 ? "No queue" : `${station.queue} in queue`}
        </span>
      </div>
    </div>
  );
}
