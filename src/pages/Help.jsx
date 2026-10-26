import { Link } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs.jsx";

const faqs = [
  ["Is the charging data real?", "No. Stations, prices and availability are mock data created for this project."],
  ["How do I reserve a slot?", "Open any station, fill in the Reserve a slot form, and your booking appears on the History page."],
  ["Why do I need to sign in?", "History and Profile are protected pages. Use any valid email and a password of 6+ characters; there is no real account."],
  ["How does the recommendation score work?", "Each station is scored on speed (limited by your car), price, distance, rating and queue. You can change the weights on the Recommended page."],
  ["How do I compare stations?", "Tap the compare icon on up to three station cards, then open Compare from the tray at the bottom."],
  ["Is my data saved?", "Favourites, bookings, profile and theme are stored in your browser's local storage only."],
];

export default function Help() {
  return (
    <div className="container narrow" style={{ paddingBottom: 56 }}>
      <Breadcrumbs items={[{ to: "/", label: "Home" }, { label: "Help center" }]} />
      <div className="page-header" style={{ marginTop: 10 }}>
        <h1>Help center</h1><p>Answers to common questions.</p>
      </div>
      <div className="faq">
        {faqs.map(([q, a]) => (
          <details key={q} className="card"><summary>{q}</summary><p>{a}</p></details>
        ))}
      </div>
      <p className="hint" style={{ marginTop: 18 }}>Still stuck? <Link to="/contact">Contact us</Link>.</p>
    </div>
  );
}
