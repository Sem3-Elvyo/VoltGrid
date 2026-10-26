import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import LoginForm from "../components/LoginForm.jsx";

export default function Login() {
  const user = useSelector((s) => s.auth.user);
  const location = useLocation();
  const navigate = useNavigate();
  // ProtectedRoute stores the page the user originally wanted in router state.
  const from = location.state?.from?.pathname ?? "/";

  if (user) return <Navigate to={from} replace />;

  return (
    <div>
      {location.state?.from && (
        <div className="container">
          <div className="redirect-note">
            Please sign in to open <strong>{from}</strong>.
          </div>
        </div>
      )}
      <LoginForm onSuccess={() => navigate(from, { replace: true })} />
    </div>
  );
}
