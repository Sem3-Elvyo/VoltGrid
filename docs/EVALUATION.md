# VoltGrid: evaluation notes

## 3-minute demo script (in this order)

1. **Open Redux DevTools** (browser extension) → every action below shows up in the action log.
2. **Dashboard**: skeleton cards flash while the fake API loads (`fetchStations` thunk: pending → fulfilled).
3. **Stations**: type in search (debounced), change sort/filters, navigate away and back → filters are still there (global state).
   Click **Simulate error** → error card + Retry. Click a card's **heart** → toast + navbar counter changes.
4. Leave **Live availability** on → every ~7 s a station flips. If it's a *favourite* that just became free you get a toast (listener middleware).
5. **Recommended**: click presets (Cheapest / Fastest) or drag sliders → ranking and the "Why this station" bars update instantly.
   Then go to *Profile → Max charging speed = 150* → rankings change (a faster car can use faster chargers).
6. **Charging**: pick a station, press Start, then **browse other pages**: the navbar chip keeps ticking.
   When it finishes (or you press Stop) a session is saved and a toast appears.
7. **History** (protected): you are redirected to `/login` first, then returned to History after signing in.
   New session is in the table. Try the station filter, delete a row, Export CSV.
8. **Refresh the page** → favourites, history, battery, profile and login survive (persist middleware).
9. Visit `/#/crash` → Error Boundary catches it, "Try again" recovers.
10. Toggle dark mode (Context API).

## Likely viva questions

**Why Redux and not just useState / Context?**
Many unrelated pages need the same data (battery, favourites, stations). Lifting state or prop-drilling gets messy; Context re-renders every consumer on any change and has no tooling. Redux gives one source of truth, predictable updates, DevTools/time-travel, middleware.
We kept *UI-only* state (theme) in Context and *form-local* state in `useState`/`useReducer`. Not everything belongs in Redux.

**Why Redux Toolkit?** Less boilerplate: `createSlice` generates actions + reducers; Immer lets us write "mutating" code safely; `configureStore` adds DevTools and sensible middleware by default.

**What is `createAsyncThunk`?** A helper that dispatches `pending / fulfilled / rejected` actions around an async function. We handle them in `extraReducers` to drive loading and error UI (`stationsSlice.js`).

**Why are reducers "pure" and where do side effects go?** Reducers can't do random numbers, API calls, or dispatch. Randomness lives in the `useLiveStations` hook; follow-up actions (toast, saving a session) live in the **listener middleware**.

**What does `createSelector` do?** Memoises derived data: `selectRankedStations` only recomputes when stations, weights or vehicle change, not on every unrelated action.

**What is `createEntityAdapter`?** Stores a collection normalised (`ids` + `entities`), giving O(1) lookup by id (`selectStationById`) and helpers like `updateOne`: a live update touches one station only, so `React.memo` on `StationCard` re-renders just that card.

**How does persistence work?** A custom middleware runs after every action and writes selected slices to `localStorage`; on startup `loadPersistedState()` is passed as `preloadedState`.

**How do protected routes work?** `ProtectedRoute` is a layout route: if `auth.user` is null it `<Navigate>`s to `/login` and stores the original location in router state, so login can send you back.

**Why `React.lazy`?** Code splitting: each page is its own JS chunk, loaded on first visit; `Suspense` shows a fallback meanwhile (see the build output).

**Why is the Error Boundary a class?** Only class components support `getDerivedStateFromError` / `componentDidCatch`.

**Where is `useReducer` used and why not Redux there?** The cost calculator: complex but purely local, and nobody else needs it.


## Rubric (Annexure-A) to code map: show these in the viva

| Rubric criterion (marks) | Point the evaluator to |
|---|---|
| Navigation layout and page structure (8) | `App.jsx` (layout route + `Outlet`, protected layout route, dynamic `:stationId`, lazy routes, `*` -> 404), `Layout.jsx`, `Navbar.jsx` (`NavLink` active state), `Breadcrumbs.jsx`, `ScrollToTop.jsx`, login redirect-back via router state |
| Context API and state architecture (8) | `ThemeContext` + `CompareContext` (memoised values, custom hooks, error if used outside provider) and the "Redux vs Context vs local" rule in the README |
| Redux Toolkit (5) | 10 slices, `createAsyncThunk`, `createEntityAdapter`, `createSelector`, listener middleware, persist middleware, DevTools |
| Form handling in React (4) | `useForm`, `FormField.jsx`, `validators.js`, `BookingForm.jsx` (cross-field validation), `LoginForm.jsx` |

Extra demo steps for v3: (11) open a station, try submitting the **Reserve a slot** form empty, then with a
past time, then valid: see errors appear on blur and clear live; the booking shows on **History**.
(12) Click the compare icon on 2-3 cards, then **Compare** in the tray. (13) Visit `/#/nope` for the 404 page.

## Extra viva questions

**Why validate on blur and then on change?** Errors on the first keystroke feel hostile; waiting until submit is late. Blur-then-live is the usual compromise (`useForm.js`).

**Why is the compare list in Context and not Redux?** It is temporary UI state, not worth persisting or inspecting in DevTools. It shows we choose the tool per kind of state.

**Why is there a separate `compareStore.js`?** Keeping the context object and hook out of the component file keeps Fast Refresh working.

## Presentation (5 marks): 5-minute outline

1. Problem + users (30s) 2. Live demo of the flow above (2.5 min) 3. Architecture diagram: Redux vs Context vs local (1 min) 4. One thing each member built, said by that member (1 min) 5. What we would add next (30s).
