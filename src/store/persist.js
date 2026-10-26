// Tiny custom middleware: after every action, save the important slices to
// localStorage. loadPersistedState() feeds them back as `preloadedState`.
const KEY = "voltgrid-state-v1";
const PERSISTED_SLICES = ["auth", "profile", "favorites", "charging", "history", "preferences", "bookings"];

export function loadPersistedState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return undefined;
    const saved = JSON.parse(raw);
    // A charging session can't survive a page reload.
    if (saved.charging?.status === "charging") saved.charging.status = "idle";
    if (saved.auth) saved.auth = { ...saved.auth, status: "idle", error: null };
    return saved;
  } catch {
    return undefined; // corrupted JSON -> start fresh
  }
}

export const persistMiddleware = (storeApi) => (next) => (action) => {
  const result = next(action);
  try {
    const state = storeApi.getState();
    const snapshot = {};
    PERSISTED_SLICES.forEach((key) => {
      snapshot[key] = state[key];
    });
    localStorage.setItem(KEY, JSON.stringify(snapshot));
  } catch {
    // storage full / blocked: the app still works, it just won't persist
  }
  return result;
};
