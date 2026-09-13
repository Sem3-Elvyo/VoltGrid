# VoltGrid — EV Charging App (React)

A clean, white-background, professional-looking EV charging web app —
styled closer to sites like bolt.earth, Tata EV's Charging Locator, and
ChargeZone. No backend, no database, no external API keys. Everything runs
on mock data in `src/data/mockData.js`, the browser's Geolocation API, and
[lucide-react](https://lucide.dev) for clean line icons (no emoji, no
AI-generated icon look).

## Run it

```bash
npm install
npm run dev
```

Then open the URL it prints (usually http://localhost:5173).

To build a production version:

```bash
npm run build
npm run preview
```

## Structure

There's no separate login/signup page. Every route shares one `Layout`
(top navbar + page content + footer). The home page (`/`) opens with a
hero section like a real product site, then the dashboard content, and
ends with an embedded sign-in form (`src/components/LoginForm.jsx`) right
before the footer — exactly like a marketing site with a login widget at
the bottom, not a gate that blocks the rest of the app.

| Route              | What it shows                                            |
|---------------------|-----------------------------------------------------------|
| `/` (Dashboard)     | Hero, vehicle & battery cards, mock map, trending/favorite stations, quick stats, then the sign-in form |
| `/stations`         | All stations, with search + AC/DC, fast-charging, price, distance and availability filters |
| `/simulator`        | Live charging simulation (battery % increases over time) + a cost calculator |
| `/recommendation`   | A simple scoring engine that ranks stations and picks the "best for you" |
| `/history`          | Past charging sessions with a bar chart and a table |
| `/profile`          | Editable user + vehicle profile |

## New features

- **Browser geolocation, done properly** — on the Dashboard, location isn't
  requested automatically. There's a "Use my location" button
  (`src/pages/Dashboard.jsx`) that calls `navigator.geolocation.getCurrentPosition()`
  only when clicked, which is what makes the browser show its native
  *"Allow this site to access your location?"* prompt. The UI reflects every
  state: idle, waiting for the prompt, granted (shows your coordinates),
  denied, and unsupported.
- **Dark mode toggle** — the sun/moon button in the navbar
  (`src/components/Navbar.jsx`) flips a `data-theme` attribute on
  `<html>`, which swaps every CSS variable in `src/index.css`
  (`[data-theme="dark"] { ... }`). The choice is saved to `localStorage` via
  `src/components/Layout.jsx`, so it's remembered next visit.
- **India EV image strip** — `src/components/ImageStrip.jsx` shows a
  horizontally scrolling row of real, freely-licensed photos (Wikimedia
  Commons) of Indian EVs and charging stations — Tata Nexon EV, Mahindra
  XUV700, and charging points in Dharwad (Karnataka) and Valakom (Kerala).
  The list lives in `indiaEvGallery` in `src/data/mockData.js`; add more by
  pushing `{ caption, src }` objects there.
- **Shop EV accessories** — `/shop` (`src/pages/Shop.jsx`) lists common
  charging accessories (cables, home chargers, OBD dongles, etc.). Clicking
  a card opens an Amazon search for that item in a new tab — there's no
  cart or checkout in this app, Amazon handles that part. Edit `shopItems`
  in `src/data/mockData.js` to change what's listed or which search terms
  are used.

## Design system

- **Colors:** white background (`--bg`), a soft off-white surface for
  section fills, a single emerald-green accent (`--primary`) for CTAs,
  progress bars and highlights, plus muted amber/red/blue for status pills.
- **Type:** one family, Inter, at weights 400–800, used for both headings
  and body text — no default AI-page combos.
- **Icons:** `lucide-react` line icons throughout (map pin, battery, zap,
  star, users, etc.) instead of emoji or generated glyphs.
- All shared tokens live at the top of `src/index.css` — change `--primary`
  there to re-theme the whole app in one place.

## Where each "team member's" work lives

- **Member 1 (Dashboard + Map):** `src/pages/Dashboard.jsx` — uses
  `navigator.geolocation` for your location and a CSS-based mock map
  (`.map-box` in `src/index.css`) with pinned station markers. Swap in a
  real Mapbox `<Map>` component here later if you want real map tiles.
- **Member 2 (Stations + Filters):** `src/pages/Stations.jsx` and
  `src/components/StationCard.jsx`. Mock station objects live in
  `src/data/mockData.js` — replace `stations` with a real API response
  later, the UI won't need to change.
- **Member 3 (Simulator + Cost calculator):** `src/pages/Simulator.jsx`.
  Uses `setInterval` inside `useEffect` to tick the battery percentage up.
- **Member 4 (Recommendation + History + Profile):**
  `src/pages/Recommendation.jsx` (scoring function at the top of the
  file), `src/pages/History.jsx`, and `src/pages/Profile.jsx`.

## Replacing mock data with a real API later

Everything reads from `src/data/mockData.js`. To connect a real backend,
replace the exported arrays with data fetched in `useEffect` + `useState`
in each page — the JSX and component props are already shaped to match,
so nothing else needs to change.
