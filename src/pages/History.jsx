import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Download, Trash2 } from "lucide-react";
import { selectHistoryStats, selectSessions } from "../store/selectors.js";
import { removeSession } from "../store/slices/historySlice.js";
import { cancelBooking } from "../store/slices/bookingsSlice.js";
import { notify } from "../store/slices/notificationsSlice.js";

export default function History() {
  const dispatch = useDispatch();
  const sessions = useSelector(selectSessions);
  const stats = useSelector(selectHistoryStats);
  const bookings = useSelector((s) => s.bookings.items);
  const [stationFilter, setStationFilter] = useState("all");

  const stationNames = useMemo(() => [...new Set(sessions.map((s) => s.station))], [sessions]);
  const visible = useMemo(
    () => (stationFilter === "all" ? sessions : sessions.filter((s) => s.station === stationFilter)),
    [sessions, stationFilter]
  );
  const chartData = useMemo(() => visible.slice(0, 8).reverse(), [visible]);
  const maxCost = Math.max(1, ...chartData.map((h) => h.cost));

  function exportCsv() {
    const rows = [
      ["Date", "Station", "Energy (kWh)", "Cost (INR)"],
      ...visible.map((h) => [h.date, h.station, h.energyKwh, h.cost]),
    ];
    const blob = new Blob([rows.map((r) => r.join(",")).join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "voltgrid-history.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleDelete(id) {
    dispatch(removeSession(id));
    dispatch(notify({ type: "info", message: "Session removed from history." }));
  }

  return (
    <div className="container" style={{ paddingBottom: 56 }}>
      <div className="page-header">
        <h1>Charging history</h1>
        <p>Sessions are added automatically when you finish or stop charging.</p>
      </div>

      {bookings.length > 0 && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="label" style={{ marginBottom: 10 }}>Upcoming reservations</div>
          {bookings.map((b) => (
            <div key={b.id} className="booking-row">
              <div><strong>{b.station}</strong><div className="hint">{b.date} · {b.time} · {b.duration} min · {b.plate}</div></div>
              <button className="btn btn-outline btn-sm" onClick={() => { dispatch(cancelBooking(b.id)); dispatch(notify({ type: "info", message: "Reservation cancelled." })); }}>Cancel</button>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-3" style={{ marginBottom: 24 }}>
        <div className="card"><div className="label">Total spent</div><div className="value-lg">₹{stats.totalCost}</div></div>
        <div className="card"><div className="label">Total energy</div><div className="value-lg">{stats.totalEnergy.toFixed(1)} kWh</div></div>
        <div className="card"><div className="label">Avg. cost</div><div className="value-lg">₹{stats.avgCostPerKwh.toFixed(2)}/kWh</div></div>
      </div>

      <div className="toolbar">
        <select value={stationFilter} onChange={(e) => setStationFilter(e.target.value)} className="inline-select">
          <option value="all">All stations</option>
          {stationNames.map((n) => <option key={n}>{n}</option>)}
        </select>
        <button className="btn btn-outline btn-sm" onClick={exportCsv} disabled={visible.length === 0}>
          <Download size={14} /> Export CSV
        </button>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div className="label" style={{ marginBottom: 10 }}>Cost per session (₹)</div>
        <div className="bar-chart-wrap">
          <div className="bar-chart">
            {chartData.map((h) => (
              <div key={h.id} className="bar" style={{ height: `${(h.cost / maxCost) * 100}%` }} title={`₹${h.cost}`}>
                <span className="bar-label">{h.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="label" style={{ marginBottom: 10 }}>Session log</div>
        {visible.length === 0 ? (
          <p style={{ color: "var(--text-dim)" }}>No sessions yet. Start one on the Charging page.</p>
        ) : (
          <table className="history-table">
            <thead>
              <tr><th>Date</th><th>Station</th><th>Energy</th><th>Cost</th><th /></tr>
            </thead>
            <tbody>
              {visible.map((h) => (
                <tr key={h.id}>
                  <td>{h.date}</td>
                  <td>{h.station}</td>
                  <td>{h.energyKwh} kWh</td>
                  <td>₹{h.cost}</td>
                  <td>
                    <button className="icon-btn" aria-label="Delete session" onClick={() => handleDelete(h.id)}>
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
