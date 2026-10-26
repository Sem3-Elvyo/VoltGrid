# VoltGrid — EV Charging App (React)

A clean, white-background, professional-looking EV charging web app —
styled closer to sites like bolt.earth, Tata EV's Charging Locator, and
ChargeZone. No backend, no database, no external API keys. Everything runs
on mock data in `src/data/mockData.js`, the browser's Geolocation API.

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

---

## v2: Advanced React + Redux Toolkit

The app was refactored from local `useState` everywhere to a proper global-state architecture.
Still no backend: the "API" is a fake async function with latency and failures (`src/api/stationsApi.js`).

### Redux store (`src/store/`)

| Slice | Holds | Notable concept |
|---|---|---|
| `stations` | all stations + `status` / `error` | `createAsyncThunk`, `createEntityAdapter`, loading / error states |
| `filters` | search, type, price, distance, sort | one generic `setFilter` reducer, `resetFilters` |
| `favorites` | favourite station ids | toggled from any card, shown in the navbar |
| `charging` | battery %, status, target, selected station | state machine (`idle → charging → complete`) |
| `history` | past sessions | `prepare` callback + `nanoid` for ids |
| `preferences` | recommendation weights + presets | drives the live ranking |
| `profile` | user + vehicle | slice reacting to another slice's action (`extraReducers`) |
| `auth` | logged-in user | async login thunk with `rejectWithValue` |
| `notifications` | toast queue | dispatched from anywhere (incl. middleware) |

Also in the store: **memoised selectors** (`createSelector`, `selectors.js`), **listener middleware**
(`listeners.js`: side effects like auto-saving a finished charging session), and a **custom persistence
middleware** (`persist.js`: saves state to `localStorage`, restored through `preloadedState`).

### Other React concepts used
Context API (`ThemeContext`), custom hooks (`useDebounce`, `useGeolocation`, `useChargingTicker`,
`useLiveStations`, `useTheme`), `useReducer` (cost calculator), `useMemo` / `useCallback` / `React.memo`,
`React.lazy` + `Suspense` (code splitting), Error Boundary, protected routes, dynamic route params
(`/stations/:stationId`), controlled forms with validation, skeleton loaders.

See **`docs/EVALUATION.md`** for a demo script and viva Q&A.


---

## v3: Forms, a second Context, and navigation polish

| Addition | Where | Rubric area |
|---|---|---|
| Reusable form components (`TextField`, `PasswordField`, `SelectField`) with label, hint, error and ARIA wiring | `src/components/form/FormField.jsx` | Form handling |
| `useForm` hook: validate on blur, then live; validate-all on submit | `src/hooks/useForm.js` | Form handling |
| Composable validation rules incl. a cross-field rule (slot can't pass midnight) | `src/utils/validators.js` | Form handling |
| "Reserve a slot" form, saved to a new `bookings` slice, listed/cancelled on History | `src/components/BookingForm.jsx`, `src/store/slices/bookingsSlice.js` | Forms + Redux Toolkit |
| Login + Profile refactored onto the shared form pieces (password show/hide + strength) | `LoginForm.jsx`, `Profile.jsx` | Form handling |
| `CompareContext`: compare up to 3 stations from any card, floating tray, `/compare` page | `src/context/`, `CompareBar.jsx`, `pages/Compare.jsx` | Context API |
| Breadcrumbs, scroll-to-top on route change, real 404 page | `Breadcrumbs.jsx`, `ScrollToTop.jsx`, `pages/NotFound.jsx` | Navigation layout |
| Unit tests (Vitest) for validators and slices; CI runs lint + test before deploy | `src/__tests__/`, `deploy.yml` | Code quality |

**State rule of thumb we follow:** shared business data → Redux; temporary UI state shared across
components (theme, compare list) → Context; state used by one form/component → `useState`/`useForm`.

## Run it

```bash
npm install
npm run dev     # local dev server
npm test        # unit tests
npm run lint
npm run build   # production build (deployed to GitHub Pages by CI)
```

## Team Responsibilities

### Team VoltGrid — EV Charging App

| Team Member | Assigned Module | Responsibilities |
|---|---|---|
| **Palak** | Charging Simulator & Cost Calculator | Live charging simulation, battery percentage updates, charging status management and charging cost estimation |
| **Lubhav** | Dashboard, Map & Location API | Dashboard UI, hero section, vehicle and battery cards, mock map, station markers and browser geolocation |
| **Nibhi Khanna** | Recommendation System, Profile, History & Analytics | Station recommendation and ranking algorithm, user and vehicle profile management, charging history, session records, analytics and charging statistics |
| **Simran** | Charging Stations, Search, Filters & Station API | Station listing, search functionality, AC/DC and fast-charging filters, price and distance filters, availability filtering and station API integration |

### 1. Palak — Charging Simulator & Cost Calculator

**Primary file:** `src/pages/Simulator.jsx`

Responsibilities:
- Develop the live charging simulator.
- Update battery percentage over time.
- Manage charging states: idle, charging and complete.
- Implement the charging cost calculator.
- Connect charging functionality with Redux Toolkit.
- Support saving completed charging sessions to history.

### 2. Lubhav — Dashboard, Map & Location API

**Primary files:** `src/pages/Dashboard.jsx`, `src/components/ImageStrip.jsx`

Responsibilities:
- Develop the main dashboard and hero section.
- Display vehicle details, battery status and quick statistics.
- Create the mock map with charging station markers.
- Integrate browser geolocation using the Geolocation API.
- Handle location permission states: idle, requesting, granted, denied and unsupported.
- Display trending and favourite stations.
- Integrate the India EV image gallery.

### 3. Nibhi Khanna — Recommendation System, Profile, History & Analytics

**Primary files:** `src/pages/Recommendation.jsx`, `src/pages/Profile.jsx`, `src/pages/History.jsx`

Responsibilities:
- Develop the station recommendation and ranking algorithm.
- Rank charging stations using factors such as price, distance and user preferences.
- Implement recommendation weights and preference presets.
- Develop editable user and vehicle profile functionality.
- Display previous charging sessions and session records.
- Build charging history tables and analytics visualisations.
- Display charging statistics, usage summaries and session-related insights.
- Integrate relevant Redux slices and selectors for recommendations, profile and history.

### 4. Simran — Charging Stations, Search, Filters & Station API

**Primary files:** `src/pages/Stations.jsx`, `src/components/StationCard.jsx`, `src/api/stationsApi.js`

Responsibilities:
- Develop the charging station listing page.
- Implement station search and sorting.
- Add filters for AC/DC type, fast charging, price, distance and availability.
- Create reusable charging station cards.
- Integrate station data through the mock asynchronous Station API.
- Handle loading and error states.
- Connect station data with Redux Toolkit and relevant selectors.
- Support favourite stations and station comparison integration.

### Shared Team Responsibilities

All team members are responsible for integrating their modules into the common application, testing their functionality, resolving bugs, maintaining code quality and coordinating through Git and GitHub.

The presentation and PowerPoint responsibilities will be coordinated separately by the team.
Git workflow and commit expectations: `docs/TEAM_WORKFLOW.md`. Marking-scheme mapping: `docs/EVALUATION.md`.
