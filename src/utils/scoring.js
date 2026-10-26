// Pure scoring logic for the recommendation engine.
// Every factor is normalised to 0..1, then combined with user-chosen weights.
const clamp = (n) => Math.min(1, Math.max(0, n));

export const FACTORS = [
  { key: "distance", label: "Distance", hint: "closer is better" },
  { key: "speed", label: "Charging speed", hint: "what your car can actually use" },
  { key: "price", label: "Price", hint: "cheaper is better" },
  { key: "rating", label: "Rating", hint: "driver reviews" },
  { key: "queue", label: "Short queue", hint: "less waiting" },
  { key: "availability", label: "Availability", hint: "free right now" },
];

export function scoreStation(station, weights, vehicleMaxKw) {
  // A 150 kW charger is no faster than a 50 kW one for a car that tops out at 50 kW.
  const usableKw = Math.min(station.power, vehicleMaxKw);
  const factors = {
    distance: clamp(1 - station.distanceKm / 15),
    speed: clamp(usableKw / vehicleMaxKw),
    price: clamp(1 - (station.price - 4) / 11),
    rating: clamp((station.rating - 3) / 2),
    queue: clamp(1 - station.queue / 4),
    availability: station.available ? 1 : 0,
  };
  const totalWeight = FACTORS.reduce((sum, f) => sum + weights[f.key], 0);
  const weighted = FACTORS.reduce(
    (sum, f) => sum + factors[f.key] * weights[f.key],
    0
  );
  const score = totalWeight === 0 ? 0 : (weighted / totalWeight) * 100;
  return { score, factors, usableKw };
}
