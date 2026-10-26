import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

// Layout route: renders child routes only when logged in, otherwise redirects
// to /login and remembers where the user wanted to go.
export default function ProtectedRoute() {
  const user = useSelector((s) => s.auth.user);
  const location = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  return <Outlet />;
}
