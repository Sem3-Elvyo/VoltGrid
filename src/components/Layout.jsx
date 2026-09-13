import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";

export default function Layout() {
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("voltgrid-theme") === "dark"
  );

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      darkMode ? "dark" : "light"
    );
    localStorage.setItem("voltgrid-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <div className="app-shell">
      <Navbar darkMode={darkMode} onToggleDarkMode={() => setDarkMode((v) => !v)} />
      <main className="page-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
