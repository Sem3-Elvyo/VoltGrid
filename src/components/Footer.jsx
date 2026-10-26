import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

// Working links use <Link> (client-side routing). Links to pages we haven't built yet
// are rendered as disabled "Soon" items on purpose, so nobody lands on a dead page.
const columns = [
  { title: "Product", links: [
    { to: "/", label: "Dashboard" }, { to: "/stations", label: "Find stations" },
    { to: "/simulator", label: "Charging" }, { to: "/recommendation", label: "Recommendations" },
  ] },
  { title: "Company", links: [
    { to: "/about", label: "About us" },
    { label: "Careers", soon: true }, { label: "Partners", soon: true }, { label: "Press", soon: true },
  ] },
  { title: "Support", links: [
    { to: "/help", label: "Help center" }, { to: "/contact", label: "Contact us" },
    { to: "/privacy", label: "Privacy policy" }, { to: "/terms", label: "Terms of service" },
  ] },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand"><Zap size={18} strokeWidth={2.5} /> VoltGrid</div>
            <p className="footer-tagline">
              Find, filter and pay for EV charging in one place — with real-time recommendations built for your car.
            </p>
          </div>
          {columns.map((col) => (
            <div className="footer-col" key={col.title}>
              <h4>{col.title}</h4>
              <ul>
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.soon ? (
                      <span className="link-soon" aria-disabled="true" title="Coming soon">
                        {l.label} <em>Soon</em>
                      </span>
                    ) : (
                      <Link to={l.to}>{l.label}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} VoltGrid. All rights reserved.</span>
          <span>Made for drivers, not dashboards.</span>
        </div>
      </div>
    </footer>
  );
}
