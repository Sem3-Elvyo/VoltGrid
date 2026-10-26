import { createContext, useContext } from "react";

export const CompareContext = createContext(null);
export const MAX_COMPARE = 3;

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used inside <CompareProvider>");
  return ctx;
}
