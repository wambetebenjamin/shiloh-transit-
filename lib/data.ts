export type OperatorName = "Shiloh Express" | "Jordan Coaches" | "Canaan Shuttle";

export type Route = {
  id: string;
  from: string;
  to: string;
  operator: OperatorName;
  coach: string;
  departure: string;
  arrival: string;
  duration: string;
  durationMinutes: number;
  baseFare: number;
  fareMax: number;
  seatsTotal: number;
  seatsAvailable: number;
};

export const CITIES = [
  "Nairobi",
  "Mombasa",
  "Kisumu",
  "Nakuru",
  "Eldoret",
  "Malindi",
] as const;

export const BOOKING_FEE = 50;

export const WHATSAPP_NUMBER = "254112272061";
export const WHATSAPP_MESSAGE =
  "Hello Shiloh Transit, I would like to book a seat or ask about a route.";
export const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  WHATSAPP_MESSAGE
)}`;

export const OPERATORS: {
  name: OperatorName;
  monogram: string;
  tagline: string;
  accent: string;
}[] = [
  {
    name: "Shiloh Express",
    monogram: "SE",
    tagline: "Executive coaches on Kenya's major intercity corridors.",
    accent: "#2887ff",
  },
  {
    name: "Jordan Coaches",
    monogram: "JC",
    tagline: "Comfortable VIP travel between Kenya's biggest cities.",
    accent: "#0f766e",
  },
  {
    name: "Canaan Shuttle",
    monogram: "CS",
    tagline: "Point to point shuttles with frequent daily departures.",
    accent: "#1d4ed8",
  },
];

export const ROUTES: Route[] = [
  {
    id: "nairobi-mombasa",
    from: "Nairobi",
    to: "Mombasa",
    operator: "Shiloh Express",
    coach: "Executive",
    departure: "07:30",
    arrival: "14:45",
    duration: "7h 15m",
    durationMinutes: 435,
    baseFare: 1800,
    fareMax: 2500,
    seatsTotal: 42,
    seatsAvailable: 18,
  },
  {
    id: "nairobi-kisumu",
    from: "Nairobi",
    to: "Kisumu",
    operator: "Jordan Coaches",
    coach: "VIP",
    departure: "08:00",
    arrival: "15:30",
    duration: "7h 30m",
    durationMinutes: 450,
    baseFare: 1500,
    fareMax: 2200,
    seatsTotal: 42,
    seatsAvailable: 12,
  },
  {
    id: "nairobi-nakuru",
    from: "Nairobi",
    to: "Nakuru",
    operator: "Shiloh Express",
    coach: "Executive",
    departure: "09:00",
    arrival: "12:15",
    duration: "3h 15m",
    durationMinutes: 195,
    baseFare: 800,
    fareMax: 1200,
    seatsTotal: 42,
    seatsAvailable: 24,
  },
  {
    id: "nairobi-eldoret",
    from: "Nairobi",
    to: "Eldoret",
    operator: "Canaan Shuttle",
    coach: "Shuttle",
    departure: "10:00",
    arrival: "14:30",
    duration: "4h 30m",
    durationMinutes: 270,
    baseFare: 1000,
    fareMax: 1500,
    seatsTotal: 14,
    seatsAvailable: 6,
  },
  {
    id: "mombasa-malindi",
    from: "Mombasa",
    to: "Malindi",
    operator: "Canaan Shuttle",
    coach: "Shuttle",
    departure: "08:30",
    arrival: "11:15",
    duration: "2h 45m",
    durationMinutes: 165,
    baseFare: 600,
    fareMax: 900,
    seatsTotal: 14,
    seatsAvailable: 5,
  },
  {
    id: "mombasa-nairobi",
    from: "Mombasa",
    to: "Nairobi",
    operator: "Jordan Coaches",
    coach: "VIP",
    departure: "07:00",
    arrival: "14:30",
    duration: "7h 30m",
    durationMinutes: 450,
    baseFare: 1800,
    fareMax: 2500,
    seatsTotal: 42,
    seatsAvailable: 20,
  },
  {
    id: "kisumu-nakuru",
    from: "Kisumu",
    to: "Nakuru",
    operator: "Jordan Coaches",
    coach: "VIP",
    departure: "13:00",
    arrival: "17:00",
    duration: "4h 00m",
    durationMinutes: 240,
    baseFare: 900,
    fareMax: 1300,
    seatsTotal: 42,
    seatsAvailable: 15,
  },
  {
    id: "nakuru-eldoret",
    from: "Nakuru",
    to: "Eldoret",
    operator: "Shiloh Express",
    coach: "Executive",
    departure: "11:00",
    arrival: "13:20",
    duration: "2h 20m",
    durationMinutes: 140,
    baseFare: 700,
    fareMax: 1000,
    seatsTotal: 42,
    seatsAvailable: 22,
  },
  {
    id: "nakuru-nairobi",
    from: "Nakuru",
    to: "Nairobi",
    operator: "Shiloh Express",
    coach: "Executive",
    departure: "14:00",
    arrival: "17:15",
    duration: "3h 15m",
    durationMinutes: 195,
    baseFare: 800,
    fareMax: 1200,
    seatsTotal: 42,
    seatsAvailable: 30,
  },
  {
    id: "malindi-mombasa",
    from: "Malindi",
    to: "Mombasa",
    operator: "Canaan Shuttle",
    coach: "Shuttle",
    departure: "14:00",
    arrival: "16:45",
    duration: "2h 45m",
    durationMinutes: 165,
    baseFare: 600,
    fareMax: 900,
    seatsTotal: 14,
    seatsAvailable: 7,
  },
];

export const POPULAR_ROUTE_IDS = [
  "nairobi-mombasa",
  "nairobi-kisumu",
  "nairobi-nakuru",
  "nairobi-eldoret",
  "mombasa-malindi",
];

export const POPULAR_ROUTES = POPULAR_ROUTE_IDS
  .map((id) => ROUTES.find((r) => r.id === id))
  .filter((r): r is Route => Boolean(r));

export const HOW_IT_WORKS = [
  {
    title: "Search your route",
    description:
      "Pick your departure city, arrival city and travel date. We show live departures with seats and fares.",
    icon: "search",
  },
  {
    title: "Pick your seat",
    description:
      "Choose your exact seat on a live seat map. Available seats are green and reserved seats are grey.",
    icon: "armchair",
  },
  {
    title: "Pay and get your ticket",
    description:
      "Pay with M-Pesa or card and receive your e-ticket instantly, ready to show on your phone.",
    icon: "credit-card",
  },
] as const;

export const WHY_SHILOH = [
  {
    title: "Real-time seat availability",
    description:
      "Our seat maps update live, so the seat you pick is the seat you get at the bus window.",
    icon: "users",
  },
  {
    title: "Instant e-ticket",
    description:
      "Your QR coded e-ticket arrives the moment payment confirms. No printing needed.",
    icon: "ticket",
  },
  {
    title: "Trusted operators",
    description:
      "Every partner operator is vetted for licensing, safety records and service quality.",
    icon: "badge-check",
  },
  {
    title: "24/7 support via WhatsApp",
    description:
      "Real people on WhatsApp at any hour to help with bookings, changes and travel questions.",
    icon: "message-circle",
  },
] as const;

export const TESTIMONIALS = [
  {
    name: "Grace",
    city: "Nairobi",
    quote:
      "I booked my Mombasa seat on the way to work. The seat map showed exactly what was left and my ticket arrived before I reached the office.",
  },
  {
    name: "Brian",
    city: "Kisumu",
    quote:
      "M-Pesa payment took seconds and the e-ticket QR code was accepted at boarding without any drama. This is how travel should work.",
  },
  {
    name: "Amina",
    city: "Mombasa",
    quote:
      "I had a question at midnight and WhatsApp support answered in minutes. Shiloh Transit has become the only way I book intercity travel.",
  },
];

export function getRoute(id: string): Route | undefined {
  return ROUTES.find((r) => r.id === id);
}

export function filterRoutes(opts: {
  from?: string;
  to?: string;
}): Route[] {
  return ROUTES.filter((r) => {
    if (opts.from && r.from.toLowerCase() !== opts.from.toLowerCase()) return false;
    if (opts.to && r.to.toLowerCase() !== opts.to.toLowerCase()) return false;
    return true;
  });
}

function hashString(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Deterministic seat plan so the seat map, the route listing and the
 * booking API always agree on which seats are reserved for a given
 * route and travel date.
 */
export function seatPlan(route: Route, dateISO: string) {
  const rng = mulberry32(hashString(`${route.id}:${dateISO}`));
  const idx = Array.from({ length: route.seatsTotal }, (_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  const reservedCount = route.seatsTotal - route.seatsAvailable;
  const reserved = new Set(idx.slice(0, reservedCount).map((i) => i + 1));
  return {
    total: route.seatsTotal,
    reserved,
    availableCount: route.seatsTotal - reserved.size,
    isReserved: (seatNumber: number) => reserved.has(seatNumber),
  };
}
