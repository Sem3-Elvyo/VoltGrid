import { lazy } from "react";
import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

// Code splitting: each page is downloaded only when the user first visits it.
const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));
const Stations = lazy(() => import("./pages/Stations.jsx"));
const StationDetail = lazy(() => import("./pages/StationDetail.jsx"));
const Simulator = lazy(() => import("./pages/Simulator.jsx"));
const Recommendation = lazy(() => import("./pages/Recommendation.jsx"));
const History = lazy(() => import("./pages/History.jsx"));
const Profile = lazy(() => import("./pages/Profile.jsx"));
const Shop = lazy(() => import("./pages/Shop.jsx"));
const About = lazy(() => import("./pages/About.jsx"));
const Help = lazy(() => import("./pages/Help.jsx"));
const Contact = lazy(() => import("./pages/Contact.jsx"));
const Legal = lazy(() => import("./pages/Legal.jsx"));
const Compare = lazy(() => import("./pages/Compare.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));

// Visit /#/crash to demonstrate the Error Boundary.
function CrashDemo() {
  throw new Error("This error was thrown on purpose to demo the Error Boundary.");
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/stations" element={<Stations />} />
        <Route path="/stations/:stationId" element={<StationDetail />} />
        <Route path="/simulator" element={<Simulator />} />
        <Route path="/recommendation" element={<Recommendation />} />
        <Route path="/about" element={<About />} />
        <Route path="/help" element={<Help />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Legal kind="privacy" />} />
        <Route path="/terms" element={<Legal kind="terms" />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/login" element={<Login />} />

        {/* Protected routes: need to be signed in */}
        <Route element={<ProtectedRoute />}>
          <Route path="/history" element={<History />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route path="/crash" element={<CrashDemo />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
