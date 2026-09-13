import { useState } from "react";
import { currentUser, myVehicle } from "../data/mockData.js";

export default function Profile() {
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [connector, setConnector] = useState(myVehicle.connector);
  const [capacity, setCapacity] = useState(myVehicle.batteryCapacityKwh);
  const [maxSpeed, setMaxSpeed] = useState(myVehicle.maxChargingSpeedKw);
  const [saved, setSaved] = useState(false);

  function handleSave(e) {
    e.preventDefault();
    // Nothing is sent anywhere — this just updates local state for the demo.
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="container" style={{ paddingBottom: 56 }}>
      <div className="page-header">
        <h1>Profile</h1>
        <p>Your account and vehicle details.</p>
      </div>

      <form onSubmit={handleSave}>
        <div className="card" style={{ marginBottom: 18 }}>
          <div className="label" style={{ marginBottom: 14 }}>
            Account
          </div>
          <div className="grid grid-2">
            <div className="field">
              <label>Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="field">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="card" style={{ marginBottom: 18 }}>
          <div className="label" style={{ marginBottom: 14 }}>
            Vehicle
          </div>
          <div className="grid grid-2">
            <div className="field">
              <label>Connector type</label>
              <select value={connector} onChange={(e) => setConnector(e.target.value)}>
                <option>CCS2</option>
                <option>CHAdeMO</option>
                <option>Type 2 AC</option>
                <option>GB/T</option>
              </select>
            </div>
            <div className="field">
              <label>Battery capacity (kWh)</label>
              <input
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
              />
            </div>
            <div className="field">
              <label>Max charging speed (kW)</label>
              <input
                type="number"
                value={maxSpeed}
                onChange={(e) => setMaxSpeed(Number(e.target.value))}
              />
            </div>
          </div>
        </div>

        <button className="btn btn-primary" type="submit">
          Save changes
        </button>
        {saved && (
          <span style={{ marginLeft: 12, color: "var(--volt)", fontSize: 14 }}>
            Saved
          </span>
        )}
      </form>
    </div>
  );
}
