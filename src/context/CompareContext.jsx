import { useCallback, useMemo, useState } from "react";
import { CompareContext, MAX_COMPARE } from "./compareStore.js";

// Second Context: the "compare list" is temporary UI state shared by the station
// cards, the floating tray and the /compare page. It doesn't need DevTools or
// persistence, so Context is the right tool (business data stays in Redux).

export function CompareProvider({ children }) {
  const [ids, setIds] = useState([]);

  const toggle = useCallback((id) => {
    setIds((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : cur.length < MAX_COMPARE ? [...cur, id] : cur));
  }, []);
  const clear = useCallback(() => setIds([]), []);

  const value = useMemo(() => ({ ids, toggle, clear, isFull: ids.length >= MAX_COMPARE }), [ids, toggle, clear]);
  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}
