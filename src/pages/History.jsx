import { chargingHistory } from "../data/mockData.js";

export default function History() {
  const totalCost = chargingHistory.reduce((sum, h) => sum + h.cost, 0);
  const totalEnergy = chargingHistory.reduce((sum, h) => sum + h.energyKwh, 0);
  const avgSessions = chargingHistory.length;
  const maxCost = Math.max(...chargingHistory.map((h) => h.cost));

  return (
    <div className="container" style={{ paddingBottom: 56 }}>
      <div className="page-header">
        <h1>Charging history</h1>
        <p>Every past session, and how your usage trends over time.</p>
      </div>

      <div className="grid grid-3" style={{ marginBottom: 24 }}>
        <div className="card">
          <div className="label">Total spent</div>
          <div className="value-lg">₹{totalCost}</div>
        </div>
        <div className="card">
          <div className="label">Total energy</div>
          <div className="value-lg">{totalEnergy.toFixed(1)} kWh</div>
        </div>
        <div className="card">
          <div className="label">Sessions</div>
          <div className="value-lg">{avgSessions}</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div className="label" style={{ marginBottom: 10 }}>
          Cost per session (₹)
        </div>
        <div className="bar-chart-wrap">
          <div className="bar-chart">
            {chargingHistory
              .slice()
              .reverse()
              .map((h) => (
                <div
                  key={h.date}
                  className="bar"
                  style={{ height: `${(h.cost / maxCost) * 100}%` }}
                >
                  <span className="bar-label">{h.date}</span>
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="label" style={{ marginBottom: 10 }}>
          Session log
        </div>
        <table className="history-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Station</th>
              <th>Energy</th>
              <th>Cost</th>
            </tr>
          </thead>
          <tbody>
            {chargingHistory.map((h) => (
              <tr key={h.date}>
                <td>{h.date}</td>
                <td>{h.station}</td>
                <td>{h.energyKwh} kWh</td>
                <td>₹{h.cost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
