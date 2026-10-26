import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { GitCompare, X } from "lucide-react";
import { useCompare } from "../context/compareStore.js";
import { selectStationById } from "../store/slices/stationsSlice.js";

function Chip({ id }) {
  const station = useSelector((s) => selectStationById(s, id));
  const { toggle } = useCompare();
  return (
    <span className="chip active">
      {station?.name.split(" - ")[0] ?? "…"}
      <button type="button" className="chip-x" onClick={() => toggle(id)} aria-label="Remove from compare"><X size={12} /></button>
    </span>
  );
}

// Floating tray, visible on every page once something is added.
export default function CompareBar() {
  const { ids, clear } = useCompare();
  if (ids.length === 0) return null;
  return (
    <div className="compare-bar" role="region" aria-label="Compare stations">
      <GitCompare size={16} />
      <div className="compare-chips">{ids.map((id) => <Chip key={id} id={id} />)}</div>
      <button type="button" className="btn btn-ghost btn-sm" onClick={clear}>Clear</button>
      <Link to="/compare" className={"btn btn-primary btn-sm" + (ids.length < 2 ? " disabled" : "")} aria-disabled={ids.length < 2}>
        Compare ({ids.length})
      </Link>
    </div>
  );
}
