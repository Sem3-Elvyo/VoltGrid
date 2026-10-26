// Fake "server" call. It behaves like a real HTTP request (async + latency +
// possible failure) so we can demonstrate loading / error states in Redux.
import { stations } from "../data/mockData.js";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchStationsApi({ forceError = false } = {}) {
  await wait(900);
  if (forceError) {
    throw new Error("Network error: could not reach the VoltGrid server.");
  }
  return stations.map((s) => ({ ...s }));
}
