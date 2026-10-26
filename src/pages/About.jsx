import { Link } from "react-router-dom";
import { Zap, MapPin, Gauge, ShieldCheck } from "lucide-react";
import Breadcrumbs from "../components/Breadcrumbs.jsx";

const values = [
  { icon: MapPin, title: "Find", text: "Search and filter chargers by type, speed, price, distance and availability." },
  { icon: Gauge, title: "Plan", text: "Simulate a charge for your car and see time and cost before you plug in." },
  { icon: ShieldCheck, title: "Decide", text: "A scoring engine ranks stations for your vehicle, so the best option is on top." },
];
// Replace with your real names and roles.
const team = [
  { name: "Member 1", role: "Dashboard & map" },
  { name: "Member 2", role: "Stations, filters & compare" },
  { name: "Member 3", role: "Simulator & cost calculator" },
  { name: "Member 4", role: "Forms, bookings & Redux store" },
];

export default function About() {
  return (
    <div className="container" style={{ paddingBottom: 56 }}>
      <Breadcrumbs items={[{ to: "/", label: "Home" }, { label: "About us" }]} />
      <div className="page-header" style={{ marginTop: 10 }}>
        <h1>About VoltGrid</h1>
        <p>A college project by four second-year CSE students: a React single-page app that makes EV charging less of a guessing game.</p>
      </div>
      <div className="grid grid-3" style={{ marginBottom: 28 }}>
        {values.map(({ icon: Icon, title, text }) => (
          <div className="card info-card" key={title}>
            <span className="icon-chip"><Icon size={20} /></span>
            <h3>{title}</h3><p>{text}</p>
          </div>
        ))}
      </div>
      <h2 className="section-title">The team</h2>
      <div className="grid grid-4" style={{ marginBottom: 28 }}>
        {team.map((m) => (
          <div className="card team-card" key={m.name}>
            <span className="avatar">{m.name.split(" ").map((w) => w[0]).join("")}</span>
            <strong>{m.name}</strong><small>{m.role}</small>
          </div>
        ))}
      </div>
      <div className="card cta-card">
        <div><h3>Built with React, React Router, Redux Toolkit and Context API</h3>
          <p>All data is mock data; no backend or API keys.</p></div>
        <Link to="/stations" className="btn btn-primary"><Zap size={15} /> Explore stations</Link>
      </div>
    </div>
  );
}
