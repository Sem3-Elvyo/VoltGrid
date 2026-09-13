import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Stations from "./pages/Stations.jsx";
import Simulator from "./pages/Simulator.jsx";
import Recommendation from "./pages/Recommendation.jsx";
import History from "./pages/History.jsx";
import Profile from "./pages/Profile.jsx";
import Shop from "./pages/Shop.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/stations" element={<Stations />} />
        <Route path="/simulator" element={<Simulator />} />
        <Route path="/recommendation" element={<Recommendation />} />
        <Route path="/history" element={<History />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
