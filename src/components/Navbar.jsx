import { NavLink } from "react-router-dom";
import { Zap, Sun, Moon, ShoppingBag } from "lucide-react";

const links = [
  { to: "/", label: "Dashboard" },
  { to: "/stations", label: "Stations" },
  { to: "/simulator", label: "Charging" },
  { to: "/recommendation", label: "Recommended" },
  { to: "/history", label: "History" },
  { to: "/profile", label: "Profile" },
];

export default function Navbar({ darkMode, onToggleDarkMode }) {
  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <NavLink to="/" className="brand">
          <span className="brand-mark">
            <Zap size={16} strokeWidth={2.5} />
          </span>
          VoltGrid
        </NavLink>

        <nav className="nav-links">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                "nav-link" + (isActive ? " active" : "")
              }
            >
              {link.label}
            </NavLink>
          ))}
          <NavLink
            to="/shop"
            className={({ isActive }) =>
              "nav-link" + (isActive ? " active" : "")
            }
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
              <ShoppingBag size={14} /> Shop
            </span>
          </NavLink>
        </nav>

        <div className="nav-cta">
          <button
            type="button"
            className="theme-toggle"
            onClick={onToggleDarkMode}
            aria-label="Toggle dark mode"
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <a href="#login" className="btn btn-outline btn-sm">
            Sign in
          </a>
        </div>
      </div>
    </header>
  );
}
