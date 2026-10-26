import Breadcrumbs from "../components/Breadcrumbs.jsx";

const docs = {
  privacy: {
    title: "Privacy policy",
    sections: [
      ["What we store", "VoltGrid has no server. Your favourites, bookings, profile and theme are saved in your own browser's local storage and never leave your device."],
      ["Location", "Your location is requested only when you press 'Use my location', and is not stored."],
      ["Cookies and tracking", "We don't use cookies, analytics or advertising trackers."],
      ["Deleting your data", "Clear this site's data in your browser settings to remove everything."],
    ],
  },
  terms: {
    title: "Terms of service",
    sections: [
      ["Demo project", "VoltGrid is a student project. Stations, prices and availability are fictional."],
      ["No real bookings", "Reservations made in the app are not real and no payment is taken."],
      ["Acceptable use", "Please don't try to break the app or misuse the contact form."],
      ["Changes", "These terms may change as the project develops."],
    ],
  },
};

export default function Legal({ kind }) {
  const doc = docs[kind];
  return (
    <div className="container narrow" style={{ paddingBottom: 56 }}>
      <Breadcrumbs items={[{ to: "/", label: "Home" }, { label: doc.title }]} />
      <div className="page-header" style={{ marginTop: 10 }}>
        <h1>{doc.title}</h1><p>Last updated 21 October 2026</p>
      </div>
      <div className="card legal">
        {doc.sections.map(([h, p]) => (<section key={h}><h3>{h}</h3><p>{p}</p></section>))}
      </div>
    </div>
  );
}
