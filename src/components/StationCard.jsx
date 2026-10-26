import { memo } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { MapPin, Zap, IndianRupee, Star, Users, Heart, GitCompare, ArrowRight } from "lucide-react";
import { useCompare } from "../context/compareStore.js";
import { toggleFavorite } from "../store/slices/favoritesSlice.js";

function StationCard({ station }) {
  const dispatch = useDispatch();
  const { ids, toggle, isFull } = useCompare(); // Context API
  const inCompare = ids.includes(station.id);
  // Selector returns a boolean, so this card only re-renders when ITS favourite state flips.
  const isFavorite = useSelector((s) => s.favorites.ids.includes(station.id));
  const isDC = /dc/i.test(station.type);

  return (
    <article className={"station-card " + (isDC ? "is-dc" : "is-ac")}>
      <div className="sc-head">
        <div className="sc-power" title={`${station.type} charger`}>
          <Zap size={16} />
          <strong>{station.power}</strong>
          <small>kW</small>
        </div>
        <div className="sc-title">
          <Link to={`/stations/${station.id}`} className="station-name station-link">{station.name}</Link>
          <div className="station-meta">
            <span className="meta-item"><MapPin size={13} /> {station.distanceKm} km</span>
            <span className="meta-item">{station.type}</span>
          </div>
          <span className={"status-dot " + (station.available ? "on" : "off")}>
            {station.available ? "Available" : "In use"}
          </span>
        </div>
      </div>

      <div className="sc-stats">
        <div><IndianRupee size={14} /><strong>{station.price}</strong><small>per kWh</small></div>
        <div><Star size={14} /><strong>{station.rating}</strong><small>rating</small></div>
        <div><Users size={14} /><strong>{station.queue === 0 ? "None" : station.queue}</strong><small>queue</small></div>
      </div>

      <div className="sc-actions">
        <Link to={`/stations/${station.id}`} className="btn btn-primary btn-sm">
          View &amp; book <ArrowRight size={14} />
        </Link>
        <button
          type="button"
          className={"fav-btn" + (inCompare ? " active" : "")}
          aria-pressed={inCompare}
          aria-label={inCompare ? "Remove from compare" : "Add to compare"}
          title={!inCompare && isFull ? "Compare list is full (3)" : "Compare"}
          onClick={() => toggle(station.id)}
        >
          <GitCompare size={16} />
        </button>
        <button
          type="button"
          className={"fav-btn" + (isFavorite ? " active" : "")}
          aria-pressed={isFavorite}
          aria-label={isFavorite ? "Remove from favourites" : "Add to favourites"}
          onClick={() => dispatch(toggleFavorite(station.id))}
        >
          <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>
    </article>
  );
}

// React.memo: skip re-rendering when the `station` prop object is unchanged.
export default memo(StationCard);
