import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Reset scroll position when the route changes.
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
