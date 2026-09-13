import { Zap } from "lucide-react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">
              <Zap size={18} strokeWidth={2.5} />
              VoltGrid
            </div>
            <p className="footer-tagline">
              Find, filter and pay for EV charging in one place — with
              real-time recommendations built for your car.
            </p>
          </div>

          <div className="footer-col">
            <h4>Product</h4>
            <ul>
              <li><a href="/">Dashboard</a></li>
              <li><a href="/stations">Find stations</a></li>
              <li><a href="/simulator">Charging</a></li>
              <li><a href="/recommendation">Recommendations</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              <li><a href="#about">About us</a></li>
              <li><a href="#careers">Careers</a></li>
              <li><a href="#partners">Partners</a></li>
              <li><a href="#press">Press</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Support</h4>
            <ul>
              <li><a href="#help">Help center</a></li>
              <li><a href="#contact">Contact us</a></li>
              <li><a href="#privacy">Privacy policy</a></li>
              <li><a href="#terms">Terms of service</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} VoltGrid. All rights reserved.</span>
          <span>Made for drivers, not dashboards.</span>
        </div>
      </div>
    </footer>
  );
}
