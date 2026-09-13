// All the data below is fake/mock data.
// No API or database is used in this project — every page reads from here.

export const currentUser = {
  name: "Aarav",
  email: "aarav@example.com",
};

export const myVehicle = {
  make: "Tata",
  model: "Nexon EV",
  connector: "CCS2",
  batteryCapacityKwh: 40,
  maxChargingSpeedKw: 50,
  batteryPercent: 64,
  rangeKm: 212,
};

export const stations = [
  {
    id: 1,
    name: "ChargeZone - Ferozepur Road",
    lat: 30.35,
    lng: 76.38,
    distanceKm: 4.2,
    power: 120,
    type: "DC Fast",
    price: 8,
    available: true,
    rating: 4.6,
    queue: 0,
  },
  {
    id: 2,
    name: "Tata Power - Model Town",
    lat: 30.9,
    lng: 75.85,
    distanceKm: 2.1,
    power: 50,
    type: "DC Fast",
    price: 9,
    available: true,
    rating: 4.3,
    queue: 1,
  },
  {
    id: 3,
    name: "Ather Grid - Sarabha Nagar",
    lat: 30.89,
    lng: 75.83,
    distanceKm: 6.8,
    power: 22,
    type: "AC",
    price: 6,
    available: false,
    rating: 4.1,
    queue: 3,
  },
  {
    id: 4,
    name: "Statiq - Civil Lines",
    lat: 30.91,
    lng: 75.86,
    distanceKm: 9.5,
    power: 30,
    type: "AC",
    price: 7,
    available: true,
    rating: 3.9,
    queue: 0,
  },
  {
    id: 5,
    name: "ChargeZone - PAU Gate",
    lat: 30.9,
    lng: 75.8,
    distanceKm: 3.4,
    power: 150,
    type: "DC Fast",
    price: 8.5,
    available: true,
    rating: 4.8,
    queue: 0,
  },
];

export const trendingStations = [stations[4], stations[0], stations[1]];

export const favoriteStations = [stations[0], stations[4]];

// Real photos (Wikimedia Commons, freely licensed) showing EVs and EV
// charging infrastructure from different parts of India.
// Special:FilePath redirects straight to the full image, so we only need
// the exact file name from the Commons page.
function commonsUrl(filename, width = 640) {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(
    filename
  )}?width=${width}`;
}

export const indiaEvGallery = [
  {
    caption: "Tata Nexon EV",
    src: commonsUrl("2020 Tata Nexon EV (India) front view.png"),
  },
  {
    caption: "Tata Nexon EV, Dark Edition",
    src: commonsUrl("2023 Tata Nexon XZA+ front view.jpg"),
  },
  {
    caption: "Mahindra XUV700",
    src: commonsUrl("2021 Mahindra XUV700 2.2 AX7 (India) front view.png"),
  },
  {
    caption: "EV chargers, Dharwad, Karnataka",
    src: commonsUrl(
      "Electric chargers at Dharwad railway station road at early morning 4 AM January 12 2026.jpg"
    ),
  },
  {
    caption: "Fast charging station, Valakom, Kerala",
    src: commonsUrl("Ev super charging station ,valakom.jpg"),
  },
  {
    caption: "Tata Nexon, dual-tone",
    src: commonsUrl("Tata Nexon Blue Dual Tone.jpg"),
  },
];

// Amazon search links for common EV-charging accessories. Clicking any of
// these opens Amazon in a new tab where the user can browse and add items
// to their cart — there's no store or checkout built into this app.
export const shopItems = [
  {
    id: "type2-cable",
    name: "Type 2 AC Charging Cable",
    description: "Portable cable for topping up at any public AC point.",
    amazonQuery: "type 2 ev charging cable india",
  },
  {
    id: "portable-charger",
    name: "Portable EV Charger (Home)",
    description: "Plug into a regular socket and charge overnight at home.",
    amazonQuery: "portable ev home charger india",
  },
  {
    id: "obd-dongle",
    name: "OBD-II Diagnostic Dongle",
    description: "Read battery health and fault codes from your phone.",
    amazonQuery: "obd2 dongle electric vehicle india",
  },
  {
    id: "extension-reel",
    name: "Heavy-Duty Extension Reel",
    description: "Safely run power to your EV charger from indoors.",
    amazonQuery: "heavy duty extension cord reel ev charging",
  },
  {
    id: "tyre-inflator",
    name: "Digital Tyre Inflator",
    description: "12V inflator that plugs into your car for quick top-ups.",
    amazonQuery: "digital car tyre inflator 12v",
  },
  {
    id: "cable-organizer",
    name: "Charging Cable Organizer",
    description: "Keep your charging cable coiled, clean and tangle-free.",
    amazonQuery: "ev charging cable organizer holder",
  },
];

export const chargingHistory = [
  { date: "Aug 13", station: "Tata Power", energyKwh: 21.4, cost: 160 },
  { date: "Aug 10", station: "ChargeZone", energyKwh: 18.2, cost: 136 },
  { date: "Aug 05", station: "Statiq", energyKwh: 12.6, cost: 88 },
  { date: "Jul 29", station: "ChargeZone", energyKwh: 24.8, cost: 198 },
  { date: "Jul 21", station: "Ather Grid", energyKwh: 9.4, cost: 56 },
];
