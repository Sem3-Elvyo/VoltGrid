import { useCallback, useEffect, useMemo, useState } from "react";
import { ThemeContext } from "./themeContext.js";

// Context API: theme is UI-only state shared by many components, so it lives
// in Context. Business data (stations, charging, history...) lives in Redux.
const STORAGE_KEY = "voltgrid-theme";

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem(STORAGE_KEY) || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = useCallback(
    () => setTheme((t) => (t === "dark" ? "light" : "dark")),
    []
  );
  // useMemo keeps the context value stable so consumers only re-render on real change.
  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
