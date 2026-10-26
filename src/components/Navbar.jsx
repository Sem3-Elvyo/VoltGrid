import { Link, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Zap, Sun, Moon, ShoppingBag, Heart, LogOut } from "lucide-react";
import { useTheme } from "../hooks/useTheme.js";
import { logout } from "../store/slices/authSlice.js";
import { notify } from "../store/slices/notificationsSlice.js";

const links = [
  { to: "/", label: "Dashboard" },
  { to: "/stations", label: "Stations" },
  { to: "/simulator", label: "Charging" },
  { to: "/recommendation", label: "Recommended" },
  { to: "/compare", label: "Compare" },
  { to: "/history", label: "History" },
  { to: "/profile", label: "Profile" },
];

const linkClass = ({ isActive }) => "nav-link" + (isActive ? " active" : "");

export default function Navbar() {
  const { theme, toggleTheme } = useTheme(); // Context API
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user); // Redux
  const name = useSelector((s) => s.profile.name);
  const favoriteCount = useSelector((s) => s.favorites.ids.length);
  const isCharging = useSelector((s) => s.charging.status === "charging");
  const percent = useSelector((s) => s.charging.percent);

  function handleLogout() {
    dispatch(logout());
    dispatch(notify({ type: "info", message: "You have been signed out." }));
  }

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
            <NavLink key={link.to} to={link.to} end={link.to === "/"} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
          <NavLink to="/shop" className={linkClass}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
              <ShoppingBag size={14} /> Shop
            </span>
          </NavLink>
        </nav>

        <div className="nav-cta">
          {isCharging && (
            <Link to="/simulator" className="charging-chip" title="Charging in progress">
              <Zap size={13} /> {percent}%
            </Link>
          )}
          <Link to="/stations" className="fav-badge" title="Favourite stations">
            <Heart size={15} /> {favoriteCount}
          </Link>
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          {user ? (
            <>
              <span className="avatar" title={user.email}>
                {name.charAt(0).toUpperCase()}
              </span>
              <button type="button" className="btn btn-outline btn-sm" onClick={handleLogout}>
                <LogOut size={14} /> Sign out
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-outline btn-sm">
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
