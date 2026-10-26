import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Router doesn't reset scroll on navigation in an SPA, so we do it ourselves.
export default function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}