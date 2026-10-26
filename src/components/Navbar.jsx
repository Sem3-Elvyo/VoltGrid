import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Zap, Sun, Moon, ChevronDown, Menu, X, User, History, LogOut, MapPin } from "lucide-react";
import { useTheme } from "../hooks/useTheme.js";
import { logout } from "../store/slices/authSlice.js";
import { notify } from "../store/slices/notificationsSlice.js";

// Only four top-level destinations. Stations, Recommendations and History are
// reached through the primary button, the dashboard and the account menu.
const links = [
  { to: "/simulator", label: "Charging" },
  { to: "/compare", label: "Compare" },
  { to: "/shop", label: "Shop" },
  { to: "/help", label: "Help" },
];

const linkClass = ({ isActive }) => "nav-link" + (isActive ? " active" : "");

export default function Navbar() {
  const { theme, toggleTheme } = useTheme(); // Context API
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const user = useSelector((s) => s.auth.user); // Redux
  const name = useSelector((s) => s.profile.name);
  const isCharging = useSelector((s) => s.charging.status === "charging");
  const percent = useSelector((s) => s.charging.percent);

  // Menus remember the page they were opened on, so they close by themselves
  // when the route changes (no effect needed).
  const [menu, setMenu] = useState({ account: null, drawer: null });
  const accountOpen = menu.account === pathname;
  const drawerOpen = menu.drawer === pathname;
  const accountRef = useRef(null);

  useEffect(() => {
    if (!accountOpen) return;
    const onDown = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setMenu((m) => ({ ...m, account: null }));
      }
    };
    const onKey = (e) => e.key === "Escape" && setMenu({ account: null, drawer: null });
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [accountOpen]);

  function handleLogout() {
    dispatch(logout());
    dispatch(notify({ type: "info", message: "You have been signed out." }));
  }

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <NavLink to="/" className="brand" aria-label="VoltGrid home">
          <span className="brand-mark">
            <Zap size={16} strokeWidth={2.75} />
          </span>
          VoltGrid
        </NavLink>

        <nav className="nav-links" aria-label="Main">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="nav-cta">
          {isCharging && (
            <Link to="/simulator" className="charging-chip" title="Charging in progress">
              <Zap size={13} /> {percent}%
            </Link>
          )}

          <Link to="/stations" className="btn btn-primary btn-sm nav-find">
            <MapPin size={15} /> Find a charger
          </Link>

          <button
            type="button"
            className="icon-circle"
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {user ? (
            <div className="account" ref={accountRef}>
              <button
                type="button"
                className="account-trigger"
                aria-haspopup="menu"
                aria-expanded={accountOpen}
                onClick={() => setMenu((m) => ({ ...m, account: accountOpen ? null : pathname }))}
              >
                <span className="avatar-sm">{name.charAt(0).toUpperCase()}</span>
                <ChevronDown size={15} className={"chev" + (accountOpen ? " open" : "")} />
              </button>
              {accountOpen && (
                <div className="account-menu" role="menu">
                  <div className="account-head">
                    <strong>{name}</strong>
                    <span>{user.email}</span>
                  </div>
                  <Link to="/profile" role="menuitem"><User size={16} /> Profile &amp; vehicle</Link>
                  <Link to="/history" role="menuitem"><History size={16} /> Charging history</Link>
                  <button type="button" role="menuitem" onClick={handleLogout}>
                    <LogOut size={16} /> Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="nav-signin">Sign in</Link>
          )}

          <button
            type="button"
            className="icon-circle nav-burger"
            aria-label={drawerOpen ? "Close menu" : "Open menu"}
            aria-expanded={drawerOpen}
            onClick={() => setMenu((m) => ({ ...m, drawer: drawerOpen ? null : pathname }))}
          >
            {drawerOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {drawerOpen && (
        <div className="nav-drawer">
          <div className="container">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} className={linkClass}>
                {link.label}
              </NavLink>
            ))}
            <NavLink to="/stations" className={linkClass}>Find a charger</NavLink>
            <NavLink to="/recommendation" className={linkClass}>Best match</NavLink>
            {user ? (
              <>
                <NavLink to="/history" className={linkClass}>Charging history</NavLink>
                <NavLink to="/profile" className={linkClass}>Profile</NavLink>
                <button type="button" className="nav-link" onClick={handleLogout}>Sign out</button>
              </>
            ) : (
              <NavLink to="/login" className={linkClass}>Sign in</NavLink>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
