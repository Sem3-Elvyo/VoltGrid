import { Suspense, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Loader2 } from "lucide-react";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import ScrollToTop from "./ScrollToTop.jsx";
import CompareBar from "./CompareBar.jsx";
import Toaster from "./Toaster.jsx";
import ErrorBoundary from "./ErrorBoundary.jsx";
import { fetchStations } from "../store/slices/stationsSlice.js";
import { useChargingTicker } from "../hooks/useChargingTicker.js";
import { useLiveStations } from "../hooks/useLiveStations.js";

function PageLoader() {
  return (
    <div className="page-loader">
      <Loader2 size={26} className="spin" />
    </div>
  );
}

export default function Layout() {
  const dispatch = useDispatch();
  const location = useLocation();
  const stationsStatus = useSelector((s) => s.stations.status);

  // Load stations once when the app starts.
  useEffect(() => {
    if (stationsStatus === "idle") dispatch(fetchStations());
  }, [stationsStatus, dispatch]);

  // App-wide background behaviour (works on every page).
  useChargingTicker();
  useLiveStations();

  return (
    <div className="app-shell">
      <ScrollToTop />
      <Navbar />
      <main className="page-content">
        {/* key = reset the boundary when the route changes */}
        <ErrorBoundary key={location.pathname}>
          {/* Suspense shows a fallback while lazy-loaded pages download */}
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
      <CompareBar />
      <Toaster />
    </div>
  );
}
