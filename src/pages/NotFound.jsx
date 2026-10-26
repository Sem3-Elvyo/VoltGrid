import { Link, useLocation } from "react-router-dom";
import { Unplug } from "lucide-react";

export default function NotFound() {
  const { pathname } = useLocation();
  return (
    <div className="container" style={{ paddingBottom: 72 }}>
      <div className="card error-card not-found">
        <Unplug size={40} />
        <h1>404 — charger not found</h1>
        <p><code>{pathname}</code> doesn&apos;t exist. The link may be broken or the page moved.</p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <Link to="/" className="btn btn-primary">Go home</Link>
          <Link to="/stations" className="btn btn-outline">Find stations</Link>
        </div>
      </div>
    </div>
  );
}
